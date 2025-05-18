import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Pencil, Trash2, Plus } from "lucide-react";

interface Location {
  id: string;
  city: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState<Partial<Location>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchLocations();
  }, []);

  async function fetchLocations() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('city');

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast({
        title: "Error",
        description: "Failed to load locations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleEditLocation = (location: Location) => {
    setSelectedLocation(location);
    setFormData({
      city: location.city,
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
    });
    setIsEditDialogOpen(true);
  };

  const handleAddLocation = () => {
    setSelectedLocation(null);
    setFormData({
      city: "",
      address: "",
      latitude: null,
      longitude: null,
    });
    setIsAddDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? (value ? parseFloat(value) : null) : value,
    });
  };

  const handleSaveLocation = async () => {
    try {
      if (selectedLocation) {
        // Update existing location
        const { error } = await supabase
          .from('locations')
          .update(formData)
          .eq('id', selectedLocation.id);

        if (error) throw error;

        setLocations(locations.map(loc => 
          loc.id === selectedLocation.id ? { ...loc, ...formData } : loc
        ));

        toast({
          title: "Success",
          description: "Location updated successfully",
        });
      } else {
        // Add new location
        const { data, error } = await supabase
          .from('locations')
          .insert(formData)
          .select()
          .single();

        if (error) throw error;

        setLocations([...locations, data]);

        toast({
          title: "Success",
          description: "Location added successfully",
        });
      }

      setIsEditDialogOpen(false);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error saving location:', error);
      toast({
        title: "Error",
        description: "Failed to save location",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLocation = async (locationId: string) => {
    if (!confirm("Are you sure you want to delete this location? This will affect any vehicles assigned to this location.")) return;

    try {
      // Check if location has vehicles
      const { count, error: countError } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact', head: true })
        .eq('location_id', locationId);

      if (countError) throw countError;

      if (count && count > 0) {
        if (!confirm(`This location has ${count} vehicles assigned to it. Deleting it will set their location to null. Continue?`)) return;
      }

      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', locationId);

      if (error) throw error;

      setLocations(locations.filter(loc => loc.id !== locationId));

      toast({
        title: "Success",
        description: "Location deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting location:', error);
      toast({
        title: "Error",
        description: "Failed to delete location",
        variant: "destructive",
      });
    }
  };

  const filteredLocations = locations.filter(location => 
    location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (location.address && location.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
          <p className="text-muted-foreground">
            Manage your rental locations
          </p>
        </div>
        <Button onClick={handleAddLocation} className="md:w-auto w-full">
          <Plus className="mr-2 h-4 w-4" /> Add Location
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-64">
          <Input
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading locations...</div>
      ) : filteredLocations.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No locations found</p>
          <Button onClick={handleAddLocation} variant="outline" className="mt-4">
            Add your first location
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredLocations.map((location) => (
            <Card key={location.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                  {location.city}
                </CardTitle>
                {location.address && (
                  <CardDescription>
                    {location.address}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Latitude:</div>
                  <div>{location.latitude !== null ? location.latitude : 'Not set'}</div>
                  <div className="text-muted-foreground">Longitude:</div>
                  <div>{location.longitude !== null ? location.longitude : 'Not set'}</div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  onClick={() => handleEditLocation(location)}
                >
                  <Pencil className="h-4 w-4" /> Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1 text-red-500 hover:text-red-600"
                  onClick={() => handleDeleteLocation(location.id)}
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Location Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
            <DialogDescription>
              Make changes to the location information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="city">City Name</Label>
              <Input
                id="city"
                name="city"
                value={formData.city || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="0.0001"
                  value={formData.latitude !== null ? formData.latitude : ''}
                  onChange={handleInputChange}
                  placeholder="e.g. 30.1208"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="0.0001"
                  value={formData.longitude !== null ? formData.longitude : ''}
                  onChange={handleInputChange}
                  placeholder="e.g. 78.3230"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLocation}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Location Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Location</DialogTitle>
            <DialogDescription>
              Enter the details for the new location.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="city">City Name</Label>
              <Input
                id="city"
                name="city"
                value={formData.city || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="0.0001"
                  value={formData.latitude !== null ? formData.latitude : ''}
                  onChange={handleInputChange}
                  placeholder="e.g. 30.1208"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="0.0001"
                  value={formData.longitude !== null ? formData.longitude : ''}
                  onChange={handleInputChange}
                  placeholder="e.g. 78.3230"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLocation}>Add Location</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
