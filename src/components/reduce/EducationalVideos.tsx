import React from 'react';
import { Play, Clock, Eye } from 'lucide-react';

export const EducationalVideos: React.FC = () => {
  const videos = [
    {
      id: 1,
      title: 'Understanding Climate Change',
      description: 'A comprehensive overview of how climate change affects our planet and what we can do about it.',
      duration: '12:34',
      views: '2.1M',
      thumbnail: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=400&h=225&fit=crop',
      category: 'Climate Change'
    },
    {
      id: 2,
      title: 'Energy Conservation at Home',
      description: 'Simple tips and tricks to reduce energy consumption in your daily life.',
      duration: '8:45',
      views: '856K',
      thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=225&fit=crop',
      category: 'Energy Conservation'
    },
    {
      id: 3,
      title: 'Proper Waste Segregation',
      description: 'Learn how to properly segregate waste for effective recycling and disposal.',
      duration: '6:22',
      views: '1.3M',
      thumbnail: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=225&fit=crop',
      category: 'Waste Management'
    },
    {
      id: 4,
      title: 'Ocean Pollution Crisis',
      description: 'The devastating impact of plastic pollution on marine ecosystems.',
      duration: '15:18',
      views: '3.2M',
      thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=225&fit=crop',
      category: 'Ocean Conservation'
    },
    {
      id: 5,
      title: 'The Importance of Recycling',
      description: 'Why recycling matters and how it helps create a circular economy.',
      duration: '10:56',
      views: '1.8M',
      thumbnail: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=225&fit=crop',
      category: 'Recycling'
    },
    {
      id: 6,
      title: 'Sustainable Living Guide',
      description: 'A complete guide to adopting sustainable practices in your everyday life.',
      duration: '18:42',
      views: '2.7M',
      thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=225&fit=crop',
      category: 'Sustainable Living'
    }
  ];

  const categories = ['All', 'Climate Change', 'Energy Conservation', 'Waste Management', 'Ocean Conservation', 'Recycling', 'Sustainable Living'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredVideos = selectedCategory === 'All' 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Educational Videos</h2>
        <p className="text-gray-600 mb-6">
          Learn about environmental issues and solutions through our curated video collection.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <div key={video.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                <div className="bg-white bg-opacity-90 rounded-full p-3">
                  <Play className="text-green-600" size={24} />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
            </div>
            
            <div className="p-4">
              <div className="mb-2">
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {video.category}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                {video.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {video.description}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Eye size={14} className="mr-1" />
                  <span>{video.views} views</span>
                </div>
                <div className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  <span>{video.duration}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">📺 Video Suggestions</h3>
        <p className="text-blue-700">
          Have a video recommendation? We're always looking for quality educational content about 
          environmental conservation and sustainability. Share your suggestions with us!
        </p>
      </div>
    </div>
  );
};