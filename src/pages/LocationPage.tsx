import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SearchBar from "@/components/SearchBar";
import VehicleCard, { VehicleType } from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import GoogleMap from "@/components/GoogleMap";
import { Loader2 } from "lucide-react";

const LocationPage = () => {
  const { citySlug } = useParams<{ citySlug: string }>();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<VehicleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [cityInfo, setCityInfo] = useState({
    id: null,
    name: "",
    slug: "",
    description: "",
    image: "",
    pickupPoints: [] as string[],
    coordinates: {
      lat: 0,
      lng: 0
    }
  });

  // Fetch location data
  useEffect(() => {
    async function fetchLocationData() {
      if (!citySlug) return;
      
      try {
        setIsLocationLoading(true);
        setError(null);
        
        // Get location data from Supabase
        const { data: locationData, error: locationError } = await supabase
          .from('locations')
          .select('*')
          .ilike('city', citySlug)
          .single();
        
        if (locationError) {
          // Try with exact city match instead
          const { data: exactLocationData, error: exactLocationError } = await supabase
            .from('locations')
            .select('*')
            .eq('city', citySlug.charAt(0).toUpperCase() + citySlug.slice(1))
            .single();
            
          if (exactLocationError) {
            throw new Error('Location not found');
          }
          
          // Get coordinates based on the city name
          let exactCoordinates = { lat: 30.086648, lng: 78.267609 }; // Default to Rishikesh
          
          if (exactLocationData.city.toLowerCase() === 'rishikesh') {
            exactCoordinates = { lat: 30.086648, lng: 78.267609 };
          } else if (exactLocationData.city.toLowerCase() === 'dehradun') {
            exactCoordinates = { lat: 30.316495, lng: 78.03219 };
          }
          
          // Use the exact location data when available
          setCityInfo({
            id: exactLocationData.id,
            name: exactLocationData.city,
            slug: exactLocationData.city.toLowerCase(),
            description: exactLocationData.description || `Explore ${exactLocationData.city} with our comfortable vehicles for rent. Experience the beauty of this location on two wheels.`,
            image: exactLocationData.image_url || "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=1920&q=80",
            mapUrl: exactLocationData.map_url || "https://maps.app.goo.gl/ajsTfY5y85H3Cnor9",
            pickupPoints: exactLocationData.pickup_points || ["Central Area", "Main Market"],
            coordinates: exactCoordinates
          });
        } else {
          // Get coordinates based on the city name
          let coordinates = { lat: 30.086648, lng: 78.267609 }; // Default to Rishikesh
          
          if (locationData.city.toLowerCase() === 'rishikesh') {
            coordinates = { lat: 30.086648, lng: 78.267609 };
          } else if (locationData.city.toLowerCase() === 'dehradun') {
            coordinates = { lat: 30.316495, lng: 78.03219 };
          }
          
          // Update based on found location
          setCityInfo({
            id: locationData.id,
            name: locationData.city,
            slug: locationData.city.toLowerCase(),
            description: locationData.description || `Explore the beautiful city of ${locationData.city} with our premium two-wheeler rentals. Whether you're a local or a tourist, our fleet of scooters, bikes, and electric vehicles will help you navigate the city with ease.`,
            image: locationData.image_url || "https://images.unsplash.com/photo-1585123388867-3bfe6dd4bdbf?auto=format&fit=crop&w=1200&h=500&q=80",
            pickupPoints: locationData.pickup_points || [`Main ${locationData.city} Branch - Marketplace`, `${locationData.city} Railway Station`],
            coordinates: coordinates
          });
        }
      } catch (err) {
        console.error('Error fetching location data:', err);
        setError('Location not found');
        // Redirect to home page if location not found
        setTimeout(() => navigate('/'), 2000);
      } finally {
        setIsLocationLoading(false);
      }
    }
    
    fetchLocationData();
  }, [citySlug, navigate]);

  // Fetch vehicles for this location
  useEffect(() => {
    async function fetchVehiclesForLocation() {
      if (!cityInfo.id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Get vehicles from Supabase for this location
        const { data: vehicleData, error: vehicleError } = await supabase
          .from('vehicles')
          .select('*')
          .eq('location_id', cityInfo.id)
          .eq('available', true)
          .order('name');
          
        if (vehicleError) throw vehicleError;
        
        if (vehicleData && vehicleData.length > 0) {
          // Map the database data to our VehicleType format
          const formattedVehicles: VehicleType[] = vehicleData.map(item => ({
            id: item.id,
            name: item.name,
            // Map database vehicle type to display type
            type: item.type.charAt(0).toUpperCase() + item.type.slice(1) as any,
            image: item.image_url || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80",
            pricePerDay: item.price_per_day,
            pricePerHour: Math.round(item.price_per_day / 6), // Estimate hourly rate
            features: [
              "Helmet Included", 
              // Add common features for all vehicles
              item.type.includes('bike') ? "Premium Ride" : "Easy to Ride",
              item.type.includes('electric') ? "Eco Friendly" : "Fuel Efficient"
            ],
            available: item.available,
            location: cityInfo.slug
          }));
          
          setVehicles(formattedVehicles);
        } else {
          setVehicles([]);
        }
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError('Failed to load vehicles for this location');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchVehiclesForLocation();
  }, [cityInfo.id, cityInfo.slug]);

  if (isLocationLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-brand-blue mb-4" />
        <h2 className="text-xl font-medium text-gray-700">Loading location data...</h2>
      </div>
    );
  }

  if (error || !cityInfo.name) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-800">Location Not Found</h1>
        <p className="text-gray-600 mt-2 mb-6">{error || 'The location you are looking for does not exist.'}</p>
        <Button asChild className="bg-brand-blue hover:bg-blue-700">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="relative h-96">
          <div className="absolute inset-0">
            <img
              src={cityInfo.image}
              alt={`${cityInfo.name} - scenic view`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
          </div>
          <div className="container-custom relative z-10 h-full flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Bike Rentals in {cityInfo.name}
            </h1>
            <p className="text-white/90 max-w-2xl">
              Explore {cityInfo.name} with affordable and reliable two-wheeler rentals from Akula Rentals.
            </p>
          </div>
        </div>

        <div className="container-custom -mt-10 mb-16">
          <SearchBar />
        </div>

        <div className="container-custom mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">About {cityInfo.name}</h2>
              <p className="text-gray-700 mb-6">{cityInfo.description}</p>
              
              <h3 className="text-xl font-semibold mb-3">Pickup Points</h3>
              <ul className="list-disc pl-5 mb-8 text-gray-700">
                {cityInfo.pickupPoints.map((point, index) => (
                  <li key={index} className="mb-1">{point}</li>
                ))}
              </ul>

              <div className="h-80 mb-8 rounded-lg overflow-hidden shadow-md">
                <GoogleMap 
                  lat={cityInfo.coordinates?.lat || 30.086648} 
                  lng={cityInfo.coordinates?.lng || 78.267609} 
                  zoom={13}
                  height="100%"
                  title={`${cityInfo.name} Location`}
                  withSearch={true}
                />
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md mb-6 sticky top-24">
                <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
                <div className="space-y-4 text-gray-700">
                  <div>
                    <p className="font-medium">Address:</p>
                    <p>{cityInfo.name} Pickup Point, Uttarakhand</p>
                  </div>
                  <div>
                    <p className="font-medium">Phone:</p>
                    <p>8005652230</p>
                  </div>
                  <div>
                    <p className="font-medium">Email:</p>
                    <p>contact@akularentals.com</p>
                  </div>
                </div>
                <div className="mt-6">
                  <Button className="w-full bg-brand-green hover:bg-green-700">
                    <a href="tel:8005652230">Call Now</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="bg-gray-50 py-16">
          <div className="container-custom">
            <h2 className="text-2xl font-bold mb-8">Available Vehicles in {cityInfo.name}</h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
                <span className="ml-2 text-lg">Loading vehicles...</span>
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <p className="text-red-500">{error}</p>
              </div>
            ) : vehicles.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">No vehicles available at this location.</p>
                <p className="text-gray-500 mt-2">Please check back later or try another location.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {vehicles.map(vehicle => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            )}
            
            {vehicles.length > 0 && (
              <div className="mt-8 text-center">
                <Button asChild className="bg-brand-blue hover:bg-blue-700">
                  <Link to={`/vehicles?city=${citySlug}`}>View All Vehicles</Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default LocationPage;
