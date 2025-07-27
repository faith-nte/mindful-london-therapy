import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { WordPressApiService, WordPressPost } from "@/services/wordpressApi";
import { ArrowLeft } from "lucide-react";

interface BlogPostViewProps {
  post: WordPressPost;
  onBack: () => void;
}

const BlogPostView = ({ post, onBack }: BlogPostViewProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const stripHtml = (html: string) => {
    // SSR-safe: remove HTML tags using regex
    return html.replace(/<[^>]*>/g, "");
  };

  // Bold key phrases in content for SEO
  const boldKeyPhrases = (html: string) => {
    let out = html;
    [
      /Dr\. Sarah Mitchell/gi,
      /mental health/gi,
      /therapy/gi,
      /private practice/gi,
      /SEO/gi,
      /Three Best Rated/gi
    ].forEach((re) => {
      out = out.replace(re, (match) => `<strong>${match}</strong>`);
    });
    return out;
  };

  const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0];

  return (
    <div className="max-w-4xl mx-auto">
      <Button
        onClick={onBack}
        variant="outline"
        className="mb-8 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Button>

      <article>
        <div className="text-center mb-12">
          {/* H1 for SEO */}
          <h1 className="text-4xl font-bold text-professional mb-4">
            {stripHtml(post.title.rendered)}
          </h1>
          <div className="text-sm text-primary mb-8">
            Published on {formatDate(post.date)}
          </div>
        </div>

        {featuredImage && (
          <div className="mb-12">
            <img
              src={featuredImage.source_url}
              alt={featuredImage.alt_text || stripHtml(post.title.rendered)}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        )}

        <Card className="p-8">
          <div
            className="prose prose-lg max-w-none text-foreground"
            dangerouslySetInnerHTML={{ __html: boldKeyPhrases(post.content.rendered) }}
          />
        </Card>
      </article>
    </div>
  );
};

interface BlogProps {
  slug?: string;
  ssrPost?: any;
}

const Blog = ({ slug, ssrPost }: BlogProps) => {
  // Check for SSR data - must be consistent between server and client
  const getSSRData = () => {
    if (typeof window !== "undefined") {
      return (window as any).__SSR_DATA__;
    }
    if (typeof global !== "undefined") {
      return (global as any).__SSR_DATA__;
    }
    return null;
  };

  const ssrData = getSSRData();
  
  // For SSR consistency, initialize state with the exact same values on server and client
  const initialPost = ssrPost || ssrData?.post || null;
  const initialPosts = ssrData?.posts || [];
  const initialLoading = !ssrData && !initialPost && !initialPosts.length;
  const initialHasMore = ssrData?.hasMore ?? true;
  
  const [posts, setPosts] = useState<WordPressPost[]>(initialPosts);
  const [selectedPost, setSelectedPost] = useState<WordPressPost | null>(initialPost);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [apiService] = useState<WordPressApiService>(
    () => new WordPressApiService({ baseUrl: "https://fenn.digital" })
  );
  const [isConfigured] = useState(true);
  const { toast } = useToast();

  // Prevent hydration mismatches by only loading data on client after hydration
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Only run after hydration is complete
    if (!isHydrated) return;
    
    // SSR for single post view
    if (slug) {
      // If we already have the post from SSR or props, don't fetch again
      if (initialPost) {
        setSelectedPost(initialPost);
        setLoading(false);
        return;
      }
      
      // Only fetch if we don't have SSR data
      (async () => {
        setLoading(true);
        setError(null);
        try {
          const post = await apiService.getPostBySlug(slug);
          if (post) {
            setSelectedPost(post);
          } else {
            setError("Post not found");
          }
        } catch (err) {
          setError("Failed to load post");
        } finally {
          setLoading(false);
        }
      })();
      return;
    }
    
    // Only load posts if we don't have SSR data
    if (!initialPosts.length) {
      loadPosts(1, true);
    }
  }, [slug, initialPost, isHydrated]);

  const loadPosts = async (page: number = 1, reset: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      const { posts: newPosts, hasMore: moreAvailable } =
        await apiService.getPosts(page);

      setPosts((prev) => (reset ? newPosts : [...prev, ...newPosts]));
      setHasMore(moreAvailable);
      setCurrentPage(page);

      if (reset) {
        toast({
          title: "Success",
          description: `Loaded ${newPosts.length} blog posts`,
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load posts";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const stripHtml = (html: string) => {
    // SSR-safe: remove HTML tags using regex
    return html.replace(/<[^>]*>/g, "");
  };

  if (selectedPost) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <BlogPostView
            post={selectedPost}
            onBack={() => setSelectedPost(null)}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-professional mb-4">
              Insights & Resources
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore articles on mental health, therapeutic techniques, and
              personal growth to support your journey to wellbeing.
            </p>
          </div>

          {error && (
            <Card className="p-6 mb-8 border-destructive">
              <p className="text-destructive text-center">{error}</p>
              <Button
                onClick={() => loadPosts(1, true)}
                variant="outline"
                className="w-full mt-4"
              >
                Try Again
              </Button>
            </Card>
          )}

          {loading && posts.length === 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-48 w-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {posts.map((post) => {
                  const featuredImage =
                    post._embedded?.["wp:featuredmedia"]?.[0];

                  return (
                    <Card
                      key={post.id}
                      className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow group cursor-pointer"
                    >
                      {featuredImage && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={featuredImage.source_url}
                            alt={featuredImage.alt_text || post.title.rendered}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      <div className="p-6">
                        <div className="text-sm text-primary mb-2">
                          {formatDate(post.date)}
                        </div>

                        <h3 className="text-xl font-semibold text-professional mb-3 line-clamp-2">
                          {stripHtml(post.title.rendered)}
                        </h3>

                        <div
                          className="text-muted-foreground mb-4 line-clamp-3 prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: post.excerpt.rendered,
                          }}
                        />

                        <Link
                          to={`/blog/${post.slug}`}
                          className="block w-full border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-4 py-2 text-center rounded transition-colors"
                        >
                          Read More
                        </Link>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {hasMore && (
                <div className="text-center">
                  <Button
                    onClick={() => loadPosts(currentPage + 1)}
                    disabled={loading}
                    variant="outline"
                    size="lg"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    {loading ? "Loading..." : "Load More Articles"}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Blog;
