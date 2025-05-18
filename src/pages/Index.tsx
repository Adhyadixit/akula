
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import FeaturedVehicles from "@/components/FeaturedVehicles";
import WhyChooseUs from "@/components/WhyChooseUs";
import CitySection from "@/components/CitySection";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        <Hero />
        <div className="container-custom">
          <SearchBar />
        </div>
        <FeaturedVehicles />
        <WhyChooseUs />
        <CitySection />
        <Testimonials />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
