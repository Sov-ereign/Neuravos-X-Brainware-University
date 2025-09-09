from flask import Flask, request, jsonify
from flask_cors import CORS
from waitress import serve
import os
import traceback
import tempfile
from werkzeug.utils import secure_filename
from speech_analyzer import analyze_video_speech
from emotion_detector import analyze_facial_expressions
from confidence_tracker import analyze_body_language
from human_detection import detect_human  # ✅ YOLOv8-based Human Detection
from concurrent.futures import ThreadPoolExecutor  # ✅ Multi-threading for parallel execution
from chatbot import CampusAIChatbot
from models.scam_detector import scam_bp

app = Flask(__name__)
CORS(app)
# Use temporary directory for video processing (works on Render)
app.config['UPLOAD_FOLDER'] = tempfile.gettempdir()

# Register Blueprints
app.register_blueprint(scam_bp)

# Initialize Campus AI Chatbot
GEMINI_API_KEY = "AIzaSyAfhqpWCog-Mdj8tveo7wwNF3xy3r_tOdU"
chatbot = CampusAIChatbot(GEMINI_API_KEY)

@app.route('/analyze', methods=['POST'])
def analyze_presentation():
    try:
        print("[INFO] Received /analyze request.")

        # ✅ **Check if video is uploaded**
        if 'video' not in request.files:
            print("[ERROR] No video uploaded!")
            return jsonify({'error': 'No video uploaded'}), 400

        video = request.files['video']
        filename = secure_filename(video.filename)
        
        # ✅ **Save video to temporary file (works on Render)**
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4', dir=app.config['UPLOAD_FOLDER']) as tmp_file:
                video.save(tmp_file.name)
                video_path = tmp_file.name
            print(f"[INFO] Video saved to temporary file: {video_path}")
        except Exception as e:
            print(f"[ERROR] Failed to save video: {e}")
            return jsonify({'error': f'Failed to save video: {str(e)}'}), 500

        print("[INFO] Running human detection check...")
        human_check = detect_human(video_path)

        # ✅ **Fix: Properly handle no-human detection**
        if not human_check or "error" in human_check:
            print("[WARNING] No human detected. Skipping analysis.")
            return jsonify({'error': "No human detected in the video."}), 400
        
        # After verifying human detection:
        speech_result = analyze_video_speech(video_path)
        if "error" in speech_result:
            print("[WARNING] Speech analysis failed.")
        else:
            print("[INFO] Speech analysis done.")

        print("[INFO] Running analysis in parallel...")

        # ✅ **Ensure Proper Multi-threading**
        with ThreadPoolExecutor(max_workers=2) as executor:
            future_emotion = executor.submit(analyze_facial_expressions, video_path)
            future_confidence = executor.submit(analyze_body_language, video_path)

            # ✅ Confirm both tasks start at the same time
            print("[INFO] Starting facial expression analysis...")
            print("[INFO] Starting body language confidence analysis...")

            emotion_result = future_emotion.result()
            confidence_result = future_confidence.result()

        print(f"[RESULT] Emotion Analysis: {emotion_result}")
        print(f"[RESULT] Confidence Analysis: {confidence_result}")

        # ─────────────────────────────────────────────────────────────
        # Normalize payload for React frontend
        # Body language
        body_score = 0
        strengths = []
        problems = []
        improvements = []
        if isinstance(confidence_result, dict):
            raw_score = confidence_result.get("confidence_score", "0/100")
            try:
                body_score = int(str(raw_score).split("/")[0])
            except Exception:
                body_score = 0
            strengths = confidence_result.get("strengths", []) or []
            problems = confidence_result.get("problems_detected", []) or []
            improvements = confidence_result.get("keys_to_improve", []) or []

        body_language = {
            "score": body_score,
            "strengths": strengths,
            "problems_detected": problems,
            "keys_to_improve": improvements,
        }

        # Speech analysis → numeric fields expected by React
        duration_sec = 0.0
        speaking_rate_num = 0
        volume_pct = 0
        pitch_val = 0
        if isinstance(speech_result, dict) and "error" not in speech_result:
            duration_sec = float(speech_result.get("duration_sec", 0.0) or 0.0)
            # speaking_rate can be like "120 BPM"; extract leading number
            sr_text = str(speech_result.get("speaking_rate", "0")).strip()
            try:
                speaking_rate_num = int("".join(ch for ch in sr_text if ch.isdigit()))
            except Exception:
                speaking_rate_num = 0
            avg_volume = float(speech_result.get("avg_volume", 0.0) or 0.0)
            # Map avg_volume (typically ~0-0.05) to 0-100
            volume_pct = max(0, min(100, int(avg_volume * 5000)))
            # Use pitch_std_dev as a proxy value in Hz range
            pitch_std = float(speech_result.get("pitch_std_dev", 0.0) or 0.0)
            pitch_val = max(0, int(120 + min(pitch_std, 80)))

        speech_analysis_norm = {
            "duration": int(duration_sec),
            "speaking_rate": speaking_rate_num,
            "volume": volume_pct,
            "pitch": pitch_val,
        }

        # Speech score heuristic
        speech_score = 0
        if isinstance(speech_result, dict):
            volume_analysis = str(speech_result.get("volume_analysis", "")).lower()
            pitch_analysis = str(speech_result.get("pitch_analysis", "")).lower()
            speech_score += 50 if "loud" in volume_analysis or "clear" in volume_analysis else 30
            speech_score += 50 if "expressive" in pitch_analysis else 30
            speech_score = max(0, min(100, speech_score))

        # Emotion analysis → normalize counts to distribution
        dominant_emotion = "neutral"
        emotions_map = {}
        if isinstance(emotion_result, dict) and "error" not in emotion_result:
            dominant_emotion = str(emotion_result.get("dominant_emotion", "neutral")).lower()
            counts = emotion_result.get("emotion_counts") or emotion_result.get("emotions") or {}
            if isinstance(counts, dict) and counts:
                total = sum(float(v) for v in counts.values()) or 1.0
                emotions_map = {k: float(v) / total for k, v in counts.items()}

        emotion_analysis_norm = {
            "dominant_emotion": dominant_emotion,
            "emotions": emotions_map,
        }

        # Overall score blend
        overall_score = int(max(0, min(100, 0.5 * body_score + 0.5 * speech_score)))

        response_data = {
            "overall_score": overall_score,
            "body_score": body_score,
            "speech_score": speech_score,
            "emotion": dominant_emotion,
            "body_language": body_language,
            "speech_analysis": speech_analysis_norm,
            "emotion_analysis": emotion_analysis_norm,
            # Keep raw sections for debugging/reference if needed
            "video_path": video_path,
        }

        # ✅ **Clean up temporary video file**
        try:
            if 'video_path' in locals() and os.path.exists(video_path):
                os.unlink(video_path)
                print(f"[INFO] Cleaned up temporary file: {video_path}")
        except Exception as cleanup_error:
            print(f"[WARNING] Failed to clean up temporary file: {cleanup_error}")

        return jsonify(response_data)
    

    except Exception as e:
        print("[CRITICAL ERROR] Backend Crashed!")
        print(traceback.format_exc())
        
        # ✅ **Clean up temporary file even on error**
        try:
            if 'video_path' in locals() and os.path.exists(video_path):
                os.unlink(video_path)
        except:
            pass
            
        return jsonify({'error': 'Critical backend failure'}), 500

@app.route('/chat', methods=['POST'])
def chat():
    """Handle chat messages for Campus AI."""
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({'error': 'No message provided'}), 400
        
        user_message = data['message']
        print(f"[CHAT] Received message: {user_message}")
        
        # Get response from chatbot
        response = chatbot.chat(user_message)
        
        return jsonify({
            'response': response,
            'status': 'success'
        })
        
    except Exception as e:
        print(f"[CHAT ERROR] {e}")
        return jsonify({
            'error': 'Failed to process chat message',
            'response': 'I apologize, but I\'m having trouble processing your request right now. Please try again later.'
        }), 500

@app.route('/timetable/<day>', methods=['GET'])
def get_timetable_day(day):
    """Get timetable for a specific day."""
    try:
        response = chatbot.get_timetable_for_day(day)
        return jsonify({
            'day': day,
            'schedule': response,
            'status': 'success'
        })
    except Exception as e:
        print(f"[TIMETABLE ERROR] {e}")
        return jsonify({
            'error': 'Failed to get timetable',
            'response': 'Sorry, I couldn\'t retrieve the timetable information.'
        }), 500

@app.route('/subject/<subject_name>', methods=['GET'])
def get_subject_info(subject_name):
    """Get information about a specific subject."""
    try:
        response = chatbot.get_subject_info(subject_name)
        return jsonify({
            'subject': subject_name,
            'info': response,
            'status': 'success'
        })
    except Exception as e:
        print(f"[SUBJECT ERROR] {e}")
        return jsonify({
            'error': 'Failed to get subject information',
            'response': 'Sorry, I couldn\'t retrieve the subject information.'
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    print(f"[INFO] Starting Flask Server on port {port}...")
    serve(app, host="0.0.0.0", port=port)
