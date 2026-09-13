import React from 'react';

interface SearchFiltersProps {
  filters: {
    category: string;
    condition: string;
    priceType: string;
    location: string;
  };
  onFiltersChange: (filters: any) => void;
  categories: string[];
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFiltersChange, categories }) => {
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: 'all',
      condition: 'all',
      priceType: 'all',
      location: 'all'
    });
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="grid md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condition
          </label>
          <select
            value={filters.condition}
            onChange={(e) => handleFilterChange('condition', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">All Conditions</option>
            <option value="new">New</option>
            <option value="like-new">Like New</option>
            <option value="good">Good</option>
            <option value="used">Used</option>
            <option value="slightly-damaged">Slightly Damaged</option>
            <option value="heavy-used">Heavy Used</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Type
          </label>
          <select
            value={filters.priceType}
            onChange={(e) => handleFilterChange('priceType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">All Items</option>
            <option value="free">Free Only</option>
            <option value="paid">Paid Only</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">All Locations</option>
            <option value="nearby">Nearby Only</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={clearFilters}
          className="text-sm text-green-600 hover:text-green-700 font-medium"
        >
          Clear All Filters
        </button>
        <div className="text-sm text-gray-500">
          Showing filtered results
        </div>
      </div>
    </div>
  );
};