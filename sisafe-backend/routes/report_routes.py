from flask import Blueprint, request, jsonify
from datetime import datetime

from config.db import reports_collection
from utils.auth_middleware import token_required

report_bp = Blueprint("report", __name__)


@report_bp.route("/report", methods=["POST"])
@token_required
def submit_report():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No input data provided"}), 400

        text = data.get("text", "").strip()
        prediction = data.get("prediction", "").strip()
        confidence = data.get("confidence")
        reason = data.get("reason", "").strip()
        note = data.get("note", "").strip()

        if not text:
            return jsonify({"error": "Reported text is required"}), 400

        report_doc = {
            "user_id": request.user["user_id"],
            "email": request.user["email"],
            "text": text,
            "prediction": prediction if prediction else None,
            "confidence": confidence if confidence is not None else None,
            "reason": reason if reason else "User flagged this content",
            "note": note if note else None,
            "created_at": datetime.utcnow()
        }

        reports_collection.insert_one(report_doc)

        return jsonify({
            "message": "Report submitted successfully"
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500