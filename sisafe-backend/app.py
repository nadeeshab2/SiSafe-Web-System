from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

from routes.auth_routes import auth_bp, init_oauth

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")

CORS(app, supports_credentials=True)

init_oauth(app)

app.register_blueprint(auth_bp, url_prefix="/api/auth")


@app.route("/")
def home():
    return "SiSafe Auth Backend Running"


if __name__ == "__main__":
    app.run(debug=True)