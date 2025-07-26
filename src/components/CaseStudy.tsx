import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

interface WordPressPage {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  date: string;
  slug: string;
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

const CaseStudy = () => {
  const [caseStudy, setCaseStudy] = useState<WordPressPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadCaseStudy();
  }, []);

  const loadCaseStudy = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        'https://fenn.digital/wp-json/wp/v2/pages?slug=private-psychiatrists-seo&_embed=true'
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch case study: ${response.statusText}`);
      }
      
      const pages: WordPressPage[] = await response.json();
      
      if (pages.length === 0) {
        throw new Error('Case study not found');
      }
      
      setCaseStudy(pages[0]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load case study';
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

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-3/4 mb-8 mx-auto" />
            <Skeleton className="h-64 w-full mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 border-destructive">
              <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Case Study</h2>
              <p className="text-destructive">{error}</p>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  if (!caseStudy) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-muted-foreground mb-4">No Case Study Found</h2>
              <p className="text-muted-foreground">The requested case study could not be found.</p>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  const featuredImage = caseStudy._embedded?.['wp:featuredmedia']?.[0];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-professional mb-4">
              {stripHtml(caseStudy.title.rendered)}
            </h1>
            <div className="text-sm text-primary mb-8">
              Published on {formatDate(caseStudy.date)}
            </div>
          </div>

          {featuredImage && (
            <div className="mb-12">
              <img 
                src={featuredImage.source_url}
                alt={featuredImage.alt_text || caseStudy.title.rendered}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          )}

          <Card className="p-8">
            <div 
              className="prose prose-lg max-w-none text-foreground"
              dangerouslySetInnerHTML={{ __html: caseStudy.content.rendered }}
            />
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CaseStudy;