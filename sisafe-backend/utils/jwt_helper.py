import jwt
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

def create_token(user):
    payload = {
        "user_id": str(user["_id"]),
        "email": user["email"],
        "provider": user.get("provider", "local"),
        "exp": datetime.utcnow() + timedelta(days=1)
    }

    token = jwt.encode(payload, os.getenv("SECRET_KEY"), algorithm="HS256")
    return token