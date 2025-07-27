import Navigation from "@/components/Navigation";
import Blog from "@/components/Blog";
import Footer from "@/components/Footer";

import { useParams } from "react-router-dom";

const BlogPage = ({ post }: { post?: any }) => {
  const { slug } = useParams();
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        {/* Add padding-top to account for fixed navigation */}
        <Blog slug={slug} ssrPost={post} />
      </div>
      <Footer />
    </div>
  );
};

export default BlogPage;
