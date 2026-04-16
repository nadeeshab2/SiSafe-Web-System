import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeroSection from "../components/home/HeroSection";
import FeaturesSection from "../components/home/FeaturesSection";
import AboutSection from "../components/home/AboutSection";
import MainLayout from "../layouts/MainLayout";

function Home() {
  const location = useLocation();

  useEffect(() => {
    // 🔥 GET HASH (#about, #features...)
    if (location.hash) {
      const id = location.hash.replace("#", "");

      const el = document.getElementById(id);

      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <MainLayout>

      {/* IMPORTANT IDs */}
      <section id="home">
        <HeroSection />
      </section>

      <section id="features">
        <FeaturesSection />
      </section>

      <section id="detect">
        {/* detect part HeroSection inside → still works */}
      </section>

      <section id="about">
        <AboutSection />
      </section>

    </MainLayout>
  );
}

export default Home;