export interface WordPressPost {
  id: number;
  title: {
    rendered: string;
  };
  excerpt: {
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

export interface WordPressApiConfig {
  baseUrl: string;
  postsPerPage?: number;
}

export class WordPressApiService {
  private baseUrl: string;
  private postsPerPage: number;

  constructor(config: WordPressApiConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.postsPerPage = config.postsPerPage || 10;
  }

  async getPosts(page: number = 1): Promise<{ posts: WordPressPost[]; hasMore: boolean }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/wp-json/wp/v2/posts?per_page=${this.postsPerPage}&page=${page}&_embed=true`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
      
      const posts: WordPressPost[] = await response.json();
      
      // Check if there are more posts by looking at the total pages header
      const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');
      const hasMore = page < totalPages;
      
      return { posts, hasMore };
    } catch (error) {
      console.error('Error fetching WordPress posts:', error);
      throw error;
    }
  }

  async getPost(id: number): Promise<WordPressPost> {
    try {
      const response = await fetch(`${this.baseUrl}/wp-json/wp/v2/posts/${id}?_embed=true`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch post: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching WordPress post:', error);
      throw error;
    }
  }

  async getPostBySlug(slug: string): Promise<WordPressPost> {
    try {
      const response = await fetch(`${this.baseUrl}/wp-json/wp/v2/posts?slug=${slug}&_embed=true`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch post: ${response.statusText}`);
      }
      
      const posts: WordPressPost[] = await response.json();
      
      if (posts.length === 0) {
        throw new Error('Post not found');
      }
      
      return posts[0];
    } catch (error) {
      console.error('Error fetching WordPress post by slug:', error);
      throw error;
    }
  }
}