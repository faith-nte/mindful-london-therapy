import { Card } from "@/components/ui/card";
import therapistImage from "@/assets/therapist-headshot.jpg";

const About = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-professional mb-4">
              About Dr. Sarah Mitchell
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Dedicated to providing <strong>compassionate, professional therapy services</strong> 
              that honor your unique journey toward <strong>healing and personal growth</strong>.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Card className="p-8 shadow-lg">
                <img 
                  src={therapistImage}
                  alt="Dr. Sarah Mitchell - Chartered Clinical Psychologist specializing in anxiety, depression, and trauma therapy in London"
                  className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-primary/20"
                />
                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-professional mb-2">
                    Dr. Sarah Mitchell
                  </h3>
                  <p className="text-primary font-medium mb-4">
                    Chartered Clinical Psychologist
                  </p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>BACP Accredited</p>
                    <p>DClinPsy, University College London</p>
                    <p>BSc Psychology (First Class Honours)</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-8 shadow-lg">
                <h3 className="text-2xl font-semibold text-professional mb-4">
                  My Philosophy
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  I believe that every person has the capacity for <strong>growth and healing</strong>. 
                  My role is to provide a <strong>safe, non-judgmental space</strong> where you can 
                  explore your thoughts and feelings, develop new coping strategies, 
                  and work toward your goals.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Drawing from <strong>evidence-based therapeutic approaches</strong>, I tailor my 
                  work to meet your individual needs, whether you're dealing with 
                  <strong>anxiety, depression, relationship issues, or life transitions</strong>. 
                  Learn more about my <a href="#services" className="text-primary hover:text-primary/80 underline">therapy services</a> and 
                  <a href="#approach" className="text-primary hover:text-primary/80 underline ml-1">therapeutic approach</a>.
                </p>
              </Card>

              <Card className="p-8 shadow-lg">
                <h3 className="text-2xl font-semibold text-professional mb-4">
                  Specializations
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Anxiety & Stress</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Depression</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Trauma & PTSD</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Relationships</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Life Transitions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Self-Esteem</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;