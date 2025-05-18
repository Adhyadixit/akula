import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bike, PlusCircle, Pencil, Trash2, Check, X, Loader2, Image as ImageIcon } from "lucide-react";
import { BasicImageUpload } from "@/components/ui/basic-image-upload";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VehicleData {
  id?: number;
  name: string;
  type: string;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  imageUrl: string;
  available: boolean;
  locationId: string; // Changed to string for UUID compatibility
}

interface LocationData {
  id: string; // Changed to string for UUID compatibility
  city: string;
  address: string;
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [currentVehicle, setCurrentVehicle] = useState<VehicleData>({
    name: "",
    type: "bike",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    pricePerDay: 0,
    imageUrl: "",
    available: true,
    locationId: "", // Empty string instead of 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchVehicles();
    fetchLocations();
  }, []);

  async function fetchVehicles() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('vehicles')
        .select('*, location:location_id(city, address)')
        .order('name');

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast({
        title: "Error",
        description: "Failed to load vehicles",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchLocations() {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('id, city, address')
        .order('city');

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  }

  const handleEditVehicle = (vehicle: VehicleData) => {
    setIsEditing(true);
    
    // Log the vehicle data we're editing
    console.log('Editing vehicle:', vehicle);
    console.log('Current locations:', locations);
    
    // Make sure to create a new object to avoid reference issues
    const vehicleToEdit = {
      ...vehicle,
      // Ensure these are the correct types
      id: vehicle.id,
      year: vehicle.year || new Date().getFullYear(),
      pricePerDay: vehicle.pricePerDay || 0,
      brand: vehicle.brand || '',
      model: vehicle.model || '',
      imageUrl: vehicle.imageUrl || '',
      locationId: vehicle.locationId || (locations.length > 0 ? locations[0].id : '')
    };
    
    console.log('Prepared vehicle for edit:', vehicleToEdit);
    
    setCurrentVehicle(vehicleToEdit);
    setIsDialogOpen(true);
  };

  const handleAddVehicle = () => {
    setIsEditing(false);
    setCurrentVehicle({
      name: "",
      type: "bike",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      pricePerDay: 0,
      imageUrl: "",
      available: true,
      locationId: locations[0]?.id || "",
    });
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setCurrentVehicle({
      ...currentVehicle,
      [name]: type === 'number' ? parseFloat(value) : value,
    });
  };

  const handleSaveVehicle = async () => {
    // Form validation
    if (!currentVehicle.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Vehicle name is required",
        variant: "destructive"
      });
      return;
    }

    if (currentVehicle.pricePerDay <= 0) {
      toast({
        title: "Validation Error",
        description: "Price per day must be greater than zero",
        variant: "destructive"
      });
      return;
    }

    // Log location information to help debug
    console.log('Current location ID:', currentVehicle.locationId);
    console.log('Available locations:', locations.map(l => ({ id: l.id, city: l.city })));
    
    // Ensure location is selected if locations are available
    if (locations.length > 0) {
      // If locationId is empty or not found in the locations array
      const locationExists = locations.some(loc => loc.id === currentVehicle.locationId);
      
      if (!currentVehicle.locationId || !locationExists) {
        // If not valid, automatically select the first location instead of showing an error
        console.log('Setting default location to:', locations[0].id);
        setCurrentVehicle(prev => ({
          ...prev,
          locationId: locations[0].id
        }));
        
        // Display info toast
        toast({
          title: "Info",
          description: `Using default location: ${locations[0].city}`,
        });
        
        // Return early to apply the location change before continuing with save
        return;
      }
    }

    setIsSaving(true);
    try {
      // Log the current vehicle data for debugging (without the actual image data to avoid console clutter)
      console.log('Saving vehicle:', { 
        ...currentVehicle, 
        imageUrl: currentVehicle.imageUrl ? '[Base64 image data]' : '' 
      });
      
      // Check if the Base64 image is too large (rough estimate)
      if (currentVehicle.imageUrl && currentVehicle.imageUrl.length > 2000000) { // ~2MB limit
        toast({
          title: "Error",
          description: "Image is too large. Please use a smaller image or reduce its quality.",
          variant: "destructive"
        });
        setIsSaving(false);
        return;
      }
      
      // Prepare vehicle data
      const vehicleData = {
        name: currentVehicle.name.trim(),
        type: currentVehicle.type,
        brand: currentVehicle.brand,
        model: currentVehicle.model,
        year: currentVehicle.year,
        price_per_day: currentVehicle.pricePerDay,
        image_url: currentVehicle.imageUrl,
        available: currentVehicle.available,
        location_id: currentVehicle.locationId
      };
      
      if (isEditing && currentVehicle.id) {
        // Update existing vehicle
        const { data, error } = await supabase
          .from('vehicles')
          .update(vehicleData)
          .eq('id', currentVehicle.id)
          .select();
        
        if (error) throw error;
        
        // Update local state
        setVehicles(
          vehicles.map(v => (v.id === currentVehicle.id ? {
            ...currentVehicle,
            id: currentVehicle.id
          } : v))
        );
        
        toast({
          title: "Success",
          description: "Vehicle updated successfully"
        });
      } else {
        // Add new vehicle
        const { data, error } = await supabase
          .from('vehicles')
          .insert(vehicleData)
          .select();
        
        if (error) throw error;
        
        if (data && data[0]) {
          const newVehicle: VehicleData = {
            id: data[0].id,
            name: data[0].name,
            type: data[0].type,
            brand: data[0].brand,
            model: data[0].model,
            year: data[0].year,
            pricePerDay: data[0].price_per_day,
            imageUrl: data[0].image_url,
            available: data[0].available,
            locationId: data[0].location_id
          };
          
          setVehicles([...vehicles, newVehicle]);
          toast({
            title: "Success",
            description: "Vehicle added successfully"
          });
        }
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving vehicle:', error);
      toast({
        title: "Error",
        description: "Failed to save vehicle",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteVehicle = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      setIsDeleting(id);
      try {
        const { error } = await supabase
          .from('vehicles')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        setVehicles(vehicles.filter(v => v.id !== id));
        toast({
          title: "Success",
          description: "Vehicle deleted successfully"
        });
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        toast({
          title: "Error",
          description: "Failed to delete vehicle",
          variant: "destructive"
        });
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
          <p className="text-muted-foreground">
            Manage your rental vehicles
          </p>
        </div>
        <Button onClick={handleAddVehicle} className="md:w-auto w-full">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Vehicle
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-64">
          <Input
            placeholder="Search vehicles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
          <span className="ml-2 text-lg">Loading vehicles...</span>
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No vehicles found</p>
          <Button onClick={handleAddVehicle} variant="outline" className="mt-4">
            Add your first vehicle
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Price/Day</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No vehicles found. Add your first vehicle using the button above.
                  </TableCell>
                </TableRow>
              ) : (
                vehicles.map(vehicle => (
                  <TableRow key={vehicle.id}>
                    <TableCell>{vehicle.name}</TableCell>
                    <TableCell className="capitalize">{vehicle.type}</TableCell>
                    <TableCell>{vehicle.brand}</TableCell>
                    <TableCell>{vehicle.model}</TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>₹{vehicle.pricePerDay}</TableCell>
                    <TableCell>
                      {vehicle.available ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                    </TableCell>
                    <TableCell>
                      {locations.find(l => l.id === vehicle.locationId)?.city || "Unknown"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditVehicle(vehicle)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500"
                          onClick={() => handleDeleteVehicle(vehicle.id!)}
                          disabled={isDeleting === vehicle.id}
                        >
                          {isDeleting === vehicle.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Make changes to the vehicle information." : "Enter the details for the new vehicle."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Vehicle Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={currentVehicle.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={currentVehicle.type}
                  onValueChange={(value) => setCurrentVehicle({
                    ...currentVehicle,
                    type: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bike">Bike</SelectItem>
                    <SelectItem value="scooter">Scooter</SelectItem>
                    <SelectItem value="car">Car</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  name="brand"
                  value={currentVehicle.brand}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  name="model"
                  value={currentVehicle.model}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  value={String(currentVehicle.year)}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricePerDay">Price Per Day (₹)</Label>
                <Input
                  id="pricePerDay"
                  name="pricePerDay"
                  type="number"
                  value={String(currentVehicle.pricePerDay)}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUpload">Vehicle Image</Label>
              <BasicImageUpload
                value={currentVehicle.imageUrl}
                onChange={(base64) => {
                  setCurrentVehicle({
                    ...currentVehicle,
                    imageUrl: base64 || ""
                  });
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="locationId">Location</Label>
                {locations.length > 0 ? (
                  <Select
                    value={currentVehicle.locationId}
                    onValueChange={(value) => {
                      console.log('Location selected:', value);
                      setCurrentVehicle({
                        ...currentVehicle,
                        locationId: value // No need to parse as int, keeping as string
                      });
                    }}
                  >
                    <SelectTrigger id="locationId">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="text-sm text-red-500">No locations available. Please add a location first.</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="available" className="block mb-2">Availability</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="available"
                    checked={currentVehicle.available}
                    onCheckedChange={(checked) => setCurrentVehicle({
                      ...currentVehicle,
                      available: checked
                    })}
                  />
                  <Label htmlFor="available">
                    {currentVehicle.available ? 'Available for rent' : 'Not available'}
                  </Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSaveVehicle} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>{isEditing ? "Update" : "Add"} Vehicle</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
