import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Bike, CreditCard, Users, ShoppingCart, TrendingUp, Calendar } from "lucide-react";

interface DashboardStats {
  totalVehicles: number;
  totalBookings: number;
  totalUsers: number;
  totalRevenue: number;
  activeBookings: number;
}

interface BookingWithDetails {
  id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  user: { full_name: string; email: string } | null;
  vehicle: { name: string; type: string } | null;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0,
    activeBookings: 0,
  });
  const [activeOrders, setActiveOrders] = useState<BookingWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true);
        
        // Fetch total vehicles
        const { count: vehiclesCount } = await supabase
          .from('vehicles')
          .select('*', { count: 'exact', head: true });
        
        // Fetch total bookings
        const { count: bookingsCount } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true });
        
        // Fetch total users
        const { count: usersCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });
        
        // Fetch total revenue
        const { data: payments } = await supabase
          .from('payments')
          .select('amount')
          .eq('status', 'paid');
        
        const totalRevenue = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
        
        // Fetch active bookings count
        const { count: activeBookingsCount } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'confirmed')
          .gte('end_date', new Date().toISOString().split('T')[0]);
        
        setStats({
          totalVehicles: vehiclesCount || 0,
          totalBookings: bookingsCount || 0,
          totalUsers: usersCount || 0,
          totalRevenue: totalRevenue,
          activeBookings: activeBookingsCount || 0,
        });
        
        // Fetch active orders with details
        const { data: activeOrdersData } = await supabase
          .from('bookings')
          .select(`
            id, start_date, end_date, total_price, status,
            user:user_id(full_name, email),
            vehicle:vehicle_id(name, type)
          `)
          .in('status', ['pending', 'confirmed'])
          .order('start_date', { ascending: true });
        
        setActiveOrders(activeOrdersData as BookingWithDetails[] || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your rental business
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Bike className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.totalVehicles}</div>
            <p className="text-xs text-muted-foreground">Available for rent</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{isLoading ? "..." : stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.activeBookings}</div>
            <p className="text-xs text-muted-foreground">Current rentals</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Active Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Active Orders</CardTitle>
          <CardDescription>
            Manage your current and upcoming bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading active orders...</div>
          ) : activeOrders.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No active orders found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium">ID</th>
                    <th className="text-left py-3 px-2 font-medium">Customer</th>
                    <th className="text-left py-3 px-2 font-medium">Vehicle</th>
                    <th className="text-left py-3 px-2 font-medium">Dates</th>
                    <th className="text-left py-3 px-2 font-medium">Amount</th>
                    <th className="text-left py-3 px-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activeOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2 text-sm">{order.id.substring(0, 8)}...</td>
                      <td className="py-3 px-2">
                        <div className="font-medium">{order.user?.full_name || 'Unknown'}</div>
                        <div className="text-sm text-muted-foreground">{order.user?.email}</div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="font-medium">{order.vehicle?.name || 'Unknown'}</div>
                        <div className="text-sm text-muted-foreground capitalize">{order.vehicle?.type}</div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="text-sm">{new Date(order.start_date).toLocaleDateString()} - </div>
                        <div className="text-sm">{new Date(order.end_date).toLocaleDateString()}</div>
                      </td>
                      <td className="py-3 px-2 font-medium">₹{order.total_price.toLocaleString()}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
