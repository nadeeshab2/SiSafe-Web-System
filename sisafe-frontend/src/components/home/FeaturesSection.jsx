// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaChartBar, FaFileAlt, FaShieldAlt } from "react-icons/fa";

const features = [
  {
    icon: <FaShieldAlt size={24} />,
    title: "Real-Time Detection",
    text: "Quickly analyze Sinhala text and identify potentially harmful content.",
  },
  {
    icon: <FaFileAlt size={24} />,
    title: "Text-Based Input",
    text: "Users can easily paste or type content for fast hate speech analysis.",
  },
  {
    icon: <FaChartBar size={24} />,
    title: "Smart Results",
    text: "Get prediction outputs clearly on a dedicated results page.",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <p className="text-cyan-400 font-semibold tracking-[0.2em] uppercase mb-4">
            Core Features
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            A professional AI solution for Sinhala content moderation
          </h2>
          <p className="mt-5 text-slate-400 leading-8">
            SiSafe is designed to help detect harmful Sinhala content through a
            clean interface, fast prediction flow, and scalable system design.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 70 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-lg hover:border-blue-500/40 transition"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-cyan-400 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-slate-400 leading-8">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;