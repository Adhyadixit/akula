
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import VehiclesPage from "./pages/VehiclesPage";
import LocationPage from "./pages/LocationPage";
import BookingPage from "./pages/BookingPage";
import BookingSuccessPage from "./pages/BookingSuccessPage";
import NotFound from "./pages/NotFound";
import AboutUsPage from "./pages/AboutUsPage";
import ContactUsPage from "./pages/ContactUsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import FAQPage from "./pages/FAQPage";
import SupabaseTestPage from "./pages/SupabaseTestPage";
import LoginPage from "./pages/LoginPage";

// Admin Pages
import AdminAuthPage from "./pages/AdminAuthPage";
import AdminLayout from "./components/admin/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import { default as AdminVehiclesPage } from "./pages/admin/VehiclesPage";
import BookingsPage from "./pages/admin/BookingsPage";
import LocationsPage from "./pages/admin/LocationsPage";
import PaymentsPage from "./pages/admin/PaymentsPage";
import UsersPage from "./pages/admin/UsersPage";
import SettingsPage from "./pages/admin/SettingsPage";
import SeedDatabasePage from "./pages/admin/SeedDatabasePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/locations/:citySlug" element={<LocationPage />} />
          <Route path="/book-now" element={<BookingPage />} />
          <Route path="/booking-success" element={<BookingSuccessPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/supabase-test" element={<SupabaseTestPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin-auth" element={<AdminAuthPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="vehicles" element={<AdminVehiclesPage />} />
            <Route path="locations" element={<LocationsPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="seed-database" element={<SeedDatabasePage />} />
          </Route>
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
