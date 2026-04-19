from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

# 🔥 Import routes
from routes.auth_routes import auth_bp, init_oauth
from routes.predict_routes import predict_bp
from routes.report_routes import report_bp
from routes.plugin_routes import plugin_bp
from routes.upload_detect_routes import upload_bp

load_dotenv()


def create_app():
    app = Flask(__name__)

    # 🔐 Config
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
    app.config["SESSION_COOKIE_HTTPONLY"] = True
    app.config["SESSION_COOKIE_SECURE"] = False  # local only

    # 🌐 CORS
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": [
                    "http://localhost:5173",
                    "http://localhost:5174",
                ],
            },
        },
        supports_credentials=True,
    )

    # 🔥 OAuth init
    init_oauth(app)

    # 🔥 Register routes
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(predict_bp, url_prefix="/api")
    app.register_blueprint(report_bp, url_prefix="/api")
    app.register_blueprint(plugin_bp, url_prefix="/api")
    app.register_blueprint(upload_bp, url_prefix="/api")

    # 🏠 Home route
    @app.route("/")
    def home():
        return {"message": "SiSafe backend is running 🚀"}

    return app


# 🔥 Create app instance
app = create_app()


# 🔥 MAIN RUN
if __name__ == "__main__":
    print("🚀 Starting SiSafe Backend...")

    app.run(
        host="127.0.0.1",
        port=5000,

        # ❗ VERY IMPORTANT FIX
        debug=False,          # ❌ disable debug
        use_reloader=False,   # ❌ disable double start
        threaded=True         # ✅ handle multiple requests
    )