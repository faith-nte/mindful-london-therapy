const Footer = () => {
  return (
    <footer className="bg-professional text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Practice Info */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Dr. Sarah Mitchell</h3>
              <p className="text-primary-foreground/80 mb-4 leading-relaxed">
                Professional therapy services in central London, supporting 
                individuals and couples on their journey toward healing and growth.
              </p>
              <div className="text-sm text-primary-foreground/70">
                <p>BACP Accredited</p>
                <p>Chartered Clinical Psychologist</p>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>
                  <button 
                    onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-primary-foreground transition-colors"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Services
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => document.getElementById('approach')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Approach
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-primary-foreground/80 text-sm">
                <p>Harley Street, London W1G 9QD</p>
                <p>+44 20 7123 4567</p>
                <p>hello@sarahmitchelltherapy.co.uk</p>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Office Hours</h4>
                <div className="text-sm text-primary-foreground/70 space-y-1">
                  <p>Mon-Fri: 9:00 AM - 7:00 PM</p>
                  <p>Sat: 10:00 AM - 4:00 PM</p>
                  <p>Sun: Closed</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-primary-foreground/70">
                © 2024 Dr. Sarah Mitchell Therapy. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm text-primary-foreground/70">
                <a href="#" className="hover:text-primary-foreground transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-primary-foreground transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-primary-foreground transition-colors">
                  Professional Standards
                </a>
              </div>
            </div>
            
            <div className="mt-4 text-xs text-primary-foreground/60">
              <p>
                This website is for informational purposes only and does not constitute medical advice. 
                If you are experiencing a mental health emergency, please contact emergency services immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;