import { useEffect, useState } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Bike,
  MapPin,
  ShoppingCart,
  CreditCard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Database
} from "lucide-react";

export default function AdminLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuthenticated");
    if (adminAuth !== "true") {
      navigate("/admin-auth");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    navigate("/admin-auth");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/admin/dashboard" },
    { icon: <Bike size={20} />, label: "Vehicles", path: "/admin/vehicles" },
    { icon: <MapPin size={20} />, label: "Locations", path: "/admin/locations" },
    { icon: <ShoppingCart size={20} />, label: "Bookings", path: "/admin/bookings" },
    { icon: <CreditCard size={20} />, label: "Payments", path: "/admin/payments" },
    { icon: <Users size={20} />, label: "Users", path: "/admin/users" },
    { icon: <Settings size={20} />, label: "Settings", path: "/admin/settings" },
    { icon: <Database size={20} />, label: "Seed Database", path: "/admin/seed-database" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t">
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2" 
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation bar */}
        <header className="bg-white border-b px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            <h2 className="text-lg font-semibold">Wheelie Wanderlust Admin</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="hidden md:flex"
            >
              <Link to="/">View Website</Link>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="md:hidden"
              onClick={handleLogout}
            >
              <LogOut size={18} />
            </Button>
          </div>
        </header>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b">
            <nav className="p-2">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>View Website</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
