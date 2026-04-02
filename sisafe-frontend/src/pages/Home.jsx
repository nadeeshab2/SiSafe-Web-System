import HeroSection from "../components/home/HeroSection";
import FeaturesSection from "../components/home/FeaturesSection";
import AboutSection from "../components/home/AboutSection";
import MainLayout from "../layouts/MainLayout";

function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
    </MainLayout>
  );
}

export default Home;