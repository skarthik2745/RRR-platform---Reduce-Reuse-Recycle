import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Calendar, RefreshCw } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
  source: string;
  category: string;
}

export const ClimateNews: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'climate', 'environment', 'renewable', 'sustainability', 'pollution'];

  // Mock news data - in real implementation, this would fetch from the provided API
  const mockNews: NewsArticle[] = [
    {
      id: '1',
      title: 'Global Renewable Energy Capacity Reaches Record High',
      description: 'International renewable energy agency reports unprecedented growth in clean energy installations worldwide.',
      url: 'https://example.com/news1',
      imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=200&fit=crop',
      publishedAt: '2024-01-15T10:30:00Z',
      source: 'Climate News Network',
      category: 'renewable'
    },
    {
      id: '2',
      title: 'Ocean Plastic Cleanup Project Shows Promising Results',
      description: 'New technology successfully removes thousands of tons of plastic waste from Pacific Ocean.',
      url: 'https://example.com/news2',
      imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=200&fit=crop',
      publishedAt: '2024-01-14T15:45:00Z',
      source: 'Environmental Times',
      category: 'pollution'
    },
    {
      id: '3',
      title: 'Cities Worldwide Commit to Carbon Neutrality by 2030',
      description: 'Major metropolitan areas announce ambitious climate action plans to achieve net-zero emissions.',
      url: 'https://example.com/news3',
      imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=200&fit=crop',
      publishedAt: '2024-01-13T09:20:00Z',
      source: 'Urban Climate Report',
      category: 'climate'
    },
    {
      id: '4',
      title: 'Breakthrough in Carbon Capture Technology',
      description: 'Scientists develop new method to capture CO2 directly from atmosphere at lower costs.',
      url: 'https://example.com/news4',
      imageUrl: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=200&fit=crop',
      publishedAt: '2024-01-12T14:15:00Z',
      source: 'Science Climate Journal',
      category: 'climate'
    },
    {
      id: '5',
      title: 'Sustainable Fashion Industry Shows 40% Growth',
      description: 'Eco-friendly clothing brands experience significant market expansion as consumers choose sustainability.',
      url: 'https://example.com/news5',
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop',
      publishedAt: '2024-01-11T11:30:00Z',
      source: 'Sustainable Business News',
      category: 'sustainability'
    },
    {
      id: '6',
      title: 'Forest Restoration Project Plants 1 Million Trees',
      description: 'Global reforestation initiative reaches major milestone in fight against climate change.',
      url: 'https://example.com/news6',
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop',
      publishedAt: '2024-01-10T16:45:00Z',
      source: 'Green Planet News',
      category: 'environment'
    },
    {
      id: '7',
      title: 'Electric Vehicle Sales Surpass Traditional Cars',
      description: 'EV market share reaches historic high as charging infrastructure expands globally.',
      url: 'https://example.com/news7',
      imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=400&h=200&fit=crop',
      publishedAt: '2024-01-09T13:20:00Z',
      source: 'Transport Climate News',
      category: 'renewable'
    },
    {
      id: '8',
      title: 'Coral Reef Restoration Shows Signs of Recovery',
      description: 'Marine biologists report positive results from innovative coral restoration techniques.',
      url: 'https://example.com/news8',
      imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=200&fit=crop',
      publishedAt: '2024-01-08T08:15:00Z',
      source: 'Ocean Conservation Today',
      category: 'environment'
    }
  ];

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://newsdata.io/api/1/news?apikey=pub_bdd869d5fb8741a0899ba8c1907cdadf&q=climate%20change%20environment&language=en&size=10`);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const formattedNews = data.results.map((article: any, index: number) => ({
          id: article.article_id || `news-${index}`,
          title: article.title || 'No title available',
          description: article.description || article.content || 'No description available',
          url: article.link || '#',
          imageUrl: article.image_url || 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=400&h=200&fit=crop',
          publishedAt: article.pubDate || new Date().toISOString(),
          source: article.source_id || 'Unknown Source',
          category: article.category?.[0] || 'climate'
        }));
        setNews(formattedNews);
      } else {
        setNews(mockNews);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setNews(mockNews);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(article => article.category === selectedCategory);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'climate': 'blue',
      'environment': 'green',
      'renewable': 'yellow',
      'sustainability': 'purple',
      'pollution': 'red'
    };
    return colors[category] || 'gray';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#FFD700' }}>Climate News</h2>
          <p style={{ color: '#E6C55F' }}>Stay updated with the latest environmental news</p>
        </div>
        <button
          onClick={fetchNews}
          disabled={loading}
          className="text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center font-semibold hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #B8860B, #DAA520)',
            border: '2px solid #FFD700',
            boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
          }}
        >
          <RefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} size={20} />
          {loading ? 'Loading...' : 'Refresh News'}
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                selectedCategory === category
                  ? 'text-white shadow-md' : 'hover:text-white'
              }`}
              style={selectedCategory === category ? {
                background: 'linear-gradient(135deg, #B8860B, #DAA520)',
                border: '2px solid #FFD700'
              } : {
                background: 'rgba(45, 80, 22, 0.2)',
                color: '#E6C55F',
                border: '1px solid rgba(255, 215, 0, 0.3)'
              }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* News Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((article) => (
          <div
            key={article.id}
            className="rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
            style={{
              background: 'rgba(45, 80, 22, 0.2)',
              border: '1px solid rgba(255, 215, 0, 0.3)'
            }}
          >
            <div className="relative">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className={`bg-${getCategoryColor(article.category)}-500 text-white px-2 py-1 rounded-full text-xs font-medium`}>
                  {article.category}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center text-xs text-gray-500 mb-2">
                <Calendar size={12} className="mr-1" />
                <span>{formatDate(article.publishedAt)}</span>
                <span className="mx-2">•</span>
                <span>{article.source}</span>
              </div>
              
              <h3 className="text-lg font-semibold mb-2 line-clamp-2" style={{ color: '#FFD700' }}>
                {article.title}
              </h3>
              
              <p className="text-sm mb-4 line-clamp-3" style={{ color: '#E6C55F' }}>
                {article.description}
              </p>
              
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
              >
                Read Full Article
                <ExternalLink size={14} className="ml-1" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredNews.length === 0 && !loading && (
        <div className="text-center py-12">
          <Newspaper className="mx-auto mb-4" style={{ color: '#B8860B' }} size={48} />
          <p className="text-lg" style={{ color: '#E6C55F' }}>No news articles found</p>
          <p className="mt-2" style={{ color: '#B8860B' }}>Try selecting a different category or refresh the news</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <RefreshCw className="mx-auto mb-4 animate-spin" style={{ color: '#FFD700' }} size={48} />
          <p className="text-lg" style={{ color: '#E6C55F' }}>Loading latest climate news...</p>
        </div>
      )}

      {/* News Source Attribution */}
      <div className="mt-8 rounded-xl p-6 text-center" style={{
        background: 'rgba(45, 80, 22, 0.3)',
        border: '1px solid rgba(255, 215, 0, 0.3)'
      }}>
        <Newspaper className="mx-auto mb-4" style={{ color: '#FFD700' }} size={48} />
        <h3 className="text-xl font-semibold mb-2" style={{ color: '#FFD700' }}>Stay Informed</h3>
        <p style={{ color: '#E6C55F' }}>
          Get the latest updates on climate change, environmental protection, and sustainability efforts worldwide.
        </p>
      </div>
    </div>
  );
};