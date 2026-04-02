/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import MainLayout from "../layouts/MainLayout";
import {
  FaChartLine,
  FaClock,
  FaFileAlt,
  FaKeyboard,
  FaMicrophoneAlt,
  FaUserCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "User",
    email: "Not Available",
    age: "Not Available",
    provider: "local",
  };

  const lastLogin = localStorage.getItem("lastLogin") || "Not Available";

  const stats = [
    {
      title: "Total Detections",
      value: 37,
      icon: <FaChartLine size={22} />,
    },
    {
      title: "Text Detections",
      value: 24,
      icon: <FaKeyboard size={22} />,
    },
    {
      title: "File Detections",
      value: 8,
      icon: <FaFileAlt size={22} />,
    },
    {
      title: "Voice Detections",
      value: 5,
      icon: <FaMicrophoneAlt size={22} />,
    },
  ];

  const recentActivity = [
    {
      type: "Text Detection",
      result: "Safe",
      time: "2026-04-02 10:30 AM",
    },
    {
      type: "File Detection",
      result: "Pending Review",
      time: "2026-04-02 11:10 AM",
    },
    {
      type: "Voice Detection",
      result: "Hate Speech",
      time: "2026-04-02 01:15 PM",
    },
    {
      type: "Text Detection",
      result: "Safe",
      time: "2026-04-02 03:45 PM",
    },
  ];

  return (
    <MainLayout>
      <section className="min-h-[85vh] bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <p className="text-cyan-400 font-semibold mb-3">Analytics Dashboard</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Welcome back, {user.name}
            </h1>
            <p className="text-slate-300 mt-4 leading-8 max-w-3xl">
              Here is your personal Sinhala detection analytics overview. This
              dashboard is designed to display your activity, usage, and future
              real-time data in one place.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 45 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-md p-6 shadow-xl"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-cyan-400 flex items-center justify-center mb-5">
                  {stat.icon}
                </div>
                <p className="text-slate-300 text-sm mb-2">{stat.title}</p>
                <h3 className="text-4xl font-bold text-white">{stat.value}</h3>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-1 rounded-3xl border border-white/10 bg-white/10 backdrop-blur-md p-6 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-5">
                <FaUserCircle className="text-cyan-400 text-2xl" />
                <h2 className="text-2xl font-bold text-white">Account Overview</h2>
              </div>

              <div className="space-y-4 text-slate-300">
                <div>
                  <p className="text-sm text-slate-400">Name</p>
                  <p className="font-semibold text-white">{user.name}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="font-semibold text-white">{user.email}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-400">Age</p>
                  <p className="font-semibold text-white">{user.age}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-400">Provider</p>
                  <p className="font-semibold text-white capitalize">{user.provider}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-400">Last Login</p>
                  <p className="font-semibold text-white">{lastLogin}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/10 backdrop-blur-md p-6 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-5">
                <FaClock className="text-cyan-400 text-xl" />
                <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
              </div>

              <div className="space-y-4">
                {recentActivity.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                  >
                    <div>
                      <p className="text-white font-semibold">{item.type}</p>
                      <p className="text-slate-400 text-sm">{item.time}</p>
                    </div>

                    <div
                      className={`px-4 py-2 rounded-full text-sm font-semibold w-fit ${
                        item.result === "Safe"
                          ? "bg-green-500/15 text-green-400 border border-green-500/30"
                          : item.result === "Hate Speech"
                          ? "bg-red-500/15 text-red-400 border border-red-500/30"
                          : "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                      }`}
                    >
                      {item.result}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-md p-6 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-white mb-5">Quick Actions</h2>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/#detect")}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:scale-105 transition"
              >
                Start Text Detection
              </button>

              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 rounded-2xl border border-slate-600 text-white hover:bg-slate-800 transition"
              >
                File Detection
              </button>

              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 rounded-2xl border border-slate-600 text-white hover:bg-slate-800 transition"
              >
                Voice Detection
              </button>

              <button
                onClick={() => navigate("/detect-result")}
                className="px-6 py-3 rounded-2xl border border-slate-600 text-white hover:bg-slate-800 transition"
              >
                View Latest Result
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}

export default Dashboard;