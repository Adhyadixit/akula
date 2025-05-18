import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, Search, Filter, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";

interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  payment_method: string | null;
  status: string | null;
  paid_at: string | null;
  booking: {
    id: string;
    user_id: string;
    vehicle_id: string;
    start_date: string;
    end_date: string;
    user: {
      full_name: string;
      email: string;
    } | null;
    vehicle: {
      name: string;
    } | null;
  } | null;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchPayments();
  }, []);

  async function fetchPayments() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          booking:booking_id (
            id, user_id, vehicle_id, start_date, end_date,
            user:user_id (full_name, email),
            vehicle:vehicle_id (name)
          )
        `)
        .order('paid_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Error",
        description: "Failed to load payments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function updatePaymentStatus(paymentId: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from('payments')
        .update({ 
          status: newStatus,
          paid_at: newStatus === 'paid' ? new Date().toISOString() : null
        })
        .eq('id', paymentId);

      if (error) throw error;

      // Update local state
      setPayments(payments.map(payment => 
        payment.id === paymentId ? { 
          ...payment, 
          status: newStatus,
          paid_at: newStatus === 'paid' ? new Date().toISOString() : null
        } : payment
      ));

      // If payment is marked as paid, update the booking status to confirmed
      if (newStatus === 'paid') {
        const payment = payments.find(p => p.id === paymentId);
        if (payment && payment.booking) {
          await supabase
            .from('bookings')
            .update({ status: 'confirmed' })
            .eq('id', payment.booking.id);
        }
      }

      toast({
        title: "Success",
        description: `Payment status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      });
    }
  }

  const filteredPayments = payments.filter(payment => {
    // Filter by status
    if (statusFilter !== 'all' && payment.status !== statusFilter) {
      return false;
    }
    
    // Filter by payment method
    if (methodFilter !== 'all' && payment.payment_method !== methodFilter) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const bookingId = payment.booking_id.toLowerCase();
      const customerName = payment.booking?.user?.full_name?.toLowerCase() || '';
      const customerEmail = payment.booking?.user?.email?.toLowerCase() || '';
      const vehicleName = payment.booking?.vehicle?.name?.toLowerCase() || '';
      
      return (
        bookingId.includes(query) ||
        customerName.includes(query) ||
        customerEmail.includes(query) ||
        vehicleName.includes(query)
      );
    }
    
    return true;
  });

  function formatDate(dateString: string | null) {
    if (!dateString) return 'Not paid';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getStatusBadge(status: string | null) {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  }

  function getPaymentMethodBadge(method: string | null) {
    switch (method) {
      case "card":
        return <Badge variant="outline" className="bg-blue-50 text-blue-800">Card</Badge>;
      case "upi":
        return <Badge variant="outline" className="bg-purple-50 text-purple-800">UPI</Badge>;
      case "cash":
        return <Badge variant="outline" className="bg-green-50 text-green-800">Cash</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">
          Manage and track payment transactions
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search payments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 w-full"
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
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={methodFilter} onValueChange={setMethodFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Payment Method</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="card">Card</SelectItem>
            <SelectItem value="upi">UPI</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading payments...</div>
      ) : filteredPayments.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No payments found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPayments.map((payment) => (
            <Card key={payment.id}>
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      Payment #{payment.id.substring(0, 8)}
                      {getStatusBadge(payment.status)}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(payment.paid_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="font-bold text-lg">₹{payment.amount.toLocaleString()}</div>
                    {getPaymentMethodBadge(payment.payment_method)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Customer</h4>
                    <p className="text-sm">{payment.booking?.user?.full_name || 'Unknown'}</p>
                    <p className="text-sm text-muted-foreground">{payment.booking?.user?.email}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Booking Details</h4>
                    <p className="text-sm">
                      {payment.booking?.vehicle?.name || 'Unknown vehicle'}
                    </p>
                    {payment.booking && (
                      <p className="text-sm text-muted-foreground">
                        {new Date(payment.booking.start_date).toLocaleDateString()} - {new Date(payment.booking.end_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                
                {payment.status !== 'paid' && (
                  <div className="mt-4 pt-4 border-t flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => updatePaymentStatus(payment.id, 'paid')}
                    >
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Mark as Paid
                    </Button>
                    {payment.status !== 'failed' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => updatePaymentStatus(payment.id, 'failed')}
                      >
                        <XCircle className="h-4 w-4 text-red-500" />
                        Mark as Failed
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
