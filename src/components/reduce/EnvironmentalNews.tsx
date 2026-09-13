import React, { useState, useEffect } from 'react';
import { Calendar, ExternalLink, TrendingUp, AlertCircle, CheckCircle, Beaker, RefreshCw } from 'lucide-react';
import { geminiService } from '../../services/geminiDirect';

export const EnvironmentalNews: React.FC = () => {
  const [news, setNews] = useState([
    {
      id: 1,
      title: 'Global Renewable Energy Capacity Reaches Record High',
      content: 'International Renewable Energy Agency reports that global renewable energy capacity increased by 260 GW in 2023, marking the largest annual increase ever recorded.',
      category: 'success',
      publishedAt: new Date('2024-01-15'),
      imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=200&fit=crop',
      source: 'Environmental Times'
    },
    {
      id: 2,
      title: 'Arctic Ice Melting Accelerates Beyond Climate Models',
      content: 'New research shows Arctic sea ice is melting 30% faster than previously predicted, raising concerns about sea level rise and global weather patterns.',
      category: 'climate',
      publishedAt: new Date('2024-01-12'),
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop',
      source: 'Climate Research Journal'
    },
    {
      id: 3,
      title: 'New Plastic-Eating Enzyme Shows Promise',
      content: 'Scientists develop enhanced enzyme that can break down plastic bottles in hours, offering potential solution to plastic pollution crisis.',
      category: 'research',
      publishedAt: new Date('2024-01-10'),
      imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=200&fit=crop',
      source: 'Science Daily'
    },
    {
      id: 4,
      title: 'EU Announces Stricter Carbon Emission Standards',
      content: 'European Union implements new regulations requiring 55% reduction in carbon emissions by 2030, setting ambitious climate targets.',
      category: 'policy',
      publishedAt: new Date('2024-01-08'),
      imageUrl: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=400&h=200&fit=crop',
      source: 'Policy Watch'
    },
    {
      id: 5,
      title: 'Ocean Cleanup Project Removes 100,000 kg of Plastic',
      content: 'The Ocean Cleanup foundation announces major milestone in removing plastic waste from the Great Pacific Garbage Patch.',
      category: 'success',
      publishedAt: new Date('2024-01-05'),
      imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=200&fit=crop',
      source: 'Ocean News'
    },
    {
      id: 6,
      title: 'Deforestation in Amazon Reaches Critical Levels',
      content: 'Satellite data reveals Amazon rainforest lost 8,000 square kilometers in 2023, threatening biodiversity and climate stability.',
      category: 'climate',
      publishedAt: new Date('2024-01-03'),
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop',
      source: 'Forest Watch'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const fetchEnvironmentalNews = async () => {
    setLoading(true);
    try {
      const newsData = await geminiService.getEnvironmentalNews();
      if (newsData.length > 0) {
        setNews(newsData);
      }
    } catch (error) {
      console.error('Error fetching environmental news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnvironmentalNews();
  }, []);

  const categories = [
    { id: 'all', label: 'All News', icon: TrendingUp },
    { id: 'climate', label: 'Climate Change', icon: AlertCircle },
    { id: 'success', label: 'Success Stories', icon: CheckCircle },
    { id: 'research', label: 'Research', icon: Beaker },
    { id: 'policy', label: 'Policy', icon: ExternalLink }
  ];

  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'climate':
        return 'bg-red-100 text-red-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'research':
        return 'bg-blue-100 text-blue-800';
      case 'policy':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Environmental News</h2>
            <p className="text-gray-600">
              Stay updated with the latest environmental news, research, and policy developments.
            </p>
          </div>
          <button
            onClick={fetchEnvironmentalNews}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} size={16} />
            {loading ? 'Loading...' : 'Refresh News'}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon size={16} />
              <span>{category.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((article) => (
          <article key={article.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-48 object-cover"
            />
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                  {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                </span>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar size={14} className="mr-1" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2">
                {article.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {article.content}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{article.source}</span>
                <button className="flex items-center text-green-600 hover:text-green-700 text-sm font-medium">
                  Read More
                  <ExternalLink size={14} className="ml-1" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-800 mb-2">📰 Stay Informed</h3>
        <p className="text-green-700">
          Environmental news is updated daily. Subscribe to our newsletter to get the latest 
          updates on climate change, conservation efforts, and sustainability initiatives 
          delivered to your inbox.
        </p>
        <button className="mt-3 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200">
          Subscribe to Newsletter
        </button>
      </div>
    </div>
  );
};