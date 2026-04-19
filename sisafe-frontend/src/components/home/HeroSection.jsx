// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { detectText } from "../../api/detectApi";
import FeatureModal from "../common/FeatureModal";

function HeroSection() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [file, setFile] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleDetect = async () => {
    if (!text.trim()) {
      alert("Please enter Sinhala text first.");
      return;
    }

    try {
      setLoading(true);

      const data = await detectText(text);

      navigate("/detect-result", {
        state: {
          inputText: text,
          prediction: data.prediction || "No result",
          confidence: data.confidence || null,
          selectedMode: "text",
        },
      });
    } catch (error) {
      console.error("Detection failed:", error);
      alert("Detection failed. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleTryDetection = () => {
    document.getElementById("detect")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileDetect = async () => {
    if (!file) {
      alert("Please upload a file first.");
      return;
    }

    try {
      setUploadLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://127.0.0.1:5000/api/upload-detect", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("🔥 API RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      navigate("/detect-result", {
        state: {
          inputText: data.text || "No text detected",
          prediction: data.prediction || "No result",
          confidence: data.confidence ?? null,
          selectedMode: "file",
          highlightedWords: data.highlighted_words || [],
        },
      });

      // reset file after success
      setFile(null);

      const input = document.getElementById("fileUpload");
      if (input) input.value = "";
    } catch (error) {
      console.error("File detection failed:", error);
      alert(error.message || "File detection failed");
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <>
      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.2),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.2),_transparent_35%)]"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28 grid lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="inline-block px-4 py-2 rounded-full bg-blue-900/40 border border-blue-500/30 text-cyan-300 text-sm font-semibold mb-5">
              AI for Safer Sinhala Digital Spaces
            </p>

            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-white">
              Sinhala Hate <br />
              Speech <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Detection System
              </span>
            </h1>

            <p className="mt-8 text-lg text-slate-300 leading-8 max-w-2xl">
              Detect harmful Sinhala text instantly using AI-powered
              classification. SiSafe helps create safer online communication
              through smart and accessible content detection.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={handleTryDetection}
                className="px-7 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg hover:scale-105 transition"
              >
                Try Detection
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-7 py-3 rounded-2xl border border-slate-600 text-white font-semibold hover:bg-slate-800 transition"
              >
                Explore Features
              </button>
            </div>
          </motion.div>

          <motion.div
            id="detect"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/10 p-6 lg:p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-2">Test Detection</h2>
            <p className="text-slate-300 mb-5">
              Enter Sinhala text below and click detect to see the prediction result.
            </p>

            <textarea
              rows="8"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="ඔබගේ Sinhala text එක type කරන්න..."
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 outline-none p-4 resize-none"
            />

            <button
              onClick={handleDetect}
              disabled={loading}
              className="w-full mt-5 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg hover:scale-[1.02] transition disabled:opacity-70"
            >
              {loading ? "Detecting..." : "Detect Now"}
            </button>

           

           

            {/* CLEAN FILE UPLOAD UI */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="mt-6 p-6 border-2 border-dashed border-slate-600 rounded-2xl text-center hover:border-cyan-400 transition"
            >
              <p className="text-slate-300 mb-2">
                Drag & Drop social media post (image) here
              </p>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="fileUpload"
              />

              <label
                htmlFor="fileUpload"
                className="cursor-pointer text-cyan-400 font-semibold"
              >
                OR Click to Upload
              </label>

              {file && (
                <p className="mt-2 text-green-400 text-sm">
                  Selected: {file.name}
                </p>
              )}
            </div>

            <button
              onClick={handleFileDetect}
              disabled={uploadLoading}
              className="w-full mt-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold"
            >
              {uploadLoading ? "Analyzing..." : "Upload & Detect"}
            </button>
          </motion.div>
        </div>
      </section>

      <section id="detect">
        {/* Add content for the detect section here */}
      </section>

      <FeatureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

export default HeroSection;