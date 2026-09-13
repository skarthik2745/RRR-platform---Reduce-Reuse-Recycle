import React, { useState, useEffect } from 'react';
import { Lightbulb, Zap, Droplets, Recycle, Leaf, Heart, RefreshCw, Bot, Send } from 'lucide-react';

interface EcoTip {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  color: string;
}

const AIEcoTips: React.FC = () => {
  const [aiTips, setAiTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [userQuery, setUserQuery] = useState('');

  const generateAITips = async (query: string = '') => {
    setLoading(true);
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: 'You are an expert sustainability advisor. Provide practical, actionable eco-friendly tips that people can easily implement in their daily lives. Focus on specific, measurable actions with clear environmental benefits.'
            },
            {
              role: 'user',
              content: query ? 
                `Provide 6 specific eco-friendly tips related to: ${query}. Make each tip actionable and include the environmental benefit.` :
                'Provide 6 diverse, practical eco-friendly tips for daily sustainable living. Cover different areas like energy, water, waste, transport, and lifestyle. Make each tip specific and actionable.'
            }
          ],
          temperature: 0.7,
          max_tokens: 400
        })
      });
      
      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || '';
      
      // Parse AI response into individual tips
      const tips = aiResponse.split('\n').filter(line => 
        line.trim() && (line.match(/^\d+\./) || line.includes('•') || line.includes('-'))
      ).slice(0, 6);
      
      setAiTips(tips.length > 0 ? tips : [
        'Switch to LED bulbs to reduce energy consumption by 75%',
        'Use a reusable water bottle to prevent 1,460 plastic bottles per year',
        'Take 5-minute showers to save 25 gallons of water daily',
        'Walk or bike for trips under 2 miles to reduce carbon emissions',
        'Compost food scraps to reduce methane emissions from landfills',
        'Unplug electronics when not in use to eliminate phantom energy draw'
      ]);
    } catch (error) {
      console.error('AI Tips Error:', error);
      setAiTips([
        'Switch to renewable energy sources when possible',
        'Reduce single-use plastic consumption',
        'Use public transportation or carpool',
        'Start composting organic waste',
        'Choose locally sourced products',
        'Implement water-saving techniques at home'
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateAITips(userQuery);
  };

  useEffect(() => {
    generateAITips();
  }, []);

  return (
    <div className="space-y-6">
      {/* Query Input */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          placeholder="Ask for specific eco tips (e.g., 'energy saving', 'water conservation')..."
          className="flex-1 px-4 py-3 rounded-lg focus:outline-none transition-all duration-300"
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: '2px solid #FFD700',
            color: '#FFD700',
            backdropFilter: 'blur(10px)'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 flex items-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #059669, #22c55e)',
            color: 'white',
            border: '2px solid #FFD700'
          }}
        >
          {loading ? (
            <div className="animate-spin w-5 h-5 border-2 border-t-transparent rounded-full"></div>
          ) : (
            <><Bot size={18} /> Get AI Tips</>
          )}
        </button>
      </form>

      {/* AI Tips Display */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-lg p-4 animate-pulse" style={{
              background: 'rgba(255, 215, 0, 0.1)',
              border: '1px solid rgba(255, 215, 0, 0.3)'
            }}>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-3/4"></div>
            </div>
          ))
        ) : (
          aiTips.map((tip, index) => (
            <div key={index} className="rounded-lg p-4 transition-all duration-300 hover:scale-105" style={{
              background: 'rgba(255, 215, 0, 0.1)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              boxShadow: '0 0 10px rgba(255, 215, 0, 0.2)'
            }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)'
                }}>
                  <Bot size={16} className="text-white" />
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#E6C55F' }}>
                  {tip.replace(/^\d+\.\s*/, '').replace(/^[•-]\s*/, '')}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={() => generateAITips(userQuery)}
          disabled={loading}
          className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 flex items-center gap-2 mx-auto"
          style={{
            background: 'linear-gradient(135deg, #B8860B, #DAA520)',
            color: 'white',
            border: '2px solid #FFD700'
          }}
        >
          <RefreshCw size={18} />
          {loading ? 'Generating...' : 'Get New AI Tips'}
        </button>
      </div>
    </div>
  );
};

export const EcoTips: React.FC = () => {
  const [dailyTips, setDailyTips] = useState<EcoTip[]>([]);

  const allTips: EcoTip[] = [
    // Energy Conservation
    { id: '1', title: 'Turn off lights when leaving rooms', description: 'Turn off lights when leaving any room — even for 1 minute.', category: 'Energy Conservation', icon: 'zap', color: 'royal-purple' },
    { id: '2', title: 'Use LED bulbs', description: 'Use LED bulbs instead of CFL or incandescent bulbs.', category: 'Energy Conservation', icon: 'zap', color: 'royal-purple' },
    { id: '3', title: 'Keep fan at medium speed', description: 'Keep your fan at medium speed to save 20–30% energy.', category: 'Energy Conservation', icon: 'zap', color: 'royal-purple' },
    { id: '4', title: 'Dry clothes in sunlight', description: 'Dry clothes in sunlight instead of using a dryer.', category: 'Energy Conservation', icon: 'zap', color: 'royal-purple' },
    { id: '5', title: 'Unplug chargers when not in use', description: 'Unplug chargers when not in use; they consume standby power.', category: 'Energy Conservation', icon: 'zap', color: 'royal-purple' },
    { id: '6', title: 'Use natural light during daytime', description: 'Use natural light during daytime for studying/working.', category: 'Energy Conservation', icon: 'zap', color: 'royal-purple' },
    { id: '7', title: 'Set AC temperature to 24–26°C', description: 'Set AC temperature to 24–26°C for comfort + energy savings.', category: 'Energy Conservation', icon: 'zap', color: 'royal-purple' },
    { id: '8', title: 'Use solar power banks', description: 'Use solar power banks for basic charging.', category: 'Energy Conservation', icon: 'zap', color: 'royal-purple' },
    { id: '9', title: 'Clean fan blades regularly', description: 'Clean fan blades regularly — improves efficiency.', category: 'Energy Conservation', icon: 'zap', color: 'royal-purple' },
    { id: '10', title: 'Seal windows properly', description: 'Ensure windows are sealed properly to reduce AC wastage.', category: 'Energy Conservation', icon: 'zap', color: 'royal-purple' },
    { id: '11', title: 'Use induction cooking', description: 'Prefer induction cooking over electric coil stoves.', category: 'Energy Conservation', icon: 'zap', color: 'royal-purple' },
    { id: '12', title: 'Switch to solar rooftop panels', description: 'Switch to solar rooftop panels if possible.', category: 'Energy Conservation', icon: 'zap', color: 'royal-purple' },
    { id: '13', title: 'Use energy-efficient appliances', description: 'Use energy-efficient appliances (5-star rating).', category: 'Energy Conservation', icon: 'zap', color: 'royal-purple' },
    { id: '14', title: 'Reduce screen brightness', description: 'Reduce screen brightness to save power.', category: 'Energy Conservation', icon: 'zap', color: 'royal-purple' },
    { id: '15', title: 'Turn off Wi-Fi router at night', description: 'Turn off Wi-Fi router at night to save energy.', category: 'Energy Conservation', icon: 'zap', color: 'royal-purple' },
    { id: '16', title: 'Take stairs instead of elevators', description: 'Avoid using elevators for 1–2 floors; take the stairs.', category: 'Energy Conservation', icon: 'zap', color: 'royal-purple' },
    { id: '17', title: 'Iron clothes in bulk', description: 'Iron clothes in bulk instead of daily.', category: 'Energy Conservation', icon: 'zap', color: 'royal-purple' },
    { id: '18', title: 'Use power-saving mode', description: 'Use power-saving mode on laptops and phones.', category: 'Energy Conservation', icon: 'zap', color: 'royal-purple' },
    { id: '19', title: 'Use pressure cookers', description: 'Use pressure cookers to reduce cooking time and save gas.', category: 'Energy Conservation', icon: 'zap', color: 'royal-purple' },
    { id: '20', title: 'Plant trees around house', description: 'Plant trees around your house to reduce indoor heat naturally.', category: 'Energy Conservation', icon: 'zap', color: 'royal-purple' },

    // Water Conservation
    { id: '21', title: 'Take 5-minute showers', description: 'Take 5-minute showers to drastically reduce water use.', category: 'Water Conservation', icon: 'droplets', color: 'royal-blue' },
    { id: '22', title: 'Close tap while brushing', description: 'Close the tap while brushing teeth.', category: 'Water Conservation', icon: 'droplets', color: 'royal-blue' },
    { id: '23', title: 'Fix leaking pipes immediately', description: 'Fix leaking pipes immediately — saves litres daily.', category: 'Water Conservation', icon: 'droplets', color: 'royal-blue' },
    { id: '24', title: 'Collect rainwater', description: 'Collect rainwater for watering plants.', category: 'Water Conservation', icon: 'droplets', color: 'royal-blue' },
    { id: '25', title: 'Reuse RO-waste water', description: 'Reuse RO-waste water for mopping and gardening.', category: 'Water Conservation', icon: 'droplets', color: 'royal-blue' },
    { id: '26', title: 'Wash vehicles with bucket', description: 'Wash vehicles using a bucket instead of a hose.', category: 'Water Conservation', icon: 'droplets', color: 'royal-blue' },
    { id: '27', title: 'Choose native plants', description: 'Choose native plants that require less water.', category: 'Water Conservation', icon: 'droplets', color: 'royal-blue' },
    { id: '28', title: 'Install tap aerators', description: 'Install tap aerators to reduce water flow.', category: 'Water Conservation', icon: 'droplets', color: 'royal-blue' },
    { id: '29', title: 'Use mug for bathing', description: 'Use a mug for bathing instead of a shower whenever possible.', category: 'Water Conservation', icon: 'droplets', color: 'royal-blue' },
    { id: '30', title: 'Reuse leftover drinking water', description: 'Reuse leftover drinking water for plants.', category: 'Water Conservation', icon: 'droplets', color: 'royal-blue' },
    { id: '31', title: 'Do laundry with full load', description: 'Do laundry only when you have a full load.', category: 'Water Conservation', icon: 'droplets', color: 'royal-blue' },
    { id: '32', title: 'Store cold water in bottles', description: 'Store cold water in bottles instead of letting tap run.', category: 'Water Conservation', icon: 'droplets', color: 'royal-blue' },
    { id: '33', title: 'Check soil moisture', description: 'Avoid overwatering plants; check soil moisture.', category: 'Water Conservation', icon: 'droplets', color: 'royal-blue' },
    { id: '34', title: 'Clean fruits in bowl', description: 'Clean fruits/vegetables in a bowl, not running tap.', category: 'Water Conservation', icon: 'droplets', color: 'royal-blue' },
    { id: '35', title: 'Water plants early morning', description: 'Water plants early morning or evening to avoid evaporation.', category: 'Water Conservation', icon: 'droplets', color: 'royal-blue' },
    { id: '36', title: 'Harvest rainwater on terrace', description: 'Harvest rainwater on terrace or balconies.', category: 'Water Conservation', icon: 'droplets', color: 'royal-blue' },
    { id: '37', title: 'Reuse cooled cooking water', description: 'Don\'t drain cooled cooking water — use for soups or watering.', category: 'Water Conservation', icon: 'droplets', color: 'royal-blue' },
    { id: '38', title: 'Install dual-flush toilets', description: 'Install dual-flush toilets to control water usage.', category: 'Water Conservation', icon: 'droplets', color: 'royal-blue' },
    { id: '39', title: 'Educate family on water saving', description: 'Educate family members on water saving habits.', category: 'Water Conservation', icon: 'droplets', color: 'royal-blue' },
    { id: '40', title: 'Use greywater recycling', description: 'Use greywater recycling systems if possible.', category: 'Water Conservation', icon: 'droplets', color: 'royal-blue' },

    // Waste Management
    { id: '41', title: 'Segregate waste properly', description: 'Segregate waste into dry, wet, and hazardous categories.', category: 'Waste Management', icon: 'recycle', color: 'emerald' },
    { id: '42', title: 'Compost kitchen waste', description: 'Compost kitchen waste to create natural fertilizer.', category: 'Waste Management', icon: 'recycle', color: 'emerald' },
    { id: '43', title: 'Carry cloth bag shopping', description: 'Carry a cloth bag while shopping — avoid plastic.', category: 'Waste Management', icon: 'recycle', color: 'emerald' },
    { id: '44', title: 'Avoid single-use plastic cutlery', description: 'Avoid single-use plastic cutlery.', category: 'Waste Management', icon: 'recycle', color: 'emerald' },
    { id: '45', title: 'Reuse glass jars', description: 'Reuse glass jars for storage instead of buying containers.', category: 'Waste Management', icon: 'recycle', color: 'emerald' },
    { id: '46', title: 'Donate old clothes', description: 'Donate old clothes instead of throwing them.', category: 'Waste Management', icon: 'recycle', color: 'emerald' },
    { id: '47', title: 'Repair broken items', description: 'Repair broken items instead of buying new ones.', category: 'Waste Management', icon: 'recycle', color: 'emerald' },
    { id: '48', title: 'Buy groceries in bulk', description: 'Buy groceries in bulk to reduce packaging waste.', category: 'Waste Management', icon: 'recycle', color: 'emerald' },
    { id: '49', title: 'Use metal bottles', description: 'Use metal bottles instead of plastic bottles.', category: 'Waste Management', icon: 'recycle', color: 'emerald' },
    { id: '50', title: 'Plan meals to reduce waste', description: 'Reduce food waste by planning meals.', category: 'Waste Management', icon: 'recycle', color: 'emerald' },
    { id: '51', title: 'Use beeswax wraps', description: 'Replace cling film with reusable beeswax wraps.', category: 'Waste Management', icon: 'recycle', color: 'emerald' },
    { id: '52', title: 'Avoid fast-fashion', description: 'Avoid fast-fashion; buy long-lasting clothes.', category: 'Waste Management', icon: 'recycle', color: 'emerald' },
    { id: '53', title: 'Use rechargeable batteries', description: 'Use rechargeable batteries.', category: 'Waste Management', icon: 'recycle', color: 'emerald' },
    { id: '54', title: 'Upcycle old furniture', description: 'Upcycle old furniture instead of discarding.', category: 'Waste Management', icon: 'recycle', color: 'emerald' },
    { id: '55', title: 'Use newspaper as bin liners', description: 'Use newspaper as bin liners instead of plastic bags.', category: 'Waste Management', icon: 'recycle', color: 'emerald' },
    { id: '56', title: 'Recycle e-waste properly', description: 'Recycle e-waste only through authorized centers.', category: 'Waste Management', icon: 'recycle', color: 'emerald' },
    { id: '57', title: 'Carry containers for parcels', description: 'Carry your own containers for hotel parcel orders.', category: 'Waste Management', icon: 'recycle', color: 'emerald' },
    { id: '58', title: 'Share unused items', description: 'Share unused items with neighbors or communities.', category: 'Waste Management', icon: 'recycle', color: 'emerald' },
    { id: '59', title: 'Use cloth napkins', description: 'Use cloth napkins instead of tissue papers.', category: 'Waste Management', icon: 'recycle', color: 'emerald' },
    { id: '60', title: 'Reject excessive packaging', description: 'Reject products with excessive packaging.', category: 'Waste Management', icon: 'recycle', color: 'emerald' },

    // Sustainable Living
    { id: '61', title: 'Grow herbs and vegetables', description: 'Grow your own herbs and vegetables in small pots.', category: 'Sustainable Living', icon: 'leaf', color: 'royal-green' },
    { id: '62', title: 'Use public transport', description: 'Use public transport instead of private vehicles.', category: 'Sustainable Living', icon: 'leaf', color: 'royal-green' },
    { id: '63', title: 'Walk or cycle short distances', description: 'Walk or cycle for short distances.', category: 'Sustainable Living', icon: 'leaf', color: 'royal-green' },
    { id: '64', title: 'Reduce food ordering', description: 'Avoid ordering expensive food often — saves money & emissions.', category: 'Sustainable Living', icon: 'leaf', color: 'royal-green' },
    { id: '65', title: 'Support local farmers', description: 'Support local farmers and local products.', category: 'Sustainable Living', icon: 'leaf', color: 'royal-green' },
    { id: '66', title: 'Use eco-friendly cleaners', description: 'Choose eco-friendly cleaning products.', category: 'Sustainable Living', icon: 'leaf', color: 'royal-green' },
    { id: '67', title: 'Reduce meat consumption', description: 'Reduce meat consumption to lower carbon footprint.', category: 'Sustainable Living', icon: 'leaf', color: 'royal-green' },
    { id: '68', title: 'Use natural air fresheners', description: 'Use natural air fresheners like neem leaves, lemongrass oil.', category: 'Sustainable Living', icon: 'leaf', color: 'royal-green' },
    { id: '69', title: 'Cook only needed amount', description: 'Cook only what is needed — minimize food waste.', category: 'Sustainable Living', icon: 'leaf', color: 'royal-green' },
    { id: '70', title: 'Avoid fireworks', description: 'Avoid using fireworks — they cause pollution.', category: 'Sustainable Living', icon: 'leaf', color: 'royal-green' },
    { id: '71', title: 'Use bamboo toothbrushes', description: 'Choose bamboo toothbrushes over plastic ones.', category: 'Sustainable Living', icon: 'leaf', color: 'royal-green' },
    { id: '72', title: 'Use organic pesticides', description: 'Avoid chemical pesticides; use organic alternatives.', category: 'Sustainable Living', icon: 'leaf', color: 'royal-green' },
    { id: '73', title: 'Practice minimalism', description: 'Practice minimalism — buy only what you need.', category: 'Sustainable Living', icon: 'leaf', color: 'royal-green' },
    { id: '74', title: 'Gift plants', description: 'Gift plants instead of plastic items.', category: 'Sustainable Living', icon: 'leaf', color: 'royal-green' },
    { id: '75', title: 'Use plant-based detergents', description: 'Shift to plant-based detergents.', category: 'Sustainable Living', icon: 'leaf', color: 'royal-green' },
    { id: '76', title: 'Use reusable menstrual products', description: 'Use reusable menstrual cups or cloth pads.', category: 'Sustainable Living', icon: 'leaf', color: 'royal-green' },
    { id: '77', title: 'Line-dry clothes', description: 'Line-dry clothes instead of using dryers.', category: 'Sustainable Living', icon: 'leaf', color: 'royal-green' },
    { id: '78', title: 'Use broom for cleaning', description: 'Use a broom instead of a vacuum cleaner for simple cleaning.', category: 'Sustainable Living', icon: 'leaf', color: 'royal-green' },
    { id: '79', title: 'Avoid palm oil products', description: 'Avoid palm oil products — linked to deforestation.', category: 'Sustainable Living', icon: 'leaf', color: 'royal-green' },
    { id: '80', title: 'Reduce fast-food consumption', description: 'Reduce fast-food consumption due to plastic and waste.', category: 'Sustainable Living', icon: 'leaf', color: 'royal-green' },

    // Tree & Biodiversity Protection
    { id: '81', title: 'Plant one tree yearly', description: 'Plant at least one tree every year.', category: 'Tree & Biodiversity', icon: 'heart', color: 'gold' },
    { id: '82', title: 'Protect existing trees', description: 'Protect existing trees — avoid unnecessary cutting.', category: 'Tree & Biodiversity', icon: 'heart', color: 'gold' },
    { id: '83', title: 'Grow native plants', description: 'Grow native plant species for better survival.', category: 'Tree & Biodiversity', icon: 'heart', color: 'gold' },
    { id: '84', title: 'Create bird feeders', description: 'Create small bird feeders in your balcony.', category: 'Tree & Biodiversity', icon: 'heart', color: 'gold' },
    { id: '85', title: 'Keep water for birds', description: 'Keep a bowl of water outside for birds.', category: 'Tree & Biodiversity', icon: 'heart', color: 'gold' },
    { id: '86', title: 'Compost leaves', description: 'Avoid burning leaves; compost them.', category: 'Tree & Biodiversity', icon: 'heart', color: 'gold' },
    { id: '87', title: 'Don\'t pluck flowers unnecessarily', description: 'Do not pluck flowers unnecessarily.', category: 'Tree & Biodiversity', icon: 'heart', color: 'gold' },
    { id: '88', title: 'Support wildlife conservation', description: 'Support wildlife conservation organizations.', category: 'Tree & Biodiversity', icon: 'heart', color: 'gold' },
    { id: '89', title: 'Avoid loud sounds near nature', description: 'Avoid using loudspeakers near forests or nesting areas.', category: 'Tree & Biodiversity', icon: 'heart', color: 'gold' },
    { id: '90', title: 'Don\'t disturb wildlife homes', description: 'Do not disturb ant hills, nests, or bee hives.', category: 'Tree & Biodiversity', icon: 'heart', color: 'gold' },
    { id: '91', title: 'Avoid fireworks near green areas', description: 'Avoid fireworks near green areas.', category: 'Tree & Biodiversity', icon: 'heart', color: 'gold' },
    { id: '92', title: 'Educate children about biodiversity', description: 'Educate children about biodiversity.', category: 'Tree & Biodiversity', icon: 'heart', color: 'gold' },
    { id: '93', title: 'Stop illegal tree cutting', description: 'Stop others from cutting trees unlawfully.', category: 'Tree & Biodiversity', icon: 'heart', color: 'gold' },
    { id: '94', title: 'Build butterfly gardens', description: 'Build butterfly gardens with nectar plants.', category: 'Tree & Biodiversity', icon: 'heart', color: 'gold' },
    { id: '95', title: 'Don\'t kill harmless insects', description: 'Avoid killing insects that do no harm.', category: 'Tree & Biodiversity', icon: 'heart', color: 'gold' },
    { id: '96', title: 'Help stray animals', description: 'Protect stray animals by giving water/food.', category: 'Tree & Biodiversity', icon: 'heart', color: 'gold' },
    { id: '97', title: 'Join tree plantation drives', description: 'Participate in local tree plantation drives.', category: 'Tree & Biodiversity', icon: 'heart', color: 'gold' },
    { id: '98', title: 'Use organic fertilizers', description: 'Use organic fertilizers to protect soil microbes.', category: 'Tree & Biodiversity', icon: 'heart', color: 'gold' },
    { id: '99', title: 'Prevent soil erosion', description: 'Prevent soil erosion by planting ground cover plants.', category: 'Tree & Biodiversity', icon: 'heart', color: 'gold' },
    { id: '100', title: 'Support eco-tourism', description: 'Support eco-tourism, not destructive tourism.', category: 'Tree & Biodiversity', icon: 'heart', color: 'gold' },

    // Transportation & Travel
    { id: '101', title: 'Prefer trains over flights', description: 'Prefer trains over flights for shorter journeys.', category: 'Transportation', icon: 'zap', color: 'crimson' },
    { id: '102', title: 'Share rides with friends', description: 'Share rides with friends to reduce fuel usage.', category: 'Transportation', icon: 'zap', color: 'crimson' },
    { id: '103', title: 'Maintain proper tyre pressure', description: 'Maintain proper air pressure in vehicle tyres.', category: 'Transportation', icon: 'zap', color: 'crimson' },
    { id: '104', title: 'Turn off engine at signals', description: 'Turn off engine during long signals.', category: 'Transportation', icon: 'zap', color: 'crimson' },
    { id: '105', title: 'Avoid unnecessary acceleration', description: 'Avoid unnecessary acceleration to save fuel.', category: 'Transportation', icon: 'zap', color: 'crimson' },
    { id: '106', title: 'Service vehicle regularly', description: 'Service your vehicle regularly for efficiency.', category: 'Transportation', icon: 'zap', color: 'crimson' },
    { id: '107', title: 'Use electric vehicles', description: 'Use electric vehicles or cycles when possible.', category: 'Transportation', icon: 'zap', color: 'crimson' },
    { id: '108', title: 'Choose online meetings', description: 'Choose online meetings instead of unnecessary travel.', category: 'Transportation', icon: 'zap', color: 'crimson' },
    { id: '109', title: 'Follow eco-driving techniques', description: 'Follow eco-driving techniques.', category: 'Transportation', icon: 'zap', color: 'crimson' },
    { id: '110', title: 'Plan multiple tasks in one trip', description: 'Plan multiple tasks in one trip to avoid extra travel.', category: 'Transportation', icon: 'zap', color: 'crimson' },
    { id: '111', title: 'Avoid carrying heavy items', description: 'Avoid carrying heavy items in car — increases fuel usage.', category: 'Transportation', icon: 'zap', color: 'crimson' },
    { id: '112', title: 'Walk inside campus', description: 'Walk inside campus instead of taking autos.', category: 'Transportation', icon: 'zap', color: 'crimson' },
    { id: '113', title: 'Use city buses', description: 'Prefer city buses for local travel.', category: 'Transportation', icon: 'zap', color: 'crimson' },
    { id: '114', title: 'Avoid unnecessary honking', description: 'Avoid honking unnecessarily — noise pollution matters.', category: 'Transportation', icon: 'zap', color: 'crimson' },
    { id: '115', title: 'Travel light', description: 'Travel light to reduce vehicle load.', category: 'Transportation', icon: 'zap', color: 'crimson' },

    // Home & Lifestyle
    { id: '116', title: 'Keep windows open', description: 'Keep windows open for natural ventilation.', category: 'Home & Lifestyle', icon: 'droplets', color: 'indigo' },
    { id: '117', title: 'Use curtains to reduce heat', description: 'Use curtains to reduce heat inside the house.', category: 'Home & Lifestyle', icon: 'droplets', color: 'indigo' },
    { id: '118', title: 'Buy recycled wood furniture', description: 'Buy furniture made from recycled wood.', category: 'Home & Lifestyle', icon: 'droplets', color: 'indigo' },
    { id: '119', title: 'Choose energy-efficient fans', description: 'Choose energy-efficient ceiling fans.', category: 'Home & Lifestyle', icon: 'droplets', color: 'indigo' },
    { id: '120', title: 'Maintain indoor plants', description: 'Maintain indoor plants for better air quality.', category: 'Home & Lifestyle', icon: 'droplets', color: 'indigo' },
    { id: '121', title: 'Don\'t throw oil in sink', description: 'Avoid throwing cooking oil into the sink.', category: 'Home & Lifestyle', icon: 'droplets', color: 'indigo' },
    { id: '122', title: 'Use coconut shell scrubber', description: 'Use coconut shell scrap as natural scrubbing tool.', category: 'Home & Lifestyle', icon: 'droplets', color: 'indigo' },
    { id: '123', title: 'Clean with natural solutions', description: 'Clean home with eco-friendly vinegar/baking soda solutions.', category: 'Home & Lifestyle', icon: 'droplets', color: 'indigo' },
    { id: '124', title: 'Insulate your roof', description: 'Insulate your roof to reduce heat.', category: 'Home & Lifestyle', icon: 'droplets', color: 'indigo' },
    { id: '125', title: 'Use solar garden lights', description: 'Use solar garden lights.', category: 'Home & Lifestyle', icon: 'droplets', color: 'indigo' },
    { id: '126', title: 'Buy used items', description: 'Buy used items (thrift stores) instead of new.', category: 'Home & Lifestyle', icon: 'droplets', color: 'indigo' },
    { id: '127', title: 'Use low-flow shower heads', description: 'Switch to low-flow shower heads.', category: 'Home & Lifestyle', icon: 'droplets', color: 'indigo' },
    { id: '128', title: 'Avoid water stagnation', description: 'Avoid forming water stagnation — prevents mosquitoes.', category: 'Home & Lifestyle', icon: 'droplets', color: 'indigo' },
    { id: '129', title: 'Use handmade products', description: 'Use handmade products from artisans.', category: 'Home & Lifestyle', icon: 'droplets', color: 'indigo' },
    { id: '130', title: 'Don\'t run AC with open windows', description: 'Avoid running AC with windows open.', category: 'Home & Lifestyle', icon: 'droplets', color: 'indigo' },

    // Food & Agriculture
    { id: '131', title: 'Buy seasonal produce', description: 'Buy seasonal fruits and vegetables.', category: 'Food & Agriculture', icon: 'recycle', color: 'orange' },
    { id: '132', title: 'Support organic farming', description: 'Support organic farming.', category: 'Food & Agriculture', icon: 'recycle', color: 'orange' },
    { id: '133', title: 'Eat more plant-based foods', description: 'Consume more plant-based foods.', category: 'Food & Agriculture', icon: 'recycle', color: 'orange' },
    { id: '134', title: 'Donate extra food', description: 'Avoid wasting cooked food — donate extra.', category: 'Food & Agriculture', icon: 'recycle', color: 'orange' },
    { id: '135', title: 'Start terrace gardening', description: 'Start terrace or balcony gardening.', category: 'Food & Agriculture', icon: 'recycle', color: 'orange' },
    { id: '136', title: 'Store foods properly', description: 'Store foods properly to avoid spoiling.', category: 'Food & Agriculture', icon: 'recycle', color: 'orange' },
    { id: '137', title: 'Reduce chemical fertilizers', description: 'Reduce use of chemical fertilizers.', category: 'Food & Agriculture', icon: 'recycle', color: 'orange' },
    { id: '138', title: 'Use compost in garden', description: 'Use compost in your garden.', category: 'Food & Agriculture', icon: 'recycle', color: 'orange' },
    { id: '139', title: 'Reduce sugary drinks', description: 'Reduce sugary drinks — environmental footprint is high.', category: 'Food & Agriculture', icon: 'recycle', color: 'orange' },
    { id: '140', title: 'Choose local foods', description: 'Choose locally grown foods instead of imported ones.', category: 'Food & Agriculture', icon: 'recycle', color: 'orange' },
    { id: '141', title: 'Make homemade snacks', description: 'Prepare homemade snacks rather than packaged ones.', category: 'Food & Agriculture', icon: 'recycle', color: 'orange' },
    { id: '142', title: 'Reduce rice wastage', description: 'Reduce rice wastage — it has high water footprint.', category: 'Food & Agriculture', icon: 'recycle', color: 'orange' },
    { id: '143', title: 'Avoid deep-freezing unnecessarily', description: 'Avoid deep-freezing foods unnecessarily.', category: 'Food & Agriculture', icon: 'recycle', color: 'orange' },
    { id: '144', title: 'Grow microgreens', description: 'Grow microgreens — they are nutritious and eco-friendly.', category: 'Food & Agriculture', icon: 'recycle', color: 'orange' },
    { id: '145', title: 'Try Meatless Mondays', description: 'Try "Meatless Mondays" to reduce emissions.', category: 'Food & Agriculture', icon: 'recycle', color: 'orange' },

    // Climate Action & Community
    { id: '146', title: 'Educate others on sustainability', description: 'Educate others on sustainability.', category: 'Climate Action', icon: 'leaf', color: 'teal' },
    { id: '147', title: 'Join climate action groups', description: 'Join climate action groups.', category: 'Climate Action', icon: 'leaf', color: 'teal' },
    { id: '148', title: 'Participate in clean-up drives', description: 'Participate in beach/park clean-up drives.', category: 'Climate Action', icon: 'leaf', color: 'teal' },
    { id: '149', title: 'Support renewable energy', description: 'Support renewable energy initiatives.', category: 'Climate Action', icon: 'leaf', color: 'teal' },
    { id: '150', title: 'Promote plastic-free events', description: 'Promote plastic-free events.', category: 'Climate Action', icon: 'leaf', color: 'teal' },
    { id: '151', title: 'Speak up against littering', description: 'Speak up against littering.', category: 'Climate Action', icon: 'leaf', color: 'teal' },
    { id: '152', title: 'Help schools introduce eco-clubs', description: 'Help schools introduce eco-clubs.', category: 'Climate Action', icon: 'leaf', color: 'teal' },
    { id: '153', title: 'Support nature protection NGOs', description: 'Support NGOs working on nature protection.', category: 'Climate Action', icon: 'leaf', color: 'teal' },
    { id: '154', title: 'Conduct awareness campaigns', description: 'Conduct awareness campaigns in your community.', category: 'Climate Action', icon: 'leaf', color: 'teal' },
    { id: '155', title: 'Encourage reusable items', description: 'Encourage friends to use reusable items.', category: 'Climate Action', icon: 'leaf', color: 'teal' },
    { id: '156', title: 'Volunteer for tree plantation', description: 'Volunteer for tree plantation events.', category: 'Climate Action', icon: 'leaf', color: 'teal' },
    { id: '157', title: 'Celebrate eco-friendly festivals', description: 'Celebrate eco-friendly festivals.', category: 'Climate Action', icon: 'leaf', color: 'teal' },
    { id: '158', title: 'Reduce digital carbon footprint', description: 'Reduce digital carbon footprint by deleting unnecessary files/emails.', category: 'Climate Action', icon: 'leaf', color: 'teal' },
    { id: '159', title: 'Promote sustainable fashion', description: 'Promote sustainable fashion.', category: 'Climate Action', icon: 'leaf', color: 'teal' },
    { id: '160', title: 'Build rainwater harvesting', description: 'Build rainwater harvesting pits in communities.', category: 'Climate Action', icon: 'leaf', color: 'teal' },

    // Digital & Tech Sustainability
    { id: '161', title: 'Reduce cloud storage usage', description: 'Reduce unnecessary cloud storage usage.', category: 'Digital Sustainability', icon: 'heart', color: 'violet' },
    { id: '162', title: 'Unsubscribe from emails', description: 'Unsubscribe from unwanted emails.', category: 'Digital Sustainability', icon: 'heart', color: 'violet' },
    { id: '163', title: 'Turn off auto-play', description: 'Turn off auto-play in streaming apps to save energy.', category: 'Digital Sustainability', icon: 'heart', color: 'violet' },
    { id: '164', title: 'Dispose e-waste responsibly', description: 'Dispose e-waste responsibly.', category: 'Digital Sustainability', icon: 'heart', color: 'violet' },
    { id: '165', title: 'Buy refurbished gadgets', description: 'Buy refurbished gadgets instead of new ones.', category: 'Digital Sustainability', icon: 'heart', color: 'violet' },
    { id: '166', title: 'Use dark mode', description: 'Use dark mode on phones/laptops to reduce battery usage.', category: 'Digital Sustainability', icon: 'heart', color: 'violet' },
    { id: '167', title: 'Reduce high-resolution streaming', description: 'Reduce high-resolution streaming if not needed.', category: 'Digital Sustainability', icon: 'heart', color: 'violet' },
    { id: '168', title: 'Repair old gadgets', description: 'Repair old gadgets instead of replacing.', category: 'Digital Sustainability', icon: 'heart', color: 'violet' },
    { id: '169', title: 'Use solar chargers outdoors', description: 'Use solar chargers when outdoors.', category: 'Digital Sustainability', icon: 'heart', color: 'violet' },
    { id: '170', title: 'Keep devices updated', description: 'Keep devices updated for better efficiency.', category: 'Digital Sustainability', icon: 'heart', color: 'violet' },

    // Oceans & Water Bodies Protection
    { id: '171', title: 'Never throw plastic near water', description: 'Never throw plastic near water bodies.', category: 'Ocean Protection', icon: 'droplets', color: 'navy' },
    { id: '172', title: 'Join lake cleanups', description: 'Participate in local lake cleanups.', category: 'Ocean Protection', icon: 'droplets', color: 'navy' },
    { id: '173', title: 'Avoid chemicals when swimming', description: 'Avoid chemical shampoos/soaps when swimming in natural water.', category: 'Ocean Protection', icon: 'droplets', color: 'navy' },
    { id: '174', title: 'Support coral reef conservation', description: 'Support coral reef conservation programs.', category: 'Ocean Protection', icon: 'droplets', color: 'navy' },
    { id: '175', title: 'Reduce fishing endangered species', description: 'Reduce fishing of endangered species.', category: 'Ocean Protection', icon: 'droplets', color: 'navy' },
    { id: '176', title: 'Avoid microbead cosmetics', description: 'Avoid microbead cosmetics — harmful to marine life.', category: 'Ocean Protection', icon: 'droplets', color: 'navy' },
    { id: '177', title: 'Reduce laundry frequency', description: 'Reduce laundry frequency to reduce water pollution.', category: 'Ocean Protection', icon: 'droplets', color: 'navy' },
    { id: '178', title: 'Support mangrove restoration', description: 'Support mangrove restoration.', category: 'Ocean Protection', icon: 'droplets', color: 'navy' },
    { id: '179', title: 'Don\'t release balloons', description: 'Don\'t release balloons — they end up in oceans.', category: 'Ocean Protection', icon: 'droplets', color: 'navy' },
    { id: '180', title: 'Reduce oil spills', description: 'Reduce oil spills by using less cooking oil.', category: 'Ocean Protection', icon: 'droplets', color: 'navy' },

    // Forests & Natural Resources
    { id: '181', title: 'Avoid rare wood products', description: 'Avoid buying products made from rare wood.', category: 'Forest Protection', icon: 'zap', color: 'forest-green' },
    { id: '182', title: 'Clean campfire waste', description: 'Avoid leaving campfire waste in forests.', category: 'Forest Protection', icon: 'zap', color: 'forest-green' },
    { id: '183', title: 'Support sustainable tourism', description: 'Support sustainable tourism only.', category: 'Forest Protection', icon: 'zap', color: 'forest-green' },
    { id: '184', title: 'Avoid wet wipes', description: 'Avoid using wet wipes — contain plastic.', category: 'Forest Protection', icon: 'zap', color: 'forest-green' },
    { id: '185', title: 'Use cloth bags for produce', description: 'Use cloth bags for fruits and veggies too.', category: 'Forest Protection', icon: 'zap', color: 'forest-green' },
    { id: '186', title: 'Reduce paper napkin usage', description: 'Reduce paper napkin usage in restaurants.', category: 'Forest Protection', icon: 'zap', color: 'forest-green' },
    { id: '187', title: 'Use digital receipts', description: 'Shift to digital receipts instead of printed ones.', category: 'Forest Protection', icon: 'zap', color: 'forest-green' },
    { id: '188', title: 'Don\'t carve tree trunks', description: 'Do not carve names on tree trunks.', category: 'Forest Protection', icon: 'zap', color: 'forest-green' },
    { id: '189', title: 'Avoid leather products', description: 'Avoid buying leather products.', category: 'Forest Protection', icon: 'zap', color: 'forest-green' },
    { id: '190', title: 'Support forest conservation', description: 'Support forest conservation laws.', category: 'Forest Protection', icon: 'zap', color: 'forest-green' },

    // Habits & Personal Lifestyle
    { id: '191', title: 'Practice zero waste challenges', description: 'Practice "zero waste" challenges.', category: 'Personal Habits', icon: 'recycle', color: 'magenta' },
    { id: '192', title: 'Carry refill water bottle', description: 'Carry a refill water bottle everywhere.', category: 'Personal Habits', icon: 'recycle', color: 'magenta' },
    { id: '193', title: 'Say no to straws', description: 'Say "no" to straws unless reusable.', category: 'Personal Habits', icon: 'recycle', color: 'magenta' },
    { id: '194', title: 'Take nature breaks', description: 'Take short breaks in nature — improves mental health.', category: 'Personal Habits', icon: 'recycle', color: 'magenta' },
    { id: '195', title: 'Follow 5 R principle', description: 'Follow "Refuse, Reduce, Reuse, Recycle, Rot" principle.', category: 'Personal Habits', icon: 'recycle', color: 'magenta' },
    { id: '196', title: 'Use eco-friendly personal care', description: 'Use eco-friendly deodorants and soaps.', category: 'Personal Habits', icon: 'recycle', color: 'magenta' },
    { id: '197', title: 'Do Earth Hour weekly', description: 'Do "Earth Hour" every week — switch off lights for 10 min.', category: 'Personal Habits', icon: 'recycle', color: 'magenta' },
    { id: '198', title: 'Encourage with positive words', description: 'Encourage others with eco-positive words.', category: 'Personal Habits', icon: 'recycle', color: 'magenta' },
    { id: '199', title: 'Track carbon footprint', description: 'Learn about carbon footprint & track your score.', category: 'Personal Habits', icon: 'recycle', color: 'magenta' },
    { id: '200', title: 'Inspire kids with eco-habits', description: 'Inspire kids with simple eco-responsibilities.', category: 'Personal Habits', icon: 'recycle', color: 'magenta' }
  ];

  const getRandomTips = () => {
    const shuffled = [...allTips].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 12);
  };

  useEffect(() => {
    setDailyTips(getRandomTips());
  }, []);

  const refreshTips = () => {
    setDailyTips(getRandomTips());
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'zap': return <Zap size={24} />;
      case 'droplets': return <Droplets size={24} />;
      case 'recycle': return <Recycle size={24} />;
      case 'leaf': return <Leaf size={24} />;
      case 'heart': return <Heart size={24} />;
      default: return <Lightbulb size={24} />;
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'royal-purple': return 'from-purple-600 to-indigo-700 text-white';
      case 'royal-blue': return 'from-blue-600 to-cyan-700 text-white';
      case 'emerald': return 'from-emerald-500 to-green-600 text-white';
      case 'royal-green': return 'from-green-600 to-teal-700 text-white';
      case 'gold': return 'from-yellow-500 to-orange-600 text-white';
      case 'crimson': return 'from-red-600 to-pink-700 text-white';
      case 'indigo': return 'from-indigo-600 to-purple-700 text-white';
      case 'orange': return 'from-orange-500 to-red-600 text-white';
      case 'teal': return 'from-teal-600 to-cyan-700 text-white';
      case 'violet': return 'from-violet-600 to-purple-700 text-white';
      case 'navy': return 'from-blue-800 to-indigo-900 text-white';
      case 'forest-green': return 'from-green-700 to-emerald-800 text-white';
      case 'magenta': return 'from-pink-600 to-rose-700 text-white';
      default: return 'from-gray-600 to-gray-700 text-white';
    }
  };

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold mb-2" style={{
          color: '#FFD700',
          fontFamily: 'Poppins, Montserrat, Playfair Display',
          textShadow: '0 0 25px rgba(255, 215, 0, 0.5)'
        }}>Daily Eco Tips</h2>
        <p className="text-xl" style={{
          color: '#E6C55F',
          textShadow: '0 0 10px rgba(230, 197, 95, 0.3)'
        }}>Discover new ways to live sustainably every day</p>
      </div>
      <div className="flex justify-end mb-6">
        <button
          onClick={refreshTips}
          className="text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center font-semibold hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #B8860B, #DAA520)',
            border: '2px solid #FFD700',
            boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
          }}
        >
          <RefreshCw className="mr-2" size={20} />
          Refresh Tips
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dailyTips.map((tip, index) => (
          <div
            key={tip.id}
            className={`rounded-xl shadow-md hover:shadow-xl transition-all duration-500 transform hover:scale-105 overflow-hidden ${
              index % 3 === 0 ? 'glow-animation' :
              index % 3 === 1 ? 'shimmer-animation' :
              'wiggle-animation'
            }`}
            style={{
              background: 'rgba(45, 80, 22, 0.2)',
              border: '2px solid #FFD700',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(255, 215, 0, 0.2)';
              e.currentTarget.style.transform = 'scale(1.05) rotateY(5deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)';
              e.currentTarget.style.transform = 'scale(1) rotateY(0deg)';
            }}
          >
            <div className={`bg-gradient-to-r ${getColorClasses(tip.color)} p-4 text-center`}>
              <div className="text-white mb-2">
                {getIcon(tip.icon)}
              </div>
              <span className="text-xs font-medium bg-white bg-opacity-20 px-2 py-1 rounded-full text-white">
                {tip.category}
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#FFD700' }}>{tip.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#E6C55F' }}>{tip.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* AI-Powered Eco Tips Section */}
      <div className="mt-12 rounded-xl p-6" style={{
        background: 'rgba(45, 80, 22, 0.3)',
        border: '2px solid #FFD700',
        boxShadow: '0 0 30px rgba(255, 215, 0, 0.4)'
      }}>
        <div className="text-center mb-6">
          <h3 className="text-3xl font-bold mb-2" style={{
            color: '#FFD700',
            textShadow: '0 0 20px rgba(255, 215, 0, 0.5)'
          }}>🤖 AI-Powered Eco Tips</h3>
          <p className="text-lg" style={{ color: '#E6C55F' }}>
            Get personalized sustainability advice from our AI assistant
          </p>
        </div>
        
        <AIEcoTips />
      </div>

      <div className="mt-8 rounded-xl p-6 text-center" style={{
        background: 'rgba(45, 80, 22, 0.3)',
        border: '1px solid rgba(255, 215, 0, 0.3)',
        boxShadow: '0 0 25px rgba(255, 215, 0, 0.4)',
        animation: 'glow 3s ease-in-out infinite alternate'
      }}>
        <style jsx>{`
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
            50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4); }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes wiggle {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(1deg); }
            75% { transform: rotate(-1deg); }
          }
          .glow-animation {
            animation: glow 2s ease-in-out infinite;
          }
          .shimmer-animation {
            position: relative;
            overflow: hidden;
          }
          .shimmer-animation::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            animation: shimmer 3s infinite;
          }
          .wiggle-animation {
            animation: wiggle 2s ease-in-out infinite;
          }
        `}</style>
        <Lightbulb className="mx-auto mb-4" style={{ color: '#FFD700' }} size={48} />
        <h3 className="text-xl font-semibold mb-2" style={{ color: '#FFD700' }}>Tips Refresh Daily!</h3>
        <p style={{ color: '#E6C55F' }}>
          Come back tomorrow for a fresh set of eco-friendly tips, or click refresh to see more tips now.
        </p>
      </div>
    </div>
  );
};