import numpy as np
from models.body_language import extract_body_language

# **Thresholds for Analysis**
HEAD_STABILITY_THRESHOLD = 0.06  
BODY_STABILITY_THRESHOLD = 0.06  
HAND_GESTURE_MIN = 0.02  
HAND_GESTURE_MAX = 0.38  
HAND_SHAKE_THRESHOLD = 0.025  

def analyze_body_language(video_path):
    extracted_data, total_frames = extract_body_language(video_path)
    
    if total_frames == 0:
        return {
            "confidence_score": "N/A",
            "strengths": [],
            "problems_detected": ["❌ No valid frames detected."],
            "keys_to_improve": ["❌ Ensure the video captures the presenter."]
        }

    # **Tracking Counts**
    stable_posture_count = 0
    excessive_movement_count = 0
    controlled_gesture_count = 0
    fluid_gesture_count = 0  
    no_hand_movement_count = 0  

    reasoning_set = set()  
    improvement_set = set()  
    strength_set = set()  

    for frame_data in extracted_data:
        nose_movement = frame_data["nose_movement"]
        body_movement = frame_data["body_movement"]
        hand_movement = frame_data["hand_movement"]
        hand_speed = frame_data["hand_speed"]

        # ✅ **Posture Analysis**
        if nose_movement < HEAD_STABILITY_THRESHOLD and body_movement < BODY_STABILITY_THRESHOLD:
            stable_posture_count += 1
            strength_set.add("✅ Maintained a strong and steady posture.")
        elif body_movement > BODY_STABILITY_THRESHOLD * 1.5:
            excessive_movement_count += 1
            reasoning_set.add("⚠️ Some instability in posture, try to reduce movement.")
            improvement_set.add("✔ Maintain a straight posture and minimize unnecessary movements.")

        # ✅ **Hand Gesture Analysis**
        if HAND_GESTURE_MIN < hand_movement < HAND_GESTURE_MAX:
            controlled_gesture_count += 1
            if hand_speed < HAND_SHAKE_THRESHOLD:  
                fluid_gesture_count += 1  
                strength_set.add("✅ Smooth and natural hand gestures used effectively.")
            else:
                reasoning_set.add("⚠️ Some hand movements were too fast or shaky.")
                improvement_set.add("✔ Ensure hand gestures are smooth and controlled.")

        elif hand_movement < HAND_GESTURE_MIN:  
            no_hand_movement_count += 1  
            reasoning_set.add("⚠️ Too few hand movements detected. This can make the presentation seem stiff.")
            improvement_set.add("✔ Use natural hand gestures to emphasize points and improve engagement.")

    # ✅ **Final Confidence Calculation**
    confidence_score = (stable_posture_count / total_frames) * 55  
    gesture_factor = (fluid_gesture_count / total_frames) * 45  
    movement_penalty = (excessive_movement_count / total_frames) * 10  
    stiffness_penalty = (no_hand_movement_count / total_frames) * 10  

    final_score = max(0, min(100, confidence_score + gesture_factor - movement_penalty - stiffness_penalty))

    # ✅ **Prevent Contradictions**
    if "⚠️ Too few hand movements detected. This can make the presentation seem stiff." in reasoning_set and \
       "⚠️ Some hand movements were too fast or shaky." in reasoning_set:
        reasoning_set.remove("⚠️ Too few hand movements detected. This can make the presentation seem stiff.")

    # ✅ **Final Structured Feedback**
    return {
        "confidence_score": f"{int(final_score)}/100",
        "strengths": list(strength_set) if strength_set else ["✅ No major strengths detected."],
        "problems_detected": list(reasoning_set) if reasoning_set else ["✅ No major issues detected!"],
        "keys_to_improve": list(improvement_set) if improvement_set else ["✅ No major improvements needed, great job!"]
    }
