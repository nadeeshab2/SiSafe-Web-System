/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";
import MainLayout from "../layouts/MainLayout";
import { motion } from "framer-motion";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.age ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill all fields.");
      return;
    }

    // age validation
    if (formData.age < 10 || formData.age > 100) {
      alert("Please enter a valid age.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        name: formData.name,
        email: formData.email,
        age: Number(formData.age),
        password: formData.password,
      });

      alert("Signup successful. Please login now.");
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      alert(error?.response?.data?.error || "Signup failed.");
    } finally {
      setLoading(false);
    }
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
            <p className="text-cyan-400 font-semibold mb-3">Create Account</p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Join SiSafe and start smarter Sinhala detection
            </h1>
            <p className="mt-6 text-slate-300 leading-8">
              Create your account to access dashboard, analytics and detection tools.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSignup}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-md p-8 shadow-2xl"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Sign Up</h2>

            <div className="space-y-5">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl bg-slate-950/70 border border-slate-700 text-white outline-none focus:border-cyan-400"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl bg-slate-950/70 border border-slate-700 text-white outline-none focus:border-cyan-400"
              />

              {/* NEW AGE FIELD */}
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl bg-slate-950/70 border border-slate-700 text-white outline-none focus:border-cyan-400"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl bg-slate-950/70 border border-slate-700 text-white outline-none focus:border-cyan-400"
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl bg-slate-950/70 border border-slate-700 text-white outline-none focus:border-cyan-400"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:scale-[1.02] transition"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </div>

            <p className="text-slate-300 mt-6 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-cyan-400 hover:underline">
                Login
              </Link>
            </p>
          </motion.form>
        </div>
      </section>
    </MainLayout>
  );
}

export default Signup;