from flask import Blueprint, request, jsonify
from datetime import datetime
import os
import joblib
from scipy.sparse import hstack

from config.db import detections_collection

plugin_bp = Blueprint("plugin", __name__)

# Load model + vectorizers from ml folder
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "ml")

model = joblib.load(os.path.join(MODELS_DIR, "model.pkl"))
word_vectorizer = joblib.load(os.path.join(MODELS_DIR, "word_vectorizer.pkl"))
char_vectorizer = joblib.load(os.path.join(MODELS_DIR, "char_vectorizer.pkl"))

# Optional rule-based bad words check
bad_words = {"මෝඩ", "කැත", "ගොන්", "පිස්සු", "හරක", "නරක", "අපිරිසිදු"}


@plugin_bp.route("/plugin/check", methods=["POST"])
def plugin_check():
    try:
        data = request.get_json()

        if not data or "text" not in data:
            return jsonify({
                "success": False,
                "message": "Text is required"
            }), 400

        text = data["text"].strip()

        if text == "":
            return jsonify({
                "success": False,
                "message": "Empty text is not allowed"
            }), 400

        clean_text = text.lower()
        tokens = (
            clean_text.replace(",", " ")
            .replace(".", " ")
            .replace("!", " ")
            .replace("?", " ")
            .split()
        )

        if any(token in bad_words for token in tokens):
            result = "Hate Speech"
            confidence = 95
        else:
            word_features = word_vectorizer.transform([text])
            char_features = char_vectorizer.transform([text])
            features = hstack([word_features, char_features])

            prediction = model.predict(features)[0]
            result = "Hate Speech" if prediction == 1 else "Safe"
            confidence = 95

        action = "warn" if result == "Hate Speech" else "allow"

        # Save plugin detection to MongoDB
        saved_result = detections_collection.insert_one({
            "text": text,
            "prediction": result,
            "confidence": confidence,
            "source": "plugin",
            "action": action,
            "created_at": datetime.utcnow()
        })

        return jsonify({
            "success": True,
            "message": "Plugin check completed successfully",
            "detection_id": str(saved_result.inserted_id),
            "prediction": result,
            "confidence": confidence,
            "action": action
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Plugin check failed",
            "error": str(e)
        }), 500