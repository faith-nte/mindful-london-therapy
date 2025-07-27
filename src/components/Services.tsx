import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Services = () => {
  const services = [
    {
      title: "Individual Therapy",
      duration: "50 minutes",
      price: "£120",
      description: "One-to-one sessions focused on your personal goals and challenges.",
      features: [
        "Personalized treatment approach",
        "Confidential and safe space",
        "Evidence-based techniques",
        "Flexible scheduling"
      ]
    },
    {
      title: "Couples Therapy",
      duration: "60 minutes",
      price: "£150",
      description: "Support for couples working through relationship challenges together.",
      features: [
        "Communication improvement",
        "Conflict resolution strategies",
        "Rebuilding trust and intimacy",
        "Relationship skills development"
      ]
    },
    {
      title: "Group Therapy",
      duration: "90 minutes",
      price: "£60",
      description: "Therapeutic support in a small group setting with shared experiences.",
      features: [
        "Peer support and connection",
        "Cost-effective option",
        "Skill-building workshops",
        "6-8 participants maximum"
      ]
    }
  ];

  const approaches = [
    {
      name: "Cognitive Behavioral Therapy (CBT)",
      description: "Evidence-based approach focusing on thoughts, feelings, and behaviors."
    },
    {
      name: "Acceptance & Commitment Therapy (ACT)",
      description: "Mindfulness-based therapy emphasizing psychological flexibility."
    },
    {
      name: "Person-Centered Therapy",
      description: "Client-led approach emphasizing self-discovery and personal growth."
    },
    {
      name: "Trauma-Informed Care",
      description: "Specialized approach for processing and healing from traumatic experiences."
    }
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Services Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-professional mb-4">
              Therapy Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              <strong>Professional therapy services</strong> tailored to your individual needs, 
              delivered with compassion and expertise in central London. 
              <a href="#contact" className="text-primary hover:text-primary/80 underline">Contact me</a> to learn more about how I can support you.
            </p>
          </div>

          {/* Service Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {services.map((service, index) => (
              <Card key={index} className="p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-semibold text-professional mb-2">
                    {service.title}
                  </h3>
                  <div className="flex justify-center items-center space-x-2 text-primary">
                    <span className="text-3xl font-bold">{service.price}</span>
                    <span className="text-sm text-muted-foreground">/ {service.duration}</span>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-center mb-6">
                  {service.description}
                </p>
                
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-healing rounded-full flex-shrink-0"></div>
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant="outline" 
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Book This Service
                </Button>
              </Card>
            ))}
          </div>

          {/* Therapeutic Approaches */}
          <div>
            <h3 className="text-3xl font-bold text-professional text-center mb-12">
              Therapeutic Approaches
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              {approaches.map((approach, index) => (
                <Card key={index} className="p-6 shadow-lg">
                  <h4 className="text-xl font-semibold text-professional mb-3">
                    {approach.name}
                  </h4>
                  <p className="text-muted-foreground">
                    {approach.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;