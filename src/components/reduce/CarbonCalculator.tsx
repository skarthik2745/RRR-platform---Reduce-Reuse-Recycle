import React, { useState } from 'react';
import { Calculator, Zap, Droplets, Car, Trash2, Home, Lightbulb, Plane, Utensils } from 'lucide-react';

interface CarbonData {
  electricity: number;
  energySource: string;
  lpgUsage: number;
  fuelType: string;
  fuelUsage: number;
  busDistance: number;
  trainDistance: number;
  waste: number;
  dietType: string;
  shortFlights: number;
  mediumFlights: number;
  longFlights: number;
  acHours: number;
  fridgeHours: number;
  washingHours: number;
}

export const CarbonCalculator: React.FC = () => {
  const [formData, setFormData] = useState<CarbonData>({
    electricity: 0,
    energySource: 'mixed',
    lpgUsage: 0,
    fuelType: 'petrol',
    fuelUsage: 0,
    busDistance: 0,
    trainDistance: 0,
    waste: 0,
    dietType: 'mixed',
    shortFlights: 0,
    mediumFlights: 0,
    longFlights: 0,
    acHours: 0,
    fridgeHours: 24,
    washingHours: 1
  });
  const [result, setResult] = useState<{
    total: number;
    breakdown: CarbonData;
    suggestions: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateCarbon = () => {
    // Electricity emissions based on energy source
    const electricityFactors = { coal: 0.82, mixed: 0.60, renewable: 0.05 };
    const electricityCarbon = formData.electricity * electricityFactors[formData.energySource as keyof typeof electricityFactors] * 12; // kg CO2 per year
    
    // LPG cooking gas
    const lpgCarbon = formData.lpgUsage * 1.51 * 12; // kg CO2 per year
    
    // Fuel consumption
    const fuelFactors = { petrol: 2.31, diesel: 2.68 };
    const fuelCarbon = formData.fuelUsage * fuelFactors[formData.fuelType as keyof typeof fuelFactors] * 12; // kg CO2 per year
    
    // Public transport
    const publicTransportCarbon = (formData.busDistance * 0.089 + formData.trainDistance * 0.041) * 12; // kg CO2 per year
    
    // Waste
    const wasteCarbon = formData.waste * 0.57 * 12; // kg CO2 per year
    
    // Diet
    const dietFactors = { vegetarian: 1700, mixed: 2500, heavy: 3300 };
    const dietCarbon = dietFactors[formData.dietType as keyof typeof dietFactors]; // kg CO2 per year
    
    // Flights
    const flightCarbon = (formData.shortFlights * 150 + formData.mediumFlights * 550 + formData.longFlights * 1600); // kg CO2 per year
    
    // Appliances (additional electricity)
    const applianceCarbon = (formData.acHours * 1.5 + formData.fridgeHours * 0.15 + formData.washingHours * 0.5) * 365 * electricityFactors[formData.energySource as keyof typeof electricityFactors]; // kg CO2 per year

    const breakdown = {
      electricity: electricityCarbon + applianceCarbon,
      lpg: lpgCarbon,
      fuel: fuelCarbon,
      publicTransport: publicTransportCarbon,
      waste: wasteCarbon,
      diet: dietCarbon,
      flights: flightCarbon
    };

    const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0) / 1000; // Convert to tons

    return { total, breakdown };
  };

  const generateAISuggestions = async (carbonData: { total: number; breakdown: any }) => {
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
              content: 'You are an expert carbon footprint analyst. Analyze the user\'s carbon emissions data and provide a detailed, structured analysis with specific, actionable recommendations. Format your response as numbered points for easy reading.'
            },
            {
              role: 'user',
              content: `Please analyze my carbon footprint data and provide detailed recommendations:
              
              CARBON FOOTPRINT ANALYSIS:
              Total Annual Emissions: ${carbonData.total.toFixed(2)} tons CO2
              
              DETAILED BREAKDOWN:
              • Electricity & Appliances: ${(carbonData.breakdown.electricity/1000).toFixed(2)} tons CO2
              • LPG/Cooking Gas: ${(carbonData.breakdown.lpg/1000).toFixed(2)} tons CO2
              • Vehicle Fuel: ${(carbonData.breakdown.fuel/1000).toFixed(2)} tons CO2
              • Public Transport: ${(carbonData.breakdown.publicTransport/1000).toFixed(2)} tons CO2
              • Waste Generation: ${(carbonData.breakdown.waste/1000).toFixed(2)} tons CO2
              • Diet/Food: ${(carbonData.breakdown.diet/1000).toFixed(2)} tons CO2
              • Air Travel: ${(carbonData.breakdown.flights/1000).toFixed(2)} tons CO2
              
              Please provide:
              1. Overall assessment of my carbon footprint
              2. Top 3 highest emission sources analysis
              3. 8 specific, actionable recommendations with estimated CO2 reduction potential
              4. Priority actions I should take first
              
              Make recommendations specific to my actual usage patterns and emission levels.`
            }
          ],
          temperature: 0.7,
          max_tokens: 800
        })
      });
      
      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || '';
      
      // Split AI response into structured sections
      const lines = aiResponse.split('\n').filter(line => line.trim());
      return lines;
      
    } catch (error) {
      console.error('AI Analysis Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const carbonResult = calculateCarbon();
    
    try {
      const suggestions = await generateAISuggestions(carbonResult);
      setResult({
        ...carbonResult,
        suggestions
      });
    } catch (error) {
      setResult({
        ...carbonResult,
        suggestions: ['AI analysis failed. Please try again later.']
      });
    }
  };

  const getEmissionLevel = (total: number) => {
    if (total < 50) return { level: 'Low', color: 'green', message: 'Great job! Your carbon footprint is below average.' };
    if (total < 100) return { level: 'Moderate', color: 'yellow', message: 'Good effort! There\'s room for improvement.' };
    if (total < 200) return { level: 'High', color: 'orange', message: 'Consider making some changes to reduce your impact.' };
    return { level: 'Very High', color: 'red', message: 'Significant changes needed to reduce your carbon footprint.' };
  };

  return (
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, #0F1F14 0%, #152A1A 100%)'
    }}>
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-4" style={{
          color: '#D4AF37',
          fontFamily: 'serif',
          textShadow: '0 0 30px rgba(212, 175, 55, 0.6)'
        }}>Carbon Footprint Calculator</h1>
        <p className="text-xl mb-4" style={{
          color: '#E6C55F',
          textShadow: '0 0 15px rgba(230, 197, 95, 0.4)'
        }}>Calculate your environmental impact and receive personalized reduction tips</p>
        <div className="w-32 h-1 mx-auto" style={{
          background: 'linear-gradient(90deg, #D4AF37, #FFD700)',
          boxShadow: '0 0 20px rgba(212, 175, 55, 0.8)'
        }}></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
        {/* Calculator Form */}
        <div className="rounded-2xl shadow-2xl p-8" style={{
          background: 'rgba(0, 0, 0, 0.7)',
          border: '2px solid #D4AF37',
          boxShadow: '0 0 40px rgba(212, 175, 55, 0.3), inset 0 0 40px rgba(212, 175, 55, 0.1)'
        }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Electricity Usage */}
            <div className="p-6 rounded-xl" style={{
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid #D4AF37'
            }}>
              <div className="flex items-center mb-4">
                <Zap className="mr-3" style={{ color: '#D4AF37' }} size={24} />
                <h3 className="text-xl font-bold" style={{ color: '#D4AF37' }}>Electricity Usage</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2" style={{ color: '#E6C55F' }}>Monthly consumption (kWh)</label>
                  <input
                    type="number"
                    value={formData.electricity}
                    onChange={(e) => setFormData(prev => ({ ...prev, electricity: Number(e.target.value) }))}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none transition-all duration-300"
                    style={{
                      background: 'rgba(0, 0, 0, 0.5)',
                      border: '1px solid #D4AF37',
                      color: '#D4AF37',
                      boxShadow: '0 0 10px rgba(212, 175, 55, 0.3)'
                    }}
                    placeholder="300"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: '#E6C55F' }}>Energy Source</label>
                  <select
                    value={formData.energySource}
                    onChange={(e) => setFormData(prev => ({ ...prev, energySource: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none transition-all duration-300"
                    style={{
                      background: 'rgba(0, 0, 0, 0.5)',
                      border: '1px solid #D4AF37',
                      color: '#D4AF37'
                    }}
                  >
                    <option value="coal" style={{ background: '#1A1A1A', color: '#D4AF37' }}>Coal Grid</option>
                    <option value="mixed" style={{ background: '#1A1A1A', color: '#D4AF37' }}>Mixed Grid</option>
                    <option value="renewable" style={{ background: '#1A1A1A', color: '#D4AF37' }}>Renewable</option>
                  </select>
                </div>
              </div>
            </div>

            {/* LPG Usage */}
            <div className="p-6 rounded-xl" style={{
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid #D4AF37'
            }}>
              <div className="flex items-center mb-4">
                <Home className="mr-3" style={{ color: '#D4AF37' }} size={24} />
                <h3 className="text-xl font-bold" style={{ color: '#D4AF37' }}>Cooking Gas (LPG)</h3>
              </div>
              <label className="block text-sm mb-2" style={{ color: '#E6C55F' }}>Monthly LPG usage (kg)</label>
              <input
                type="number"
                value={formData.lpgUsage}
                onChange={(e) => setFormData(prev => ({ ...prev, lpgUsage: Number(e.target.value) }))}
                className="w-full px-4 py-3 rounded-lg focus:outline-none transition-all duration-300"
                style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid #D4AF37',
                  color: '#D4AF37',
                  boxShadow: '0 0 10px rgba(212, 175, 55, 0.3)'
                }}
                placeholder="15"
              />
            </div>

            {/* Fuel Consumption */}
            <div className="p-6 rounded-xl" style={{
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid #D4AF37'
            }}>
              <div className="flex items-center mb-4">
                <Car className="mr-3" style={{ color: '#D4AF37' }} size={24} />
                <h3 className="text-xl font-bold" style={{ color: '#D4AF37' }}>Vehicle Fuel</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2" style={{ color: '#E6C55F' }}>Fuel Type</label>
                  <select
                    value={formData.fuelType}
                    onChange={(e) => setFormData(prev => ({ ...prev, fuelType: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none transition-all duration-300"
                    style={{
                      background: 'rgba(0, 0, 0, 0.5)',
                      border: '1px solid #D4AF37',
                      color: '#D4AF37'
                    }}
                  >
                    <option value="petrol" style={{ background: '#1A1A1A', color: '#D4AF37' }}>Petrol</option>
                    <option value="diesel" style={{ background: '#1A1A1A', color: '#D4AF37' }}>Diesel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: '#E6C55F' }}>Monthly fuel (litres)</label>
                  <input
                    type="number"
                    value={formData.fuelUsage}
                    onChange={(e) => setFormData(prev => ({ ...prev, fuelUsage: Number(e.target.value) }))}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none transition-all duration-300"
                    style={{
                      background: 'rgba(0, 0, 0, 0.5)',
                      border: '1px solid #D4AF37',
                      color: '#D4AF37',
                      boxShadow: '0 0 10px rgba(212, 175, 55, 0.3)'
                    }}
                    placeholder="50"
                  />
                </div>
              </div>
            </div>

            {/* Public Transport */}
            <div className="p-6 rounded-xl" style={{
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid #D4AF37'
            }}>
              <div className="flex items-center mb-4">
                <Droplets className="mr-3" style={{ color: '#D4AF37' }} size={24} />
                <h3 className="text-xl font-bold" style={{ color: '#D4AF37' }}>Public Transport</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2" style={{ color: '#E6C55F' }}>Monthly bus distance (km)</label>
                  <input
                    type="number"
                    value={formData.busDistance}
                    onChange={(e) => setFormData(prev => ({ ...prev, busDistance: Number(e.target.value) }))}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none transition-all duration-300"
                    style={{
                      background: 'rgba(0, 0, 0, 0.5)',
                      border: '1px solid #D4AF37',
                      color: '#D4AF37',
                      boxShadow: '0 0 10px rgba(212, 175, 55, 0.3)'
                    }}
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: '#E6C55F' }}>Monthly train/metro (km)</label>
                  <input
                    type="number"
                    value={formData.trainDistance}
                    onChange={(e) => setFormData(prev => ({ ...prev, trainDistance: Number(e.target.value) }))}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none transition-all duration-300"
                    style={{
                      background: 'rgba(0, 0, 0, 0.5)',
                      border: '1px solid #D4AF37',
                      color: '#D4AF37',
                      boxShadow: '0 0 10px rgba(212, 175, 55, 0.3)'
                    }}
                    placeholder="200"
                  />
                </div>
              </div>
            </div>

            {/* Waste & Diet */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl" style={{
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid #D4AF37'
              }}>
                <div className="flex items-center mb-4">
                  <Trash2 className="mr-3" style={{ color: '#D4AF37' }} size={24} />
                  <h3 className="text-xl font-bold" style={{ color: '#D4AF37' }}>Waste</h3>
                </div>
                <label className="block text-sm mb-2" style={{ color: '#E6C55F' }}>Monthly waste (kg)</label>
                <input
                  type="number"
                  value={formData.waste}
                  onChange={(e) => setFormData(prev => ({ ...prev, waste: Number(e.target.value) }))}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none transition-all duration-300"
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid #D4AF37',
                    color: '#D4AF37',
                    boxShadow: '0 0 10px rgba(212, 175, 55, 0.3)'
                  }}
                  placeholder="30"
                />
              </div>
              <div className="p-6 rounded-xl" style={{
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid #D4AF37'
              }}>
                <div className="flex items-center mb-4">
                  <Utensils className="mr-3" style={{ color: '#D4AF37' }} size={24} />
                  <h3 className="text-xl font-bold" style={{ color: '#D4AF37' }}>Diet Type</h3>
                </div>
                <label className="block text-sm mb-2" style={{ color: '#E6C55F' }}>Dietary preference</label>
                <select
                  value={formData.dietType}
                  onChange={(e) => setFormData(prev => ({ ...prev, dietType: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none transition-all duration-300"
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid #D4AF37',
                    color: '#D4AF37'
                  }}
                >
                  <option value="vegetarian" style={{ background: '#1A1A1A', color: '#D4AF37' }}>Vegetarian</option>
                  <option value="mixed" style={{ background: '#1A1A1A', color: '#D4AF37' }}>Mixed Diet</option>
                  <option value="heavy" style={{ background: '#1A1A1A', color: '#D4AF37' }}>Meat Heavy</option>
                </select>
              </div>
            </div>

            {/* Flight Travel */}
            <div className="p-6 rounded-xl" style={{
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid #D4AF37'
            }}>
              <div className="flex items-center mb-4">
                <Plane className="mr-3" style={{ color: '#D4AF37' }} size={24} />
                <h3 className="text-xl font-bold" style={{ color: '#D4AF37' }}>Flight Travel (per year)</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-2" style={{ color: '#E6C55F' }}>Short flights</label>
                  <input
                    type="number"
                    value={formData.shortFlights}
                    onChange={(e) => setFormData(prev => ({ ...prev, shortFlights: Number(e.target.value) }))}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none transition-all duration-300"
                    style={{
                      background: 'rgba(0, 0, 0, 0.5)',
                      border: '1px solid #D4AF37',
                      color: '#D4AF37',
                      boxShadow: '0 0 10px rgba(212, 175, 55, 0.3)'
                    }}
                    placeholder="2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: '#E6C55F' }}>Medium flights</label>
                  <input
                    type="number"
                    value={formData.mediumFlights}
                    onChange={(e) => setFormData(prev => ({ ...prev, mediumFlights: Number(e.target.value) }))}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none transition-all duration-300"
                    style={{
                      background: 'rgba(0, 0, 0, 0.5)',
                      border: '1px solid #D4AF37',
                      color: '#D4AF37',
                      boxShadow: '0 0 10px rgba(212, 175, 55, 0.3)'
                    }}
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: '#E6C55F' }}>Long flights</label>
                  <input
                    type="number"
                    value={formData.longFlights}
                    onChange={(e) => setFormData(prev => ({ ...prev, longFlights: Number(e.target.value) }))}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none transition-all duration-300"
                    style={{
                      background: 'rgba(0, 0, 0, 0.5)',
                      border: '1px solid #D4AF37',
                      color: '#D4AF37',
                      boxShadow: '0 0 10px rgba(212, 175, 55, 0.3)'
                    }}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>



            <button
              type="submit"
              disabled={loading}
              className="w-full text-black py-4 px-8 rounded-xl transition-all duration-500 flex items-center justify-center font-bold text-lg hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #228B22, #D4AF37)',
                border: '2px solid #D4AF37',
                boxShadow: '0 0 30px rgba(212, 175, 55, 0.6)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 50px rgba(212, 175, 55, 1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.6)';
              }}
            >
              <Calculator className="mr-2" size={20} />
              {loading ? 'Calculating...' : 'Calculate My Footprint'}
            </button>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="rounded-2xl shadow-2xl p-8" style={{
            background: 'rgba(0, 0, 0, 0.8)',
            border: '2px solid #D4AF37',
            boxShadow: '0 0 40px rgba(212, 175, 55, 0.4), inset 0 0 40px rgba(212, 175, 55, 0.1)'
          }}>
            <h3 className="text-3xl font-bold mb-8 text-center" style={{ 
              color: '#D4AF37',
              textShadow: '0 0 20px rgba(212, 175, 55, 0.8)'
            }}>Your Carbon Footprint Results</h3>
            
            {/* Total Emissions */}
            <div className="p-8 rounded-2xl mb-8 text-center" style={{
              background: `linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(${getEmissionLevel(result.total).color === 'green' ? '34, 197, 94' : getEmissionLevel(result.total).color === 'yellow' ? '234, 179, 8' : '239, 68, 68'}, 0.2))`,
              border: `2px solid ${getEmissionLevel(result.total).color === 'green' ? '#22c55e' : getEmissionLevel(result.total).color === 'yellow' ? '#eab308' : '#ef4444'}`,
              boxShadow: `0 0 30px rgba(${getEmissionLevel(result.total).color === 'green' ? '34, 197, 94' : getEmissionLevel(result.total).color === 'yellow' ? '234, 179, 8' : '239, 68, 68'}, 0.4)`
            }}>
              <div className="relative">
                <div className="text-6xl font-bold mb-4" style={{
                  color: getEmissionLevel(result.total).color === 'green' ? '#22c55e' : getEmissionLevel(result.total).color === 'yellow' ? '#eab308' : '#ef4444',
                  textShadow: '0 0 20px currentColor'
                }}>
                  {result.total.toFixed(1)}
                </div>
                <div className="text-2xl font-bold mb-2" style={{ color: '#D4AF37' }}>tons CO₂/year</div>
                <div className="inline-block px-6 py-2 rounded-full text-lg font-bold" style={{
                  background: getEmissionLevel(result.total).color === 'green' ? '#22c55e' : getEmissionLevel(result.total).color === 'yellow' ? '#eab308' : '#ef4444',
                  color: 'white'
                }}>
                  {getEmissionLevel(result.total).level} Impact
                </div>
                <p className="text-lg mt-4" style={{ color: '#E6C55F' }}>{getEmissionLevel(result.total).message}</p>
              </div>
            </div>

            {/* Breakdown */}
            <div className="mb-8">
              <h4 className="text-2xl font-bold mb-6 text-center" style={{ color: '#D4AF37' }}>Emissions Breakdown</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl" style={{
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid #D4AF37'
                }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Zap style={{ color: '#D4AF37' }} size={20} className="mr-3" />
                      <span style={{ color: '#E6C55F' }}>Electricity</span>
                    </div>
                    <span className="font-bold" style={{ color: '#D4AF37' }}>{(result.breakdown.electricity/1000).toFixed(2)} tons</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl" style={{
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid #D4AF37'
                }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Home style={{ color: '#D4AF37' }} size={20} className="mr-3" />
                      <span style={{ color: '#E6C55F' }}>LPG Gas</span>
                    </div>
                    <span className="font-bold" style={{ color: '#D4AF37' }}>{(result.breakdown.lpg/1000).toFixed(2)} tons</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl" style={{
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid #D4AF37'
                }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Car style={{ color: '#D4AF37' }} size={20} className="mr-3" />
                      <span style={{ color: '#E6C55F' }}>Vehicle Fuel</span>
                    </div>
                    <span className="font-bold" style={{ color: '#D4AF37' }}>{(result.breakdown.fuel/1000).toFixed(2)} tons</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl" style={{
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid #D4AF37'
                }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Droplets style={{ color: '#D4AF37' }} size={20} className="mr-3" />
                      <span style={{ color: '#E6C55F' }}>Public Transport</span>
                    </div>
                    <span className="font-bold" style={{ color: '#D4AF37' }}>{(result.breakdown.publicTransport/1000).toFixed(2)} tons</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl" style={{
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid #D4AF37'
                }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Trash2 style={{ color: '#D4AF37' }} size={20} className="mr-3" />
                      <span style={{ color: '#E6C55F' }}>Waste</span>
                    </div>
                    <span className="font-bold" style={{ color: '#D4AF37' }}>{(result.breakdown.waste/1000).toFixed(2)} tons</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl" style={{
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid #D4AF37'
                }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Utensils style={{ color: '#D4AF37' }} size={20} className="mr-3" />
                      <span style={{ color: '#E6C55F' }}>Diet</span>
                    </div>
                    <span className="font-bold" style={{ color: '#D4AF37' }}>{(result.breakdown.diet/1000).toFixed(2)} tons</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl" style={{
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid #D4AF37'
                }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Plane style={{ color: '#D4AF37' }} size={20} className="mr-3" />
                      <span style={{ color: '#E6C55F' }}>Flights</span>
                    </div>
                    <span className="font-bold" style={{ color: '#D4AF37' }}>{(result.breakdown.flights/1000).toFixed(2)} tons</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Analysis Results */}
            <div className="p-6 rounded-2xl" style={{
              background: 'rgba(212, 175, 55, 0.1)',
              border: '2px solid #D4AF37',
              boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)'
            }}>
              <div className="flex items-center mb-6 justify-center">
                <Lightbulb style={{ color: '#D4AF37' }} size={28} className="mr-3" />
                <h4 className="text-2xl font-bold" style={{ color: '#D4AF37' }}>AI Carbon Footprint Analysis</h4>
              </div>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-t-transparent rounded-full mx-auto mb-4" style={{ borderColor: '#D4AF37' }}></div>
                  <p style={{ color: '#E6C55F' }}>AI is analyzing your carbon footprint...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {result.suggestions.map((line, index) => (
                    <div key={index} className="p-3 rounded-lg" style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(212, 175, 55, 0.3)'
                    }}>
                      <p style={{ color: '#E6C55F', lineHeight: '1.6' }}>{line}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};