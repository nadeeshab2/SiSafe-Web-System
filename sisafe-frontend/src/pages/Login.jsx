/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getGoogleLoginUrl, loginUser } from "../api/authApi";
import MainLayout from "../layouts/MainLayout";
import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(formData);

      localStorage.setItem("token", data.token || "demo-token");
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: data?.user?.name || "User",
          email: data?.user?.email || formData.email,
          age: data?.user?.age || "Not Available",
          provider: data?.user?.provider || "local",
        })
      );

      localStorage.setItem("lastLogin", new Date().toLocaleString());

      alert("Login successful.");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      alert(error?.response?.data?.error || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = getGoogleLoginUrl();
  };

  return (
    <MainLayout>
      <section className="min-h-[85vh] bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-16 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <p className="text-cyan-400 font-semibold mb-3">Welcome Back</p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Login to access your personal SiSafe analytics dashboard
            </h1>
            <p className="mt-6 text-slate-300 leading-8">
              Continue your Sinhala detection workflow, monitor activity, and
              access your personalized analytics in one place.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleLogin}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-md p-8 shadow-2xl"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Login</h2>

            <div className="space-y-5">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl bg-slate-950/70 border border-slate-700 text-white placeholder:text-slate-500 outline-none focus:border-cyan-400"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl bg-slate-950/70 border border-slate-700 text-white placeholder:text-slate-500 outline-none focus:border-cyan-400"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:scale-[1.01] transition"
              >
                {loading ? "Logging In..." : "Login"}
              </button>

              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-slate-700"></div>
                <span className="text-slate-400 text-sm">or continue with</span>
                <div className="flex-1 h-px bg-slate-700"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-4 rounded-2xl border border-slate-600 text-white font-semibold flex items-center justify-center gap-3 hover:bg-slate-800 transition"
              >
                <FaGoogle />
                Continue with Google
              </button>
            </div>

            <p className="text-slate-300 mt-6 text-center">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-cyan-400 font-semibold hover:underline">
                Sign Up
              </Link>
            </p>
          </motion.form>
        </div>
      </section>
    </MainLayout>
  );
}

export default Login;