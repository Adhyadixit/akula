
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-gray-900 to-brand-blue text-white">
      <div className="absolute inset-0 opacity-40">
        <img
          src="https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=1920&q=80"
          alt="Background - Rishikesh river and mountains"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="container-custom relative z-10 py-20 md:py-28">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Explore Rishikesh & Dehradun <span className="text-brand-light-blue">Your Way</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-100">
            Rent bikes and scooters for your adventure in the mountains. 
            Affordable rates, flexible durations, and hassle-free experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-brand-green hover:bg-green-700 text-white font-bold py-3 px-8">
              <Link to="/vehicles">Book Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white">
              <Link to="/vehicles">View Vehicles</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
