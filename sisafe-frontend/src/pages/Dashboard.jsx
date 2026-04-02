/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import MainLayout from "../layouts/MainLayout";
import { FaChartLine, FaFileAlt, FaKeyboard, FaMicrophoneAlt } from "react-icons/fa";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || { name: "User" };

  const stats = [
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
    {
      title: "Usage Score",
      value: "92%",
      icon: <FaChartLine size={22} />,
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
            <p className="text-cyan-400 font-semibold mb-3">User Dashboard</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Welcome back, {user.name}
            </h1>
            <p className="text-slate-300 mt-4 leading-8 max-w-3xl">
              Here is your Sinhala content detection overview. This dashboard is ready
              for future real-time integration with your text, file, and voice detection data.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 45 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
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

          <motion.div
            initial={{ opacity: 0, y: 45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-10 rounded-3xl border border-white/10 bg-white/10 backdrop-blur-md p-8 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Dashboard Summary</h2>
            <p className="text-slate-300 leading-8">
              This is your personal static dashboard for now. Later, we can connect it to
              backend data sources such as detection history, uploaded files, voice records,
              and analytics reports to display real-time values.
            </p>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}

export default Dashboard;