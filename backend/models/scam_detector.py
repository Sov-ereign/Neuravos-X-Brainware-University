from flask import Blueprint, request, jsonify, render_template_string
import joblib
import google.generativeai as genai
import os
import re
from pathlib import Path

# Expose as a Blueprint to plug into the main Flask app
scam_bp = Blueprint("scam", __name__, url_prefix="/scam")

def _load_joblib_safely(filename: str):
    """Try multiple locations for artifacts to be resilient to CWD."""
    candidate_paths = [
        Path(filename),
        Path(__file__).resolve().parent / filename,
        Path(__file__).resolve().parent.parent / filename,
        Path(__file__).resolve().parent.parent.parent / filename,
    ]
    for path in candidate_paths:
        try:
            if path.exists():
                return joblib.load(str(path))
        except Exception:
            continue
    raise FileNotFoundError(f"Could not find artifact: {filename} in {candidate_paths}")

# Lazy-loaded globals
model = None
vectorizer = None

def _ensure_models_loaded():
    global model, vectorizer
    if model is None or vectorizer is None:
        model = _load_joblib_safely("sms_model.pkl")
        vectorizer = _load_joblib_safely("tfidf_vectorizer.pkl")
        try:
            print("Model classes:", getattr(model, "classes_", None))
        except Exception:
            pass

# ----------------------------
# Setup Gemini API
# ----------------------------
# Make sure to set environment variable GEMINI_API_KEY
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
gemini_model = genai.GenerativeModel("gemini-1.5-flash")


def detect_suspicious_patterns(message: str) -> dict:
    """Detect suspicious patterns in the message."""
    patterns = {
        'has_url': bool(re.search(r'https?://|www\.|\.(com|org|net|io|co|uk|de|fr|it|es|ca|au|jp|cn|in|br|ru|pl|nl|se|no|dk|fi|ch|at|be|cz|hu|ro|bg|hr|sk|si|lt|lv|ee|lu|mt|cy|ie|pt|gr|pl|cz|hu|ro|bg|hr|sk|si|lt|lv|ee|lu|mt|cy|ie|pt|gr)', message.lower())),
        'has_shortened_url': bool(re.search(r'(bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly|is\.gd|v\.gd|short\.link|tiny\.cc|shorturl\.at)', message.lower())),
        'has_phone': bool(re.search(r'(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}', message)),
        'has_urgent_language': bool(re.search(r'\b(urgent|immediate|act now|limited time|expires|deadline|final notice|last chance|don\'t miss|hurry|quick|asap|emergency)\b', message.lower())),
        'has_financial_terms': bool(re.search(r'\b(money|cash|payment|bank|account|credit|debit|card|loan|debt|refund|prize|winner|lottery|jackpot|million|billion|dollar|euro|pound|rupee)\b', message.lower())),
        'has_suspicious_chars': bool(re.search(r'[^\w\s\.\-\@\:\/]', message)),
        'is_very_short': len(message.strip()) < 10,
        'is_very_long': len(message.strip()) > 500
    }
    return patterns

def predict_with_gemini(message: str) -> str:
    """Get Gemini's prediction (spam/ham)."""
    # Check if message contains URLs (common in QR codes)
    has_url = any(protocol in message.lower() for protocol in ['http://', 'https://', 'www.', '.com', '.org', '.net', '.io'])
    
    prompt = f"""
    You are a fraud detection system that analyzes messages and URLs for potential scams, phishing, or malicious content.
    Classify this content as either 'spam' or 'ham' (ham = safe message).

    Content: "{message}"
    
    Consider these factors:
    - If it's a URL, check if it looks suspicious or leads to known malicious sites
    - Look for urgent language, threats, or requests for personal information
    - Check for suspicious domains or shortened URLs
    - Look for common scam patterns like fake offers, lottery wins, or urgent actions
    
    Answer ONLY 'spam' or 'ham'.
    """
    try:
        response = gemini_model.generate_content(prompt)
        text = response.text.strip().lower()
        if "spam" in text:
            return "spam"
        elif "ham" in text:
            return "ham"
        else:
            return "unknown"
    except Exception as e:
        print("Gemini error:", e)
        return "error"


# ----------------------------
# Routes
# ----------------------------
@scam_bp.route("/")
def home():
    return """
    <h2>Real-time SMS Fraud Detector (Hybrid ML + Gemini)</h2>
    <p>Go to <a href='/scam/predict_page'>Predict SMS</a> to test messages.</p>
    """


@scam_bp.route("/predict_page")
def predict_page():
    html_page = """
    <h2>SMS Spam Detector (Hybrid)</h2>
    <input id="messageInput" placeholder="Type message here" style="width:300px; padding:5px;">
    <button onclick="sendMessage()">Predict</button>
    <h3 id="result"></h3>

    <script>
        async function sendMessage() {
            const message = document.getElementById("messageInput").value;
            if (!message) {
                alert("Please enter a message!");
                return;
            }

            const response = await fetch("/scam/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: message })
            });

            const data = await response.json();

            if (data.final_prediction) {
                document.getElementById("result").innerHTML =
                    "<b>ML Prediction:</b> " + data.ml_prediction +
                    "<br><b>Gemini Prediction:</b> " + data.gemini_prediction +
                    "<br><b style='color:blue;'>Final Decision:</b> " + data.final_prediction;
            } else {
                document.getElementById("result").innerText = "Error: " + data.error;
            }

            document.getElementById("messageInput").value = ""; // clear input
        }
    </script>
    """
    return render_template_string(html_page)


@scam_bp.route("/predict", methods=["POST"])
def predict_api():
    data = request.json
    message = data.get("message", "")

    if not message:
        return jsonify({"error": "No message provided"}), 400

    # ----------------------------
    # Pattern Analysis
    # ----------------------------
    patterns = detect_suspicious_patterns(message)
    
    # ----------------------------
    # ML Prediction
    # ----------------------------
    try:
        _ensure_models_loaded()
        message_tfidf = vectorizer.transform([message])
        ml_prediction = model.predict(message_tfidf)[0]  # "ham" or "spam"
    except Exception as e:
        return jsonify({"error": f"Model error: {str(e)}"}), 500

    # ----------------------------
    # Gemini Prediction
    # ----------------------------
    gemini_prediction = predict_with_gemini(message)

    # ----------------------------
    # Enhanced Hybrid Decision Logic
    # ----------------------------
    if gemini_prediction == "error" or gemini_prediction == "unknown":
        final_prediction = ml_prediction  # fallback
    elif gemini_prediction == ml_prediction:
        final_prediction = ml_prediction  # agreement → confident
    else:
        # Conflict → use pattern analysis to decide
        suspicious_count = sum(patterns.values())
        if suspicious_count >= 3:  # Multiple suspicious patterns
            final_prediction = "spam"
        elif patterns['has_shortened_url'] or patterns['has_urgent_language']:
            final_prediction = "spam"  # High-risk patterns
        else:
            final_prediction = gemini_prediction  # Trust Gemini for edge cases

    return jsonify({
        "ml_prediction": str(ml_prediction),
        "gemini_prediction": str(gemini_prediction),
        "final_prediction": str(final_prediction),
        "patterns": patterns,
        "risk_score": sum(patterns.values()),
        "content_type": "url" if patterns['has_url'] else "text"
    })
