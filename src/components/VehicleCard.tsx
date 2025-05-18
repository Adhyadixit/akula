
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Phone, MessageCircle } from "lucide-react";

export interface VehicleType {
  id: string | number; // Allow for UUID strings or numeric IDs
  name: string;
  type: "Scooter" | "Bike" | "Cruiser" | "Electric";
  image: string;
  pricePerDay: number;
  pricePerHour: number;
  features: string[];
  available: boolean;
  location: string;
}

interface VehicleCardProps {
  vehicle: VehicleType;
}

const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  const getBadgeColor = (type: string) => {
    switch (type) {
      case "Scooter":
        return "bg-blue-100 text-blue-800";
      case "Bike":
        return "bg-green-100 text-green-800";
      case "Cruiser":
        return "bg-red-100 text-red-800";
      case "Electric":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden card-hover border border-gray-100">
      <div className="relative">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-52 object-cover"
        />
        <Badge className={`absolute top-3 left-3 ${getBadgeColor(vehicle.type)}`}>
          {vehicle.type}
        </Badge>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2">{vehicle.name}</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {vehicle.features.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="text-brand-blue font-semibold">
            <span className="text-lg">₹{vehicle.pricePerDay}</span>
            <span className="text-sm text-gray-500"> /day</span>
          </div>
          <div className="text-brand-blue font-semibold">
            <span className="text-sm text-gray-500">₹{vehicle.pricePerHour}/hr</span>
          </div>
        </div>
        <div className="space-y-3">
          <Button asChild className="w-full bg-brand-blue hover:bg-blue-700">
            <Link to={`/book-now?vehicleId=${vehicle.id}`}>Book Now</Link>
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button asChild variant="outline" className="flex items-center justify-center">
              <a href="tel:9354750504">
                <Phone className="h-4 w-4 mr-1" />
                Call Now
              </a>
            </Button>
            
            <Button asChild variant="outline" className="flex items-center justify-center text-green-600 border-green-600 hover:bg-green-50">
              <a 
                href={`https://wa.me/919354750504?text=Hi! I'm interested in renting the ${vehicle.name}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
