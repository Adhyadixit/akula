
import { useEffect, useState } from "react";
import VehicleCard, { VehicleType } from "./VehicleCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const FeaturedVehicles = () => {
  const [vehicles, setVehicles] = useState<VehicleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVehicles() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch vehicles from Supabase
        const { data, error } = await supabase
          .from('vehicles')
          .select('id, name, type, image_url, price_per_day, available, location_id')
          .eq('available', true)
          .order('name')
          .limit(4);
        
        // Get location data separately to avoid type issues
        const locations = await supabase
          .from('locations')
          .select('id, city');

        if (error) throw error;
        
        if (data && data.length > 0) {
          // Map database data to VehicleType format
          const formattedVehicles: VehicleType[] = data.map(item => ({
            id: item.id,
            name: item.name,
            // Map database vehicle type to display type
            type: item.type.charAt(0).toUpperCase() + item.type.slice(1) as any,
            image: item.image_url,
            pricePerDay: item.price_per_day,
            pricePerHour: Math.round(item.price_per_day / 6), // Estimate hourly rate
            features: [
              "Helmet Included", 
              // Add common features for all vehicles
              item.type.includes('bike') ? "Premium Ride" : "Easy to Ride",
              item.type.includes('electric') ? "Eco Friendly" : "Fuel Efficient"
            ],
            available: item.available,
            // Find the location name from the locations data
            location: locations.data?.find(loc => loc.id === item.location_id)?.city?.toLowerCase() || 'unknown'
          }));
          
          setVehicles(formattedVehicles);
        } else {
          setVehicles([]);
        }
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError('Failed to load featured vehicles');
      } finally {
        setIsLoading(false);
      }
    }

    fetchVehicles();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Featured Vehicles</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from our wide range of bikes and scooters to make your journey comfortable and enjoyable.
          </p>
        </div>

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
            <p className="text-gray-500">No vehicles available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedVehicles;
