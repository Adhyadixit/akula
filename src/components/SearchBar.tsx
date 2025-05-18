
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SearchBar = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city && pickupDate && dropoffDate) {
      // Encode parameters for URL
      const params = new URLSearchParams();
      params.append("city", city);
      params.append("pickup", pickupDate);
      params.append("dropoff", dropoffDate);
      
      navigate(`/vehicles?${params.toString()}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8 -mt-10 relative z-20">
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <Select value={city} onValueChange={setCity} required>
            <SelectTrigger id="city" className="w-full">
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rishikesh">Rishikesh</SelectItem>
              <SelectItem value="dehradun">Dehradun</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="pickup" className="block text-sm font-medium text-gray-700 mb-1">
            Pickup Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              id="pickup"
              className="pl-10 bg-white border border-gray-300 rounded-md py-2 px-4 block w-full focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="dropoff" className="block text-sm font-medium text-gray-700 mb-1">
            Drop-off Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              id="dropoff"
              className="pl-10 bg-white border border-gray-300 rounded-md py-2 px-4 block w-full focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
              value={dropoffDate}
              onChange={(e) => setDropoffDate(e.target.value)}
              min={pickupDate || new Date().toISOString().split("T")[0]}
              required
            />
          </div>
        </div>

        <div className="flex items-end">
          <Button 
            type="submit" 
            className="w-full bg-brand-blue hover:bg-blue-700"
            disabled={!city || !pickupDate || !dropoffDate}
          >
            Search Vehicles
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
