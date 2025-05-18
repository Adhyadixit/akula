
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container-custom py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-brand-blue">Akula Rentals</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-medium hover:text-brand-blue transition-colors">
              Home
            </Link>
            <Link to="/vehicles" className="font-medium hover:text-brand-blue transition-colors">
              Vehicles
            </Link>
            <Link to="/locations/rishikesh" className="font-medium hover:text-brand-blue transition-colors">
              Rishikesh
            </Link>
            <Link to="/locations/dehradun" className="font-medium hover:text-brand-blue transition-colors">
              Dehradun
            </Link>
            <Link to="/about-us" className="font-medium hover:text-brand-blue transition-colors">
              About Us
            </Link>
            <Link to="/contact-us" className="font-medium hover:text-brand-blue transition-colors">
              Contact
            </Link>
            <Link to="/faq" className="font-medium hover:text-brand-blue transition-colors">
              FAQ
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button asChild variant="outline">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/book-now">Book Now</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/vehicles"
                className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Vehicles
              </Link>
              <Link
                to="/locations/rishikesh"
                className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Rishikesh
              </Link>
              <Link
                to="/locations/dehradun"
                className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dehradun
              </Link>
              <Link
                to="/about-us"
                className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/contact-us"
                className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/faq"
                className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <div className="flex flex-col space-y-2 pt-2">
                <Button asChild variant="outline">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/book-now">Book Now</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
