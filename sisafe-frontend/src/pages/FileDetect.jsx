import { useRef, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaCloudUploadAlt, FaFileAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { detectFile } from "../api/detectApi";

function FileDetect() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileSelect = (file) => {
    if (!file) return;

    const allowedTypes = [".txt", ".pdf", ".docx"];
    const fileName = file.name.toLowerCase();

    const isValid = allowedTypes.some((ext) => fileName.endsWith(ext));

    if (!isValid) {
      alert("Only TXT, PDF, and DOCX files are allowed.");
      return;
    }

    setSelectedFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    try {
      setLoading(true);

      const data = await detectFile(selectedFile);

      navigate("/detect-result", {
        state: {
          inputText: data.filename || selectedFile.name,
          prediction: data.prediction || "No result",
          confidence: data.confidence ?? null,
          selectedMode: "file",
        },
      });
    } catch (error) {
      console.error("File detection failed:", error);
      alert(error?.response?.data?.error || "File detection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <section className="min-h-[85vh] bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center"
          >
            <p className="text-cyan-400 font-semibold mb-3">File Detection</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Upload a File for Sinhala Content Analysis
            </h1>
            <p className="text-slate-300 mt-4 leading-8 max-w-3xl mx-auto">
              Drag and drop your TXT, PDF, or DOCX file here and let SiSafe analyze
              the content for harmful Sinhala speech.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-md p-8 shadow-2xl"
          >
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition ${
                dragActive
                  ? "border-cyan-400 bg-cyan-500/10"
                  : "border-slate-600 hover:border-cyan-400"
              }`}
            >
              <FaCloudUploadAlt className="text-cyan-400 text-6xl mx-auto mb-5" />
              <h3 className="text-2xl font-bold text-white mb-3">
                Drag & Drop Your File Here
              </h3>
              <p className="text-slate-300 mb-4">
                or click to browse from your computer
              </p>
              <p className="text-sm text-slate-400">
                Supported formats: TXT, PDF, DOCX
              </p>

              <input
                ref={inputRef}
                type="file"
                accept=".txt,.pdf,.docx"
                className="hidden"
                onChange={handleChange}
              />
            </div>

            {selectedFile && (
              <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950/40 p-4 flex items-center gap-4">
                <FaFileAlt className="text-cyan-400 text-2xl" />
                <div>
                  <p className="text-white font-semibold">{selectedFile.name}</p>
                  <p className="text-slate-400 text-sm">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={handleUpload}
                disabled={loading}
                className="px-7 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:scale-105 transition disabled:opacity-70"
              >
                {loading ? "Uploading..." : "Upload & Detect"}
              </button>

              <button
                onClick={() => navigate("/")}
                className="px-7 py-3 rounded-2xl border border-slate-600 text-white hover:bg-slate-800 transition"
              >
                Back to Home
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}

export default FileDetect;