import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function LoginSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("lastLogin", new Date().toLocaleString());

      // optional basic user placeholder
      const existingUser = JSON.parse(localStorage.getItem("user")) || {
        name: "Google User",
        email: "Google Account",
        age: "Not Available",
        provider: "google",
      };

      localStorage.setItem("user", JSON.stringify(existingUser));

      navigate("/");
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <p className="text-xl font-semibold">Signing you in with Google...</p>
    </div>
  );
}

export default LoginSuccess;