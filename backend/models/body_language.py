import cv2
import mediapipe as mp

# Initialize MediaPipe Pose model
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(min_tracking_confidence=0.5, min_detection_confidence=0.5)

def extract_body_language(video_path):
    cap = cv2.VideoCapture(video_path)
    total_frames = 0
    extracted_data = []

    prev_landmarks = None
    prev_hand_speed = 0  

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break  

        # Resize frame to 480p (854x480 for 16:9 videos, or 640x480 for 4:3 videos)
        frame = cv2.resize(frame, (640, 480))

        total_frames += 1

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(frame_rgb)

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark

            # Body Part Tracking
            nose_x = landmarks[mp_pose.PoseLandmark.NOSE].x
            left_shoulder_y = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER].y
            right_shoulder_y = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER].y
            left_wrist_x = landmarks[mp_pose.PoseLandmark.LEFT_WRIST].x
            right_wrist_x = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST].x

            # Feature Extraction
            nose_movement = abs(nose_x - (prev_landmarks[mp_pose.PoseLandmark.NOSE].x if prev_landmarks else 0))
            body_movement = abs(left_shoulder_y - right_shoulder_y)
            hand_movement = abs(left_wrist_x - right_wrist_x)
            hand_speed = abs(hand_movement - prev_hand_speed)

            prev_hand_speed = hand_movement
            prev_landmarks = landmarks

            extracted_data.append({
                "nose_movement": nose_movement,
                "body_movement": body_movement,
                "hand_movement": hand_movement,
                "hand_speed": hand_speed
            })

    cap.release()
    return extracted_data, total_frames
