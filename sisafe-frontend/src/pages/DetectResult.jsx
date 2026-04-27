/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

function DetectResult() {
  const location = useLocation();
  const navigate = useNavigate();

  const { inputText, prediction, confidence, selectedMode, highlightedWords } = location.state || {};

  console.log("INPUT:", inputText);
  console.log("HIGHLIGHT:", highlightedWords);

  const getBadgeColor = () => {
    if (prediction === "Hate Speech") {
      return "bg-red-500/15 text-red-400 border border-red-500/30";
    }
    if (prediction === "Safe") {
      return "bg-green-500/15 text-green-400 border border-green-500/30";
    }
    return "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30";
  };

  // Highlight support for inputText
  const renderHighlightedText = () => {
    if (!inputText) return "No content detected.";

    if (!highlightedWords || highlightedWords.length === 0) {
      return inputText;
    }

    // 🔥 normalize words (remove punctuation)
    const cleanHighlighted = highlightedWords.map(w =>
      w.replace(/[.,!?]/g, "").trim()
    );

    return inputText.split(" ").map((word, index) => {
      const cleanWord = word.replace(/[.,!?]/g, "").trim();

      if (cleanHighlighted.includes(cleanWord)) {
        return (
          <span key={index} className="text-red-400 font-bold">
            {word}{" "}
          </span>
        );
      }

      return word + " ";
    });
  };

  return (
    <MainLayout>
      <section className="min-h-[80vh] bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-md p-8 md:p-10 shadow-2xl"
          >
            <p className="text-cyan-400 font-semibold mb-3">Detection Results</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Sinhala Content Analysis Result
            </h1>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-6">
                <h3 className="text-slate-300 text-sm mb-2">Detection Mode</h3>
                <p className="text-xl font-bold text-white capitalize">
                  {selectedMode || "Text"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-6">
                <h3 className="text-slate-300 text-sm mb-2">Confidence</h3>
                <p className="text-xl font-bold text-white">
                  {confidence !== null && confidence !== undefined
                    ? `${confidence}%`
                    : "Not Available"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-6 mb-6">
              <h3 className="text-slate-300 text-sm mb-3">Input Content</h3>
              <p className="text-slate-100 leading-8">
                {renderHighlightedText() || "No input found"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-6">
              <h3 className="text-slate-300 text-sm mb-3">Prediction Status</h3>
              <div className={`inline-flex px-5 py-2 rounded-full font-semibold ${getBadgeColor()}`}>
                {prediction || "No result"}
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:scale-105 transition"
              >
                Back to Home
              </button>

              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 rounded-2xl border border-slate-600 text-white hover:bg-slate-800 transition"
              >
                Analyze Another
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}

export default DetectResult;