import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/admin/', '/api/'],
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'Google-Extended',
          'CCBot',
          'anthropic-ai',
          'Claude-Web',
          'Omgili',
          'Omgilibot',
          'FacebookBot',
          'Bytespider',
          'PerplexityBot',
          'cohere-ai'
        ],
        disallow: '/',
      }
    ],
    sitemap: 'https://codeinternx.com/sitemap.xml',
  };
}
