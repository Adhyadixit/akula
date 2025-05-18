import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Save, RefreshCw } from "lucide-react";

export default function SettingsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Site settings
  const [siteSettings, setSiteSettings] = useState({
    siteName: "Wheelie Wanderlust",
    siteTagline: "Bike & Scooter Rentals in Rishikesh & Dehradun",
    contactEmail: "info@wheeliewanderlust.com",
    contactPhone: "+91 8005652230",
    enableBookings: true,
    maintenanceMode: false
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    adminEmailForBookings: "admin@wheeliewanderlust.com",
    adminEmailForContacts: "admin@wheeliewanderlust.com"
  });

  const handleSiteSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSiteSettings({
      ...siteSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleNotificationSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSwitchChange = (settingsType: 'site' | 'notification', name: string, checked: boolean) => {
    if (settingsType === 'site') {
      setSiteSettings({
        ...siteSettings,
        [name]: checked
      });
    } else {
      setNotificationSettings({
        ...notificationSettings,
        [name]: checked
      });
    }
  };

  const handleSaveSettings = async (type: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    
    toast({
      title: "Settings saved",
      description: `${type} settings have been updated successfully.`,
    });
  };

  const handleClearCache = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    
    toast({
      title: "Cache cleared",
      description: "System cache has been cleared successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
              <CardDescription>
                Manage your website's general settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={siteSettings.siteName}
                    onChange={handleSiteSettingsChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteTagline">Site Tagline</Label>
                  <Input
                    id="siteTagline"
                    name="siteTagline"
                    value={siteSettings.siteTagline}
                    onChange={handleSiteSettingsChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={siteSettings.contactEmail}
                    onChange={handleSiteSettingsChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={siteSettings.contactPhone}
                    onChange={handleSiteSettingsChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableBookings"
                    checked={siteSettings.enableBookings}
                    onCheckedChange={(checked) => handleSwitchChange('site', 'enableBookings', checked)}
                  />
                  <Label htmlFor="enableBookings">Enable Bookings</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="maintenanceMode"
                    checked={siteSettings.maintenanceMode}
                    onCheckedChange={(checked) => handleSwitchChange('site', 'maintenanceMode', checked)}
                  />
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSaveSettings('Site')} 
                disabled={isLoading}
                className="gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleSwitchChange('notification', 'emailNotifications', checked)}
                  />
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="smsNotifications"
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => handleSwitchChange('notification', 'smsNotifications', checked)}
                  />
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adminEmailForBookings">Admin Email for Bookings</Label>
                  <Input
                    id="adminEmailForBookings"
                    name="adminEmailForBookings"
                    type="email"
                    value={notificationSettings.adminEmailForBookings}
                    onChange={handleNotificationSettingsChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmailForContacts">Admin Email for Contact Forms</Label>
                  <Input
                    id="adminEmailForContacts"
                    name="adminEmailForContacts"
                    type="email"
                    value={notificationSettings.adminEmailForContacts}
                    onChange={handleNotificationSettingsChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSaveSettings('Notification')} 
                disabled={isLoading}
                className="gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Manage system-level settings and maintenance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Cache Management</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Clear application cache to refresh data and fix potential issues.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={handleClearCache}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Clearing Cache...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        Clear Cache
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-2">Database Information</h3>
                  <div className="text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Database Provider:</div>
                      <div>Supabase</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Connection Status:</div>
                      <div className="text-green-600">Connected</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Last Sync:</div>
                      <div>{new Date().toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-2">System Version</h3>
                  <div className="text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Application Version:</div>
                      <div>1.0.0</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Last Updated:</div>
                      <div>{new Date().toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
