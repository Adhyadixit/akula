import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Vehicle {
  id: string;
  name: string;
  type: string;
  brand: string;
  price_per_day: number;
}

export default function SupabaseTest() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVehicles() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('vehicles')
          .select('id, name, type, brand, price_per_day')
          .limit(10);

        if (error) {
          throw error;
        }

        if (data) {
          setVehicles(data);
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchVehicles();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Supabase Connection Test</h2>
      
      {loading ? (
        <p className="text-gray-500">Loading vehicles...</p>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error!</p>
          <p>{error}</p>
        </div>
      ) : vehicles.length === 0 ? (
        <p className="text-gray-500">No vehicles found. Please check if data is loaded in the database.</p>
      ) : (
        <div>
          <p className="text-green-600 font-semibold mb-4">
            ✅ Supabase connection successful! Found {vehicles.length} vehicles.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Brand</th>
                  <th className="px-4 py-2 text-right">Price/Day (₹)</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-t border-gray-200">
                    <td className="px-4 py-2">{vehicle.name}</td>
                    <td className="px-4 py-2 capitalize">{vehicle.type}</td>
                    <td className="px-4 py-2">{vehicle.brand}</td>
                    <td className="px-4 py-2 text-right">₹{vehicle.price_per_day}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
