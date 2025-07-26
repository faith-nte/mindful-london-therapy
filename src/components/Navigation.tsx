import { Button } from "@/components/ui/button";

const Navigation = () => {
  const scrollToSection = (sectionId: string) => {
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
          <button 
            onClick={() => scrollToSection('blog')}
            className="text-foreground hover:text-primary transition-colors"
          >
            Blog
          </button>
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