import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaShieldAlt,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-blue-700 to-cyan-500 flex items-center justify-center shadow-lg">
              <FaShieldAlt />
            </div>
            <div>
              <h2 className="text-2xl font-bold">SiSafe</h2>
              <p className="text-sm text-slate-400">
                Sinhala Hate Speech Detection
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-400 leading-7">
            SiSafe is a modern AI-powered platform designed to detect harmful
            Sinhala content and support safer digital communication through a
            professional user experience.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-cyan-400">Quick Links</h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li><a href="#home" className="hover:text-white transition">Home</a></li>
            <li><a href="#features" className="hover:text-white transition">Features</a></li>
            <li><a href="#detect" className="hover:text-white transition">Detect</a></li>
            <li><a href="#about" className="hover:text-white transition">About</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-cyan-400">Services</h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li>Text Detection</li>
            <li>File Detection</li>
            <li>Voice Detection</li>
            <li>Analytics Dashboard</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-cyan-400">Contact</h3>
          <div className="space-y-4 text-sm text-slate-400">
            <p className="flex items-center gap-3">
              <FaEnvelope className="text-cyan-400" />
              support@sisafe.com
            </p>
            <p className="flex items-center gap-3">
              <FaPhoneAlt className="text-cyan-400" />
              +94 71 234 5678
            </p>
            <p className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-cyan-400" />
              Colombo, Sri Lanka
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-5 text-center text-sm text-slate-500">
        © 2026 SiSafe. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;