import cv2
from ultralytics import YOLO

# Load YOLOv8 Model
model = YOLO("yolov8n.pt")  # ✅ Using YOLOv8 for human detection

def detect_human(video_path):
    """
    Detects whether a human is present in the first 5 seconds of the video.
    If at least 3 frames (out of ~150) contain a detected person, return True.
    Otherwise, return False.
    """
    cap = cv2.VideoCapture(video_path)
    total_frames = 0
    person_detected_frames = 0  # ✅ Tracks number of frames with a person

    # **Check only the first 150 frames (~5 sec at 30 FPS)**
    max_frames = 150

    for _ in range(max_frames):
        ret, frame = cap.read()
        if not ret:
            break  # Stop if video ends

        total_frames += 1
        results = model(frame)  # Run YOLOv8 detection

        for r in results:
            detections = r.boxes.cls.cpu().numpy()  # Get detected object classes
            
            if 0 in detections:  # Class 0 = "person" in YOLO
                person_detected_frames += 1

        # ✅ If we detect a person in **at least 3 frames**, return success
        if person_detected_frames >= 100:
            cap.release()
            print("[INFO] Human detected in video.")
            return {"human_detected": True}

    cap.release()

    # ❌ If we **never detected a person in enough frames**, return failure
    if person_detected_frames < 3:
        print("[ERROR] No human detected in enough frames within the first 5 seconds!")
        return {"error": "No human detected in video. Please upload a valid presentation."}
