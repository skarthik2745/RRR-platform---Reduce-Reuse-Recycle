import React, { useState, useEffect } from 'react';
import { AlertTriangle, Thermometer, Droplets, Wind, RefreshCw } from 'lucide-react';
import { geminiService } from '../../services/geminiDirect';

export const ClimateAwareness: React.FC = () => {
  const [articles, setArticles] = useState([
    {
      id: 1,
      title: 'Global Temperature Rise Accelerates',
      content: 'Recent studies show that global temperatures have risen by 1.2°C since pre-industrial times, with significant impacts on weather patterns.',
      category: 'climate',
      icon: Thermometer,
      color: 'text-red-500'
    },
    {
      id: 2,
      title: 'Plastic Pollution in Oceans Reaches Critical Levels',
      content: 'Over 8 million tons of plastic waste enter our oceans annually, threatening marine ecosystems and food chains.',
      category: 'pollution',
      icon: Droplets,
      color: 'text-blue-500'
    },
    {
      id: 3,
      title: 'Carbon Emissions Hit Record High',
      content: 'Global CO2 emissions reached 36.8 billion tons in 2023, highlighting the urgent need for sustainable practices.',
      category: 'emissions',
      icon: Wind,
      color: 'text-gray-500'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const fetchClimateNews = async () => {
    setLoading(true);
    try {
      const news = await geminiService.getClimateNews();
      if (news.length > 0) {
        const formattedNews = news.map((item: any, index: number) => ({
          id: index + 1,
          title: item.title,
          content: item.content,
          category: item.category,
          icon: index % 3 === 0 ? Thermometer : index % 3 === 1 ? Droplets : Wind,
          color: index % 3 === 0 ? 'text-red-500' : index % 3 === 1 ? 'text-blue-500' : 'text-gray-500'
        }));
        setArticles(formattedNews);
      }
    } catch (error) {
      console.error('Error fetching climate news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClimateNews();
  }, []);

  const infographics = [
    {
      title: 'Plastic Takes 450+ Years to Decompose',
      description: 'A single plastic bottle can take centuries to break down naturally.',
      stat: '450+ years'
    },
    {
      title: 'Deforestation Rate',
      description: 'We lose 18.7 million acres of forest annually.',
      stat: '18.7M acres/year'
    },
    {
      title: 'Ocean Temperature Rise',
      description: 'Ocean temperatures have increased by 0.6°C since 1969.',
      stat: '+0.6°C'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Climate Change Awareness</h2>
          <button
            onClick={fetchClimateNews}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} size={16} />
            {loading ? 'Loading...' : 'Refresh News'}
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {articles.map((article) => {
            const Icon = article.icon;
            return (
              <div key={article.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <Icon className={`${article.color} mr-3`} size={24} />
                  <h3 className="text-lg font-semibold text-gray-800">{article.title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{article.content}</p>
                <div className="mt-4">
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {article.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-6">Environmental Impact Statistics</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {infographics.map((info, index) => (
            <div key={index} className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{info.stat}</div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">{info.title}</h4>
              <p className="text-gray-600 text-sm">{info.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
        <div className="flex items-center">
          <AlertTriangle className="text-yellow-400 mr-3" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-yellow-800">Take Action Now</h3>
            <p className="text-yellow-700 mt-1">
              Every small action counts. Start with simple changes in your daily routine to make a significant impact on our planet's future.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};