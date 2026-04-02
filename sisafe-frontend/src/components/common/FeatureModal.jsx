// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { FaFileAlt, FaKeyboard, FaMicrophoneAlt, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function FeatureModal({ isOpen, onClose }) {
  const [selectedMode, setSelectedMode] = useState("file");
  const navigate = useNavigate();

  const handleDetect = () => {
    navigate("/detect-result", {
      state: {
        inputText: `${selectedMode} detection selected`,
        prediction: "Pending Detection",
        confidence: null,
        selectedMode,
      },
    });
    onClose();
  };

  const getCardClass = (mode) =>
    `rounded-2xl border p-5 cursor-pointer transition duration-300 ${
      selectedMode === mode
        ? "border-cyan-400 bg-cyan-500/10 shadow-lg"
        : "border-slate-700 bg-slate-900/60 hover:border-blue-500"
    }`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-950 p-8 shadow-2xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <FaTimes size={20} />
            </button>

            <p className="text-cyan-400 font-semibold mb-2">Explore Features</p>
            <h2 className="text-3xl font-bold text-white mb-3">
              Choose Detection Method
            </h2>
            <p className="text-slate-400 mb-8">
              Select how you want to analyze Sinhala content in SiSafe.
            </p>

            <div className="grid md:grid-cols-3 gap-5">
              <div
                className={getCardClass("text")}
                onClick={() => setSelectedMode("text")}
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-cyan-400 flex items-center justify-center mb-4">
                  <FaKeyboard size={22} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Text Detect</h3>
                <p className="text-sm text-slate-400 leading-6">
                  Analyze typed or pasted Sinhala text instantly.
                </p>
              </div>

              <div
                className={getCardClass("file")}
                onClick={() => setSelectedMode("file")}
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-cyan-400 flex items-center justify-center mb-4">
                  <FaFileAlt size={22} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">File Detect</h3>
                <p className="text-sm text-slate-400 leading-6">
                  Detect harmful content from uploaded files and documents.
                </p>
              </div>

              <div
                className={getCardClass("voice")}
                onClick={() => setSelectedMode("voice")}
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-cyan-400 flex items-center justify-center mb-4">
                  <FaMicrophoneAlt size={22} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Voice Detect</h3>
                <p className="text-sm text-slate-400 leading-6">
                  Analyze spoken Sinhala content through voice input.
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-900 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleDetect}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:scale-105 transition"
              >
                Detect Now
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default FeatureModal;