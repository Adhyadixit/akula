import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { VehicleType } from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const BookingPage = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const vehicleId = searchParams.get("vehicleId");
  
  const [vehicle, setVehicle] = useState<VehicleType | null>(null);
  const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined);
  const [dropoffDate, setDropoffDate] = useState<Date | undefined>(undefined);
  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropoffTime, setDropoffTime] = useState("10:00");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "rishikesh",
    paymentMethod: "cash"
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState(0);

  // Load vehicle data from Supabase
  useEffect(() => {
    const fetchVehicleData = async () => {
      if (!vehicleId) {
        setIsLoading(false);
        setError("No vehicle ID provided");
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        console.log('Fetching vehicle with ID:', vehicleId);
        
        // Fetch the vehicle from Supabase by ID
        const { data: vehicleData, error: vehicleError } = await supabase
          .from('vehicles')
          .select('*, location:location_id(city)')
          .eq('id', vehicleId)
          .single();
        
        if (vehicleError) {
          console.error('Error fetching vehicle:', vehicleError);
          throw vehicleError;
        }
        
        if (vehicleData) {
          // Transform the data to match our VehicleType interface
          const formattedVehicle: VehicleType = {
            id: vehicleData.id,
            name: vehicleData.name,
            // Map the database type to our display type with safe fallback
            type: vehicleData.type ? 
              (vehicleData.type.charAt(0).toUpperCase() + vehicleData.type.slice(1)) as any : 
              'Scooter', // Default if type is missing
            image: vehicleData.image_url || "/placeholder-vehicle.jpg",
            pricePerDay: vehicleData.price_per_day || 500, // Add fallback price
            pricePerHour: Math.round((vehicleData.price_per_day || 500) / 6), // Estimate hourly rate
            features: [
              "Helmet Included", 
              // Add generic features if specific ones aren't available
              "Well Maintained",
              "Fuel Efficient"
            ],
            available: vehicleData.available === false ? false : true, // Default to available
            location: vehicleData.location?.city?.toLowerCase() || 'unknown'
          };
          
          setVehicle(formattedVehicle);
          
          // Set default city based on vehicle location
          if (vehicleData.location?.city) {
            setFormData(prev => ({
              ...prev,
              city: vehicleData.location.city.toLowerCase()
            }));
          }
        } else {
          setError('Vehicle not found');
          toast({
            title: "Error",
            description: "Vehicle not found",
            variant: "destructive"
          });
        }
      } catch (err) {
        console.error('Error fetching vehicle data:', err);
        setError('Failed to load vehicle data');
        toast({
          title: "Error",
          description: "Failed to load vehicle data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVehicleData();
  }, [vehicleId, toast]);

  // Calculate total price
  useEffect(() => {
    if (!vehicle || !pickupDate || !dropoffDate) {
      setTotalPrice(0);
      return;
    }

    const diffTime = Math.abs(dropoffDate.getTime() - pickupDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // If same day, charge for 1 day minimum
    const days = diffDays === 0 ? 1 : diffDays;
    setTotalPrice(days * vehicle.pricePerDay);
  }, [vehicle, pickupDate, dropoffDate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vehicle || !pickupDate || !dropoffDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, you'd submit this data to your backend
    console.log({
      vehicle,
      pickupDate,
      pickupTime,
      dropoffDate,
      dropoffTime,
      ...formData,
      totalPrice
    });
    
    toast({
      title: "Booking Confirmed",
      description: `Your ${vehicle.name} has been booked successfully!`,
    });
    
    // Redirect to confirmation page or home
    navigate('/');
  };

  // Error or loading states
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-brand-blue" />
            <h2 className="text-xl font-medium">Loading booking details...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{error || "Vehicle not found"}</h1>
            <p className="text-gray-600 mb-6">We couldn't find the vehicle you're looking for.</p>
            <Button asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Main booking form
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow pb-16">
        <div className="container mx-auto px-4 py-10 max-w-7xl">
          <h1 className="text-3xl font-bold mb-10 text-center">Book Your Vehicle</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Rental Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="city">Pickup Location</Label>
                      <Select 
                        value={formData.city} 
                        onValueChange={(value) => handleSelectChange("city", value)}
                        required
                      >
                        <SelectTrigger id="city">
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rishikesh">Rishikesh</SelectItem>
                          <SelectItem value="dehradun">Dehradun</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Vehicle Type</Label>
                      <div className="h-10 px-4 py-2 rounded-md border border-input bg-background text-foreground">
                        {vehicle.type}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Pickup Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {pickupDate ? format(pickupDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={pickupDate}
                            onSelect={setPickupDate}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pickupTime">Pickup Time</Label>
                      <Input
                        type="time"
                        id="pickupTime"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Drop-off Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                            disabled={!pickupDate}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dropoffDate ? format(dropoffDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dropoffDate}
                            onSelect={setDropoffDate}
                            initialFocus
                            disabled={(date) => pickupDate ? date < pickupDate : date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dropoffTime">Drop-off Time</Label>
                      <Input
                        type="time"
                        id="dropoffTime"
                        value={dropoffTime}
                        onChange={(e) => setDropoffTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  
                  <RadioGroup 
                    value={formData.paymentMethod}
                    onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash">Cash on Pickup</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi">UPI Payment</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="online" id="online" />
                      <Label htmlFor="online">Online Payment</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-brand-green hover:bg-green-700"
                  disabled={!pickupDate || !dropoffDate}
                >
                  Confirm Booking
                </Button>
              </form>
            </div>

            <div>
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
                
                <div className="flex items-center mb-6">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-20 h-20 object-cover rounded-md mr-4"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-vehicle.jpg";
                    }}
                  />
                  <div>
                    <h3 className="font-medium">{vehicle.name}</h3>
                    <p className="text-sm text-gray-500">{vehicle.type}</p>
                  </div>
                </div>

                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per day:</span>
                    <span>₹{vehicle.pricePerDay}</span>
                  </div>
                  
                  {pickupDate && dropoffDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span>
                        {Math.max(1, Math.ceil(Math.abs(dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)))} days
                      </span>
                    </div>
                  )}
                  
                  <Separator className="my-2" />
                  
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-md text-sm">
                  <p className="font-medium mb-2">Included with your rental:</p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    {vehicle.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                    <li>24/7 roadside assistance</li>
                    <li>Vehicle insurance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingPage;
