
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VehicleCard, { VehicleType } from "@/components/VehicleCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const VehiclesPage = () => {
  const [searchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState<VehicleType[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    scooter: false,
    bike: false,
    cruiser: false,
    electric: false,
  });

  const city = searchParams.get("city") || "";
  const pickup = searchParams.get("pickup") || "";
  const dropoff = searchParams.get("dropoff") || "";

  useEffect(() => {
    async function fetchVehicles() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Build query
        let query = supabase
          .from('vehicles')
          .select('*, location:location_id(city)')
          .eq('available', true);
        
        // Filter by city if provided
        if (city) {
          const { data: locationData } = await supabase
            .from('locations')
            .select('id')
            .ilike('city', city)
            .single();
          
          if (locationData) {
            query = query.eq('location_id', locationData.id);
          }
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Transform data to match VehicleType
        const transformedVehicles: VehicleType[] = data.map(vehicle => ({
          id: vehicle.id,
          name: vehicle.name,
          type: vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1), // Capitalize type
          image: vehicle.image_url || 'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?q=80&w=2070&auto=format&fit=crop',
          pricePerDay: vehicle.price_per_day,
          pricePerHour: Math.round(vehicle.price_per_day / 6), // Estimate hourly rate
          features: [
            `${vehicle.brand} ${vehicle.model}`,
            vehicle.year ? `${vehicle.year} Model` : '',
            'Helmet Included'
          ].filter(Boolean),
          available: vehicle.available,
          location: vehicle.location?.city?.toLowerCase() || ''
        }));
        
        setVehicles(transformedVehicles);
        setFilteredVehicles(transformedVehicles);
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError('Failed to load vehicles. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchVehicles();
  }, [city]);

  // Apply type filters
  useEffect(() => {
    const activeFilters = Object.entries(filters).filter(([, isActive]) => isActive);
    
    if (activeFilters.length === 0) {
      // No filters active, show all vehicles for the selected city
      const filtered = city
        ? vehicles.filter(vehicle => vehicle.location === city.toLowerCase())
        : vehicles;
      setFilteredVehicles(filtered);
      return;
    }

    const filtered = vehicles.filter(vehicle => {
      const vehicleType = vehicle.type.toLowerCase();
      return (
        (filters.scooter && vehicleType === "scooter") ||
        (filters.bike && vehicleType === "bike") ||
        (filters.cruiser && vehicleType === "cruiser") ||
        (filters.electric && vehicleType === "electric")
      );
    });

    // Apply city filter if it exists
    const finalFiltered = city
      ? filtered.filter(vehicle => vehicle.location === city.toLowerCase())
      : filtered;

    setFilteredVehicles(finalFiltered);
  }, [filters, vehicles, city]);

  const handleFilterChange = (type: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const clearFilters = () => {
    setFilters({
      scooter: false,
      bike: false,
      cruiser: false,
      electric: false,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-2">Available Vehicles</h1>
          
          {(city || pickup || dropoff) && (
            <div className="bg-gray-100 p-4 rounded-md mb-6">
              <h2 className="font-semibold mb-2">Your Search</h2>
              <div className="flex flex-wrap gap-4 text-sm">
                {city && <span>Location: <span className="font-semibold capitalize">{city}</span></span>}
                {pickup && <span>Pickup: <span className="font-semibold">{pickup}</span></span>}
                {dropoff && <span>Drop-off: <span className="font-semibold">{dropoff}</span></span>}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md mb-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Filters</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-sm text-brand-blue"
                  >
                    Clear All
                  </Button>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Vehicle Type</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="scooter" 
                        checked={filters.scooter}
                        onCheckedChange={() => handleFilterChange('scooter')}
                      />
                      <Label htmlFor="scooter" className="cursor-pointer">Scooter</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="bike" 
                        checked={filters.bike}
                        onCheckedChange={() => handleFilterChange('bike')}
                      />
                      <Label htmlFor="bike" className="cursor-pointer">Bike</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="cruiser" 
                        checked={filters.cruiser}
                        onCheckedChange={() => handleFilterChange('cruiser')}
                      />
                      <Label htmlFor="cruiser" className="cursor-pointer">Cruiser</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="electric" 
                        checked={filters.electric}
                        onCheckedChange={() => handleFilterChange('electric')}
                      />
                      <Label htmlFor="electric" className="cursor-pointer">Electric</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-brand-blue" />
                  <h3 className="text-xl font-semibold mb-2">Loading vehicles...</h3>
                  <p className="text-gray-600">Please wait while we fetch available vehicles.</p>
                </div>
              ) : error ? (
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                  <h3 className="text-xl font-semibold mb-2 text-red-600">Error loading vehicles</h3>
                  <p className="text-gray-600">{error}</p>
                </div>
              ) : filteredVehicles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVehicles.map(vehicle => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                  <h3 className="text-xl font-semibold mb-2">No vehicles found</h3>
                  <p className="text-gray-600">
                    Try adjusting your filters or search criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default VehiclesPage;
