
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-fabel-secondary/20">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-fabel-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-foreground">Fabel</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/features" className="text-muted-foreground hover:text-fabel-primary transition-colors">
              Features
            </Link>
            <Link to="/pricing" className="text-muted-foreground hover:text-fabel-primary transition-colors">
              Pricing
            </Link>
            <Link to="/about" className="text-muted-foreground hover:text-fabel-primary transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-muted-foreground hover:text-fabel-primary transition-colors">
              Contact
            </Link>
          </div>
          
          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" className="text-fabel-primary hover:bg-fabel-primary/10">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-fabel-primary hover:bg-fabel-primary/90 text-white rounded-lg">
                Sign Up Free
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`bg-current block h-0.5 w-6 rounded-sm transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
              <span className={`bg-current block h-0.5 w-6 rounded-sm transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`bg-current block h-0.5 w-6 rounded-sm transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
            </div>
          </Button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-fabel-secondary/20">
            <div className="flex flex-col space-y-4">
              <Link to="/features" className="text-muted-foreground hover:text-fabel-primary transition-colors">
                Features
              </Link>
              <Link to="/pricing" className="text-muted-foreground hover:text-fabel-primary transition-colors">
                Pricing
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-fabel-primary transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-fabel-primary transition-colors">
                Contact
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                <Link to="/login">
                  <Button variant="ghost" className="w-full text-fabel-primary hover:bg-fabel-primary/10">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="w-full bg-fabel-primary hover:bg-fabel-primary/90 text-white rounded-lg">
                    Sign Up Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
