import { Link } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

function Navbar() {
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-blue-900/40"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-blue-700 to-cyan-500 flex items-center justify-center text-white shadow-lg">
            <FaShieldAlt size={20} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">SiSafe</h1>
            <p className="text-xs text-slate-300">Sinhala Hate Speech Detection</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-200">
          <a href="#home" className="hover:text-cyan-400 transition">Home</a>
          <a href="#features" className="hover:text-cyan-400 transition">Features</a>
          <a href="#detect" className="hover:text-cyan-400 transition">Detect</a>
          <a href="#about" className="hover:text-cyan-400 transition">About</a>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-5 py-2 rounded-xl border border-blue-500 text-blue-200 font-medium hover:bg-blue-900/30 transition">
            Login
          </button>
          <button className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium shadow-lg hover:scale-105 transition">
            Sign Up
          </button>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;