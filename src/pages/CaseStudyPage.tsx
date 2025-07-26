import Navigation from "@/components/Navigation";
import CaseStudy from "@/components/CaseStudy";
import Footer from "@/components/Footer";

const CaseStudyPage = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-20"> {/* Add padding-top to account for fixed navigation */}
        <CaseStudy />
      </div>
      <Footer />
    </div>
  );
};

export default CaseStudyPage;