import Navigation from "@/components/Navigation";
import Blog from "@/components/Blog";
import Footer from "@/components/Footer";

const BlogPage = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-20"> {/* Add padding-top to account for fixed navigation */}
        <Blog />
      </div>
      <Footer />
    </div>
  );
};

export default BlogPage;