import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would submit this to your backend
    toast({
      title: "Message Sent",
      description: "Thank you for your enquiry. I'll get back to you within 24 hours.",
    });
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-professional mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ready to take the first step? I offer a free 15-minute consultation 
              to discuss your needs and answer any questions you may have.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-8">
              <Card className="p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-professional mb-4">
                  Practice Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Location</h4>
                    <p className="text-muted-foreground text-sm">
                      Harley Street<br />
                      London W1G 9QD<br />
                      United Kingdom
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Phone</h4>
                    <p className="text-muted-foreground text-sm">
                      +44 20 7123 4567
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Email</h4>
                    <p className="text-muted-foreground text-sm">
                      hello@sarahmitchelltherapy.co.uk
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Hours</h4>
                    <div className="text-muted-foreground text-sm space-y-1">
                      <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                      <p>Saturday: 10:00 AM - 4:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-professional mb-4">
                  Insurance & Payment
                </h3>
                
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>• Private health insurance accepted</p>
                  <p>• Self-pay options available</p>
                  <p>• Sliding scale fees for students</p>
                  <p>• Payment by card or bank transfer</p>
                  <p>• 24-hour cancellation policy</p>
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="p-8 shadow-lg">
                <h3 className="text-2xl font-semibold text-professional mb-6">
                  Send Me a Message
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="border-input focus:ring-primary"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="border-input focus:ring-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="border-input focus:ring-primary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="border-input focus:ring-primary"
                      placeholder="Please tell me a bit about what you'd like to discuss in our consultation..."
                    />
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Confidentiality:</strong> Your message will be treated with complete confidentiality. 
                      I typically respond within 24 hours during business days.
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    size="lg"
                    className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                  >
                    Send Message
                  </Button>
                </form>
              </Card>
              
              {/* Emergency Notice */}
              <Card className="mt-6 p-6 bg-destructive/10 border-destructive/20 shadow-lg">
                <h4 className="font-semibold text-destructive mb-2">
                  Crisis Support
                </h4>
                <p className="text-sm text-muted-foreground">
                  If you're experiencing a mental health crisis, please contact:
                </p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• Samaritans: 116 123 (free, 24/7)</li>
                  <li>• Crisis Text Line: Text SHOUT to 85258</li>
                  <li>• Emergency Services: 999</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;