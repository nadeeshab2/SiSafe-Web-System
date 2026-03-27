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
        client_kwargs={"scope": "openid email profile"}
    )


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "All fields required"}), 400

    existing = users_collection.find_one({"email": email})
    if existing:
        return jsonify({"error": "User exists"}), 409

    hashed = generate_password_hash(password)

    user = {
        "name": name,
        "email": email,
        "password": hashed,
        "provider": "local",
        "google_id": None,
        "created_at": datetime.utcnow()
    }

    result = users_collection.insert_one(user)
    user["_id"] = result.inserted_id

    token = create_token(user)

    return jsonify({
        "message": "Registered",
        "token": token
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user = users_collection.find_one({"email": email})

    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.get("provider") == "google":
        return jsonify({"error": "This account uses Google login"}), 400

    if not check_password_hash(user["password"], password):
        return jsonify({"error": "Wrong password"}), 401

    token = create_token(user)

    return jsonify({
        "message": "Login success",
        "token": token
    }), 200


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

        email = user_info["email"]
        name = user_info.get("name", "")
        google_id = user_info.get("sub")

        user = users_collection.find_one({"email": email})

        if not user:
            new_user = {
                "name": name,
                "email": email,
                "password": None,
                "provider": "google",
                "google_id": google_id,
                "created_at": datetime.utcnow()
            }
            result = users_collection.insert_one(new_user)
            new_user["_id"] = result.inserted_id
            user = new_user
        else:
            if not user.get("google_id"):
                users_collection.update_one(
                    {"_id": user["_id"]},
                    {"$set": {"provider": "google", "google_id": google_id}}
                )
                user["provider"] = "google"
                user["google_id"] = google_id

        jwt_token = create_token(user)
        frontend_url = os.getenv("FRONTEND_URL")
        return redirect(f"{frontend_url}/login-success?token={jwt_token}")

    except Exception as e:
        return jsonify({"error": str(e)}), 500