import { Card } from "@/components/ui/card";

const Approach = () => {
  const principles = [
    {
      title: "Safe & Confidential",
      description: "Your privacy and safety are paramount. All sessions are strictly confidential and conducted in a secure, welcoming environment.",
      icon: "🛡️"
    },
    {
      title: "Non-Judgmental",
      description: "Experience a space free from judgment where you can be authentic and explore your thoughts and feelings openly.",
      icon: "🤝"
    },
    {
      title: "Evidence-Based",
      description: "Treatment approaches are grounded in scientific research and proven therapeutic methods tailored to your specific needs.",
      icon: "🧠"
    },
    {
      title: "Collaborative",
      description: "We work together as partners in your healing journey, with you setting the pace and direction of our work.",
      icon: "🌟"
    }
  ];

  const process = [
    {
      step: "01",
      title: "Initial Consultation",
      description: "We begin with a free 15-minute consultation to discuss your needs and see if we're a good fit."
    },
    {
      step: "02", 
      title: "Assessment",
      description: "In our first full session, we'll explore your background, current challenges, and therapeutic goals."
    },
    {
      step: "03",
      title: "Treatment Planning",
      description: "Together, we'll develop a personalized treatment plan that aligns with your objectives and preferences."
    },
    {
      step: "04",
      title: "Ongoing Therapy",
      description: "Regular sessions focused on implementing strategies, processing experiences, and tracking progress."
    }
  ];

  return (
    <section id="approach" className="py-20 bg-gradient-to-b from-muted to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-professional mb-4">
              My Therapeutic Approach
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Creating a foundation of <strong>trust, safety, and collaboration</strong> to support 
              your journey toward <strong>healing and personal growth</strong>. 
              Explore my <a href="#services" className="text-primary hover:text-primary/80 underline">therapy services</a> to find the right fit for you.
            </p>
          </div>

          {/* Core Principles */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {principles.map((principle, index) => (
              <Card key={index} className="p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{principle.icon}</div>
                <h3 className="text-xl font-semibold text-professional mb-3">
                  {principle.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {principle.description}
                </p>
              </Card>
            ))}
          </div>

          {/* Process */}
          <div>
            <h3 className="text-3xl font-bold text-professional text-center mb-12">
              The Therapeutic Process
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((item, index) => (
                <div key={index} className="relative">
                  <Card className="p-6 shadow-lg h-full">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full text-xl font-bold mb-4">
                        {item.step}
                      </div>
                      <h4 className="text-lg font-semibold text-professional mb-3">
                        {item.title}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {item.description}
                      </p>
                    </div>
                  </Card>
                  
                  {/* Connector Line */}
                  {index < process.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary/30 transform -translate-y-1/2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* What to Expect */}
          <div className="mt-20">
            <Card className="p-8 shadow-lg bg-calm-light/20">
              <h3 className="text-2xl font-bold text-professional text-center mb-8">
                What to Expect in Your First Session
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-professional">
                    We'll Cover:
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Your current concerns and goals</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Relevant background and history</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Previous therapy experience (if any)</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Questions about the therapeutic process</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-professional">
                    You Can Expect:
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-healing rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">A warm, non-judgmental atmosphere</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-healing rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Complete confidentiality</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-healing rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Clear explanation of my approach</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-healing rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">No pressure to share more than you're comfortable with</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Approach;