import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  
  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-semibold text-professional">
          Dr. Sarah Mitchell
        </div>
        <div className="hidden md:flex space-x-6">
          <button 
            onClick={() => scrollToSection('about')}
            className="text-foreground hover:text-primary transition-colors"
          >
            About
          </button>
          <button 
            onClick={() => scrollToSection('services')}
            className="text-foreground hover:text-primary transition-colors"
          >
            Services
          </button>
          <button 
            onClick={() => scrollToSection('approach')}
            className="text-foreground hover:text-primary transition-colors"
          >
            Approach
          </button>
          <Link 
            to="/blog"
            className="text-foreground hover:text-primary transition-colors"
          >
            Blog
          </Link>
          <Link 
            to="/case-study"
            className="text-foreground hover:text-primary transition-colors"
          >
            Case Study
          </Link>
          <button 
            onClick={() => scrollToSection('contact')}
            className="text-foreground hover:text-primary transition-colors"
          >
            Contact
          </button>
        </div>
        <Button 
          onClick={() => scrollToSection('contact')}
          className="bg-primary hover:bg-primary/90"
        >
          Book Consultation
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;