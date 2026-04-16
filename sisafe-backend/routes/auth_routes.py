from flask import Blueprint, request, jsonify, redirect
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from authlib.integrations.flask_client import OAuth
from dotenv import load_dotenv
import os

from config.db import users_collection
from utils.jwt_helper import create_token

load_dotenv()

auth_bp = Blueprint("auth", __name__)
oauth = OAuth()


def init_oauth(app):
    oauth.init_app(app)
    oauth.register(
        name="google",
        client_id=os.getenv("GOOGLE_CLIENT_ID"),
        client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
        server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
        client_kwargs={"scope": "openid email profile"},
    )


@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Invalid JSON data"}), 400

        name = data.get("name", "").strip()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "").strip()
        age = data.get("age")

        if not name or not email or not password or age is None:
            return jsonify({"error": "All fields are required"}), 400

        try:
            age = int(age)
        except (TypeError, ValueError):
            return jsonify({"error": "Age must be a valid number"}), 400

        if age < 10 or age > 100:
            return jsonify({"error": "Please enter a valid age"}), 400

        existing_user = users_collection.find_one({"email": email})
        if existing_user:
            return jsonify({"error": "Email already registered"}), 409

        hashed_password = generate_password_hash(password)

        new_user = {
            "name": name,
            "email": email,
            "password": hashed_password,
            "age": age,
            "provider": "local",
            "created_at": datetime.utcnow(),
        }

        users_collection.insert_one(new_user)

        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Invalid JSON data"}), 400

        email = data.get("email", "").strip().lower()
        password = data.get("password", "").strip()

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        user = users_collection.find_one({"email": email})

        if not user:
            return jsonify({"error": "User not found"}), 404

        provider = user.get("provider", "local")

        if provider == "google":
            return jsonify({"error": "This account uses Google login"}), 400

        stored_password = user.get("password")
        if not stored_password:
            return jsonify({"error": "Password not set for this account"}), 400

        if not check_password_hash(stored_password, password):
            return jsonify({"error": "Wrong password"}), 401

        token = create_token({
            "_id": str(user["_id"]),
            "name": user.get("name", ""),
            "email": user.get("email", ""),
            "provider": provider,
        })

        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {
                "id": str(user["_id"]),
                "name": user.get("name", ""),
                "email": user.get("email", ""),
                "age": user.get("age", "Not Available"),
                "provider": provider,
            },
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth_bp.route("/google/login")
def google_login():
    redirect_uri = os.getenv("BASE_URL") + "/api/auth/google/callback"
    return oauth.google.authorize_redirect(redirect_uri)


@auth_bp.route("/google/callback")
def google_callback():
    try:
        token = oauth.google.authorize_access_token()
        user_info = token.get("userinfo")

        if not user_info:
            return jsonify({"error": "Failed to get Google user info"}), 400

        email = user_info.get("email", "").strip().lower()
        name = user_info.get("name", "").strip()
        google_id = user_info.get("sub")

        user = users_collection.find_one({"email": email})

        if not user:
            new_user = {
                "name": name,
                "email": email,
                "password": None,
                "age": None,
                "provider": "google",
                "google_id": google_id,
                "created_at": datetime.utcnow(),
            }
            result = users_collection.insert_one(new_user)
            user = users_collection.find_one({"_id": result.inserted_id})
        else:
            update_fields = {}

            if not user.get("google_id"):
                update_fields["google_id"] = google_id

            if user.get("provider") != "google":
                update_fields["provider"] = "google"

            if update_fields:
                users_collection.update_one(
                    {"_id": user["_id"]},
                    {"$set": update_fields},
                )
                user = users_collection.find_one({"_id": user["_id"]})

        jwt_token = create_token({
            "_id": str(user["_id"]),
            "name": user.get("name", ""),
            "email": user.get("email", ""),
            "provider": user.get("provider", "google"),
        })

        frontend_url = os.getenv("FRONTEND_URL")
        return redirect(f"{frontend_url}/login-success?token={jwt_token}")

    except Exception as e:
        return jsonify({"error": str(e)}), 500