import librosa # type: ignore
import numpy as np
import moviepy.editor as mp # type: ignore
import os
import tempfile

def extract_audio_from_video(video_path):
    """Extracts and saves audio from video as a temporary WAV file."""
    video = mp.VideoFileClip(video_path)
    temp_audio_path = os.path.join(tempfile.gettempdir(), "temp_audio.wav")
    video.audio.write_audiofile(temp_audio_path, codec='pcm_s16le', verbose=False, logger=None)
    return temp_audio_path

def analyze_speech(audio_path):
    """Analyzes the extracted audio file using Librosa for speech characteristics."""
    y, sr = librosa.load(audio_path)

    # 1. Duration
    duration = librosa.get_duration(y=y, sr=sr)

    # 2. Root Mean Square (Volume Analysis)
    rms = librosa.feature.rms(y=y)[0]
    avg_volume = np.mean(rms)
    volume_score = "Loud & clear" if avg_volume > 0.02 else "Too soft"

    # 3. Pitch (Monotone or expressive)
    pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
    pitch_values = pitches[magnitudes > np.median(magnitudes)]
    pitch_std = np.std(pitch_values) if len(pitch_values) > 0 else 0
    pitch_variation = "Expressive" if pitch_std > 30 else "Monotone"

    # 4. Speaking Rate (Estimate by tempo)
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
    speaking_rate = f"{int(tempo)} BPM"

    # You could convert tempo to WPM approximation if needed

    return {
        "duration_sec": round(duration, 2),
        "avg_volume": float(avg_volume),
        "volume_analysis": volume_score,
        "pitch_std_dev": float(pitch_std),
        "pitch_analysis": pitch_variation,
        "speaking_rate": speaking_rate
    }

def analyze_video_speech(video_path):
    """Main function to be called by backend Flask app."""
    try:
        audio_path = extract_audio_from_video(video_path)
        return analyze_speech(audio_path)
    except Exception as e:
        return {"error": f"Speech analysis failed: {str(e)}"}
