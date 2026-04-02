// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaBullseye, FaBrain, FaUsers } from "react-icons/fa";

function AboutSection() {
  const items = [
    {
      icon: <FaBullseye size={20} />,
      title: "Project Goal",
      text: "SiSafe is built to identify harmful Sinhala digital content and support safer online communication.",
    },
    {
      icon: <FaBrain size={20} />,
      title: "AI-Powered Detection",
      text: "The system uses machine learning techniques to classify Sinhala text and improve moderation workflows.",
    },
    {
      icon: <FaUsers size={20} />,
      title: "Real-World Value",
      text: "Designed as a final year project with a professional interface and practical real-world application focus.",
    },
  ];

  return (
    <section id="about" className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="text-cyan-400 font-semibold mb-3">About SiSafe</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            A Professional Sinhala Hate Speech Detection Platform
          </h2>
          <p className="mt-5 text-slate-400 leading-8">
            SiSafe is a modern web-based solution designed to detect harmful
            Sinhala content through a clean interface, professional user
            experience, and intelligent detection workflow.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mt-14">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-lg"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-cyan-400 flex items-center justify-center mb-5">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-slate-400 leading-7">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutSection;