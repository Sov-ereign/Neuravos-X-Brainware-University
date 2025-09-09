import cv2
import torch
import numpy as np
from ultralytics import YOLO
from deepface import DeepFace

# ✅ Load YOLOv8 Face Detection Model
device = "cuda" if torch.cuda.is_available() else "cpu"
face_model = YOLO("yolov8n-face.pt").to(device)  # Smallest YOLOv8 face model

def analyze_facial_expressions(video_path):
    cap = cv2.VideoCapture(video_path)
    processed_frames = 0
    emotion_counts = {}

    print("[INFO] Starting facial expression analysis...")

    frame_count = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret or frame is None:
            break  

        frame_count += 1
        if frame_count % 30 != 0:  # Process every 15th frame for efficiency
            continue

        processed_frames += 1

        # ✅ Run YOLOv8 face detection
        results = face_model(frame, conf=0.5, imgsz=640)

        faces = results[0].boxes.xyxy.cpu().numpy()  # Extract bounding boxes
        if len(faces) == 0:
            continue  # Skip frames with no detected face

        try:
            for (x1, y1, x2, y2) in faces:
                # Crop the face region
                face_crop = frame[int(y1):int(y2), int(x1):int(x2)]
                if face_crop.size == 0:
                    continue  # Skip if the crop is empty

                # Run DeepFace emotion analysis
                result = DeepFace.analyze(face_crop, actions=["emotion"], enforce_detection=False)
                if isinstance(result, list):
                    result = result[0]

                dominant_emotion = result["dominant_emotion"]
                emotion_counts[dominant_emotion] = emotion_counts.get(dominant_emotion, 0) + 1

        except Exception as e:
            print(f"[ERROR] Failed to analyze frame {frame_count}: {e}")

    cap.release()
    cv2.destroyAllWindows()

    print(f"[INFO] Processed {processed_frames} frames.")

    if emotion_counts:
        dominant_emotion = max(emotion_counts, key=emotion_counts.get)
        print(f"[RESULT] Dominant Emotion: {dominant_emotion}")
        return {"dominant_emotion": dominant_emotion, "emotion_counts": emotion_counts}

    print("[WARNING] No face detected in the video.")
    return {"error": "No face detected"}

