import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { WordPressApiService, WordPressPost } from '@/services/wordpressApi';

const Blog = () => {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [wordpressUrl, setWordpressUrl] = useState('');
  const [apiService, setApiService] = useState<WordPressApiService | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const { toast } = useToast();

  const loadPosts = async (page: number = 1, reset: boolean = false) => {
    if (!apiService) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { posts: newPosts, hasMore: moreAvailable } = await apiService.getPosts(page);
      
      setPosts(prev => reset ? newPosts : [...prev, ...newPosts]);
      setHasMore(moreAvailable);
      setCurrentPage(page);
      
      if (reset) {
        toast({
          title: "Success",
          description: `Loaded ${newPosts.length} blog posts`,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load posts';
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

  const handleConnect = async () => {
    if (!wordpressUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a WordPress site URL",
        variant: "destructive",
      });
      return;
    }

    try {
      const service = new WordPressApiService({ baseUrl: wordpressUrl.trim() });
      setApiService(service);
      setIsConfigured(true);
      
      // Test the connection by loading the first page
      await loadPosts(1, true);
    } catch (err) {
      toast({
        title: "Connection Failed",
        description: "Unable to connect to WordPress site. Please check the URL.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  if (!isConfigured) {
    return (
      <section id="blog" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-professional mb-4">
                Insights & Resources
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Connect to a WordPress blog to share therapeutic insights, 
                mental health resources, and professional guidance.
              </p>
            </div>

            <Card className="p-8 max-w-2xl mx-auto">
              <div className="space-y-6">
                <div>
                  <label htmlFor="wordpress-url" className="block text-sm font-medium text-professional mb-2">
                    WordPress Site URL
                  </label>
                  <Input
                    id="wordpress-url"
                    type="url"
                    value={wordpressUrl}
                    onChange={(e) => setWordpressUrl(e.target.value)}
                    placeholder="https://your-wordpress-site.com"
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Enter the URL of your WordPress site (e.g., https://blog.example.com)
                  </p>
                </div>
                
                <Button 
                  onClick={handleConnect}
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {loading ? "Connecting..." : "Connect to WordPress"}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-professional mb-4">
              Insights & Resources
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore articles on mental health, therapeutic techniques, 
              and personal growth to support your journey to wellbeing.
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
                  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0];
                  
                  return (
                    <Card key={post.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
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
                        
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {stripHtml(post.excerpt.rendered)}
                        </p>
                        
                        <Button 
                          variant="outline"
                          className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                          onClick={() => window.open(`${wordpressUrl}/${post.slug}`, '_blank')}
                        >
                          Read More
                        </Button>
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