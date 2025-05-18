
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BookingSuccessPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16">
        <div className="container-custom max-w-3xl">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-20 w-20 text-brand-green" />
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Booking Confirmed!</h1>
            <p className="text-gray-600 text-lg mb-6">
              Thank you for booking with Akula Rentals. Your rental request has been received and confirmed.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-gray-500">Booking ID</p>
                  <p className="font-medium">AKR-{Math.floor(100000 + Math.random() * 900000)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Payment Status</p>
                  <p className="font-medium text-brand-green">Confirmed</p>
                </div>
                <div>
                  <p className="text-gray-500">Pickup Date</p>
                  <p className="font-medium">Please check your email</p>
                </div>
                <div>
                  <p className="text-gray-500">Return Date</p>
                  <p className="font-medium">Please check your email</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-brand-blue mb-2">Next Steps</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>A confirmation email has been sent with all the details.</li>
                <li>Please bring your ID proof (Aadhar/PAN/Driving License) for verification.</li>
                <li>Our team will contact you before the pickup time.</li>
                <li>For any changes to your booking, please call us at 8005652230.</li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-brand-blue hover:bg-blue-700">
                <Link to="/">Return to Home</Link>
              </Button>
              <Button asChild variant="outline" className="border-brand-blue text-brand-blue">
                <a href="tel:8005652230">Contact Support</a>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingSuccessPage;
