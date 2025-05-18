
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CitySection = () => {
  const cities = [
    {
      name: "Rishikesh",
      image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
      description: "Explore the spiritual capital of yoga with our comfortable bikes and scooters.",
      slug: "rishikesh"
    },
    {
      name: "Dehradun",
      image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80",
      description: "Ride through the beautiful capital city of Uttarakhand with our rental vehicles.",
      slug: "dehradun"
    }
  ];

  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Service Locations</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We provide bike and scooter rental services in these beautiful cities of Uttarakhand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cities.map((city) => (
            <div key={city.name} className="rounded-lg overflow-hidden shadow-lg relative group">
              <div className="aspect-w-16 aspect-h-9 h-80">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{city.name}</h3>
                <p className="text-white/90 mb-4">{city.description}</p>
                <Button asChild className="w-fit bg-brand-blue hover:bg-blue-700">
                  <Link to={`/locations/${city.slug}`}>View Location</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CitySection;
