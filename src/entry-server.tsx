import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';

// Page-specific meta data
const getPageMeta = (url: string, apiData?: any) => {
  const baseUrl = 'https://yourdomain.com'; // Update with your actual domain
  
  switch (url) {
    case '/':
      return {
        title: 'Dr. Sarah Mitchell - Professional Therapy Services in London',
        description: 'Professional therapy services in central London. Dr. Sarah Mitchell offers individual, couples, and group therapy with evidence-based approaches. BACP accredited.',
        ogImage: `${baseUrl}/og-home.jpg`,
        canonical: baseUrl,
        schema: {
          "@context": "https://schema.org",
          "@type": "MedicalBusiness",
          "name": "Dr. Sarah Mitchell Therapy Services",
          "description": "Professional therapy services in central London",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "London",
            "addressCountry": "UK"
          },
          "telephone": "+44-XXX-XXX-XXXX"
        }
      };
    
    case '/blog':
      return {
        title: 'Therapy Blog - Mental Health Articles by Dr. Sarah Mitchell',
        description: 'Read expert insights on mental health, therapy techniques, and psychological wellbeing from Dr. Sarah Mitchell. Evidence-based articles on anxiety, depression, and more.',
        ogImage: `${baseUrl}/og-blog.jpg`,
        canonical: `${baseUrl}/blog`,
        schema: {
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Dr. Sarah Mitchell Therapy Blog",
          "description": "Expert insights on mental health and therapy",
          "author": {
            "@type": "Person",
            "name": "Dr. Sarah Mitchell"
          }
        }
      };
    
    case '/case-study':
      return {
        title: 'SEO Case Study - Private Psychiatrists Digital Marketing Success',
        description: 'Discover how our SEO strategy helped private psychiatrists increase their online visibility by 300%. Learn proven digital marketing techniques for healthcare professionals.',
        ogImage: `${baseUrl}/og-case-study.jpg`,
        canonical: `${baseUrl}/case-study`,
        schema: {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "SEO Case Study - Private Psychiatrists Digital Marketing Success",
          "author": {
            "@type": "Person",
            "name": "Dr. Sarah Mitchell"
          },
          "datePublished": "2024-01-01"
        }
      };
    
    default:
      return {
        title: 'Dr. Sarah Mitchell - Therapy Services in London',
        description: 'Professional therapy services in central London. Dr. Sarah Mitchell offers individual, couples, and group therapy with evidence-based approaches. BACP accredited.',
        ogImage: `${baseUrl}/og-home.jpg`,
        canonical: baseUrl,
        schema: null
      };
  }
};

export async function render(url: string, apiData?: any) {
  // Set global API data for SSR
  if (typeof window === 'undefined') {
    (global as any).__SSR_DATA__ = apiData || {};
    (global as any).__PAGE_META__ = getPageMeta(url, apiData);
  }
  
  const html = ReactDOMServer.renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
  
  return html;
}

export { getPageMeta };