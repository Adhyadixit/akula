import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Check, Clock, X, Search, Filter } from "lucide-react";

interface Booking {
  id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  created_at: string;
  user: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
  } | null;
  vehicle: {
    id: string;
    name: string;
    type: string;
    brand: string;
    model: string;
  } | null;
  payments: {
    id: string;
    amount: number;
    status: string;
    payment_method: string;
    paid_at: string;
  }[] | null;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchQuery, statusFilter, activeTab]);

  async function fetchBookings() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          user:user_id(*),
          vehicle:vehicle_id(*),
          payments(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function filterBookings() {
    let filtered = [...bookings];

    // Filter by tab
    if (activeTab === "active") {
      filtered = filtered.filter(booking => 
        booking.status === "confirmed" && 
        new Date(booking.end_date) >= new Date()
      );
    } else if (activeTab === "pending") {
      filtered = filtered.filter(booking => booking.status === "pending");
    } else if (activeTab === "completed") {
      filtered = filtered.filter(booking => 
        booking.status === "confirmed" && 
        new Date(booking.end_date) < new Date()
      );
    } else if (activeTab === "cancelled") {
      filtered = filtered.filter(booking => booking.status === "cancelled");
    }

    // Filter by status if not "all"
    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.id.toLowerCase().includes(query) ||
        booking.user?.full_name.toLowerCase().includes(query) ||
        booking.user?.email.toLowerCase().includes(query) ||
        booking.vehicle?.name.toLowerCase().includes(query) ||
        booking.vehicle?.brand.toLowerCase().includes(query) ||
        booking.vehicle?.model.toLowerCase().includes(query)
      );
    }

    setFilteredBookings(filtered);
  }

  async function updateBookingStatus(bookingId: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      ));

      toast({
        title: "Success",
        description: `Booking status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function calculateDuration(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  function isBookingActive(booking: Booking) {
    const today = new Date();
    const startDate = new Date(booking.start_date);
    const endDate = new Date(booking.end_date);
    return booking.status === "confirmed" && today >= startDate && today <= endDate;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        <p className="text-muted-foreground">
          Manage your rental bookings and reservations
        </p>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="all">All Bookings</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full md:w-[200px]"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Status</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          {renderBookingsList()}
        </TabsContent>
        <TabsContent value="active" className="mt-0">
          {renderBookingsList()}
        </TabsContent>
        <TabsContent value="pending" className="mt-0">
          {renderBookingsList()}
        </TabsContent>
        <TabsContent value="completed" className="mt-0">
          {renderBookingsList()}
        </TabsContent>
        <TabsContent value="cancelled" className="mt-0">
          {renderBookingsList()}
        </TabsContent>
      </Tabs>
    </div>
  );

  function renderBookingsList() {
    if (isLoading) {
      return <div className="text-center py-10">Loading bookings...</div>;
    }

    if (filteredBookings.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No bookings found</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <Card key={booking.id} className={isBookingActive(booking) ? "border-green-500" : ""}>
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    Booking #{booking.id.substring(0, 8)}
                    {isBookingActive(booking) && (
                      <Badge className="bg-green-100 text-green-800">Active Now</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Created on {new Date(booking.created_at).toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(booking.status)}
                  {booking.status === "pending" && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 gap-1"
                        onClick={() => updateBookingStatus(booking.id, "confirmed")}
                      >
                        <Check className="h-4 w-4" /> Confirm
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 gap-1"
                        onClick={() => updateBookingStatus(booking.id, "cancelled")}
                      >
                        <X className="h-4 w-4" /> Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Customer</h4>
                  <p className="text-sm">{booking.user?.full_name || 'Unknown'}</p>
                  <p className="text-sm text-muted-foreground">{booking.user?.email}</p>
                  <p className="text-sm text-muted-foreground">{booking.user?.phone}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Vehicle</h4>
                  <p className="text-sm">{booking.vehicle?.name || 'Unknown'}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.vehicle?.brand} {booking.vehicle?.model}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    Type: {booking.vehicle?.type}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Booking Details</h4>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(booking.start_date)} - {formatDate(booking.end_date)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Duration: {calculateDuration(booking.start_date, booking.end_date)} days
                  </p>
                  <p className="text-sm font-medium mt-1">
                    Total: ₹{booking.total_price.toLocaleString()}
                  </p>
                </div>
              </div>
              
              {booking.payments && booking.payments.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Payment Information</h4>
                  <div className="space-y-2">
                    {booking.payments.map(payment => (
                      <div key={payment.id} className="flex justify-between items-center text-sm">
                        <div>
                          <span className="font-medium">₹{payment.amount.toLocaleString()}</span>
                          <span className="text-muted-foreground ml-2">
                            via {payment.payment_method || 'Unknown method'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            {payment.paid_at ? formatDate(payment.paid_at) : 'Not paid'}
                          </span>
                          <Badge className={
                            payment.status === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }>
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
}
