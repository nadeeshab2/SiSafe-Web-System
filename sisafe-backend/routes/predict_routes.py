from flask import Blueprint, request, jsonify
from datetime import datetime
import joblib
import os
from scipy.sparse import hstack

from config.db import detections_collection
from utils.auth_middleware import token_required

predict_bp = Blueprint("predict", __name__)

# Load model + vectorizers
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ML_DIR = os.path.join(BASE_DIR, "ml")

model = joblib.load(os.path.join(ML_DIR, "model.pkl"))
word_vectorizer = joblib.load(os.path.join(ML_DIR, "word_vectorizer.pkl"))
char_vectorizer = joblib.load(os.path.join(ML_DIR, "char_vectorizer.pkl"))

# 🔥 Strong offensive words (always hate)
strong_hate_keywords = [
    "පලයන්", "හුත්තො", "වේසී", "පකයා"
]

# ⚠️ Context dependent words (need targeting)
context_hate_keywords = [
    "මෝඩ", "මෝඩයා", "මෝඩයෙක්",
    "ගොන්", "ගොනා", "ගොනෙක්",
    "පිස්සු", "හරක", "නරක"
]

# 👤 Target words (person directed)
target_words = [
    "ඔයා", "ඔබ", "උබ", "තෝ", "නුඹ", "තමුසේ"
]


# text normalize function
def normalize_text(text):
    return (
        text.strip()
        .lower()
        .replace(",", " ")
        .replace(".", " ")
        .replace("!", " ")
        .replace("?", " ")
    )


@predict_bp.route("/predict", methods=["POST"])
@token_required
def predict():
    try:
        data = request.get_json()
        text = data.get("text", "").strip()

        if not text:
            return jsonify({"error": "Text is required"}), 400

        clean_text = normalize_text(text)

        # 🔍 Rule-based detection
        matched_strong = next((w for w in strong_hate_keywords if w in clean_text), None)
        matched_context = next((w for w in context_hate_keywords if w in clean_text), None)
        matched_target = next((w for w in target_words if w in clean_text), None)

        # 🚨 Strong hate → direct
        if matched_strong:
            result = "Hate Speech"
            confidence = 95

        # ⚠️ Context + target → hate
        elif matched_context and matched_target:
            result = "Hate Speech"
            confidence = 93

        else:
            # 🤖 ML prediction
            word_features = word_vectorizer.transform([text])
            char_features = char_vectorizer.transform([text])
            features = hstack([word_features, char_features])

            prediction = model.predict(features)[0]

            if prediction == 1:
                result = "Hate Speech"
                confidence = 90
            else:
                result = "Safe"
                confidence = 85

        # 💾 Save to MongoDB
        detection_doc = {
            "user_id": request.user["user_id"],
            "email": request.user["email"],
            "text": text,
            "prediction": result,
            "confidence": confidence,
            "created_at": datetime.utcnow()
        }

        detections_collection.insert_one(detection_doc)

        return jsonify({
            "prediction": result,
            "confidence": confidence,
            "message": "Prediction successful"
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500