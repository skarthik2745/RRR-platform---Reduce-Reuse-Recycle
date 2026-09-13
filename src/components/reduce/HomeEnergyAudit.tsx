import React, { useState } from 'react';
import { Home, Zap, Calculator, Lightbulb, TrendingUp, Leaf, Download, Award, ChevronDown, ChevronUp } from 'lucide-react';

interface ApplianceData {
  lighting: { led: number; tube: number; hours: number };
  cooling: { fans: number; fanHours: number; ac: number; acHours: number; acTon: number; cooler: number; coolerHours: number };
  kitchen: { fridge: number; microwave: number; induction: number };
  cleaning: { washingMachine: number };
  entertainment: { tv: number; laptop: number; mobile: number };
}

interface FormData {
  houseType: string;
  familyMembers: number;
  electricityHours: number;
  appliances: ApplianceData;
  electricityRate: number;
  state: string;
}

export const HomeEnergyAudit: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    houseType: 'apartment',
    familyMembers: 4,
    electricityHours: 12,
    appliances: {
      lighting: { led: 10, tube: 2, hours: 6 },
      cooling: { fans: 4, fanHours: 8, ac: 1, acHours: 6, acTon: 1.5, cooler: 0, coolerHours: 0 },
      kitchen: { fridge: 1, microwave: 1, induction: 2 },
      cleaning: { washingMachine: 3 },
      entertainment: { tv: 6, laptop: 8, mobile: 2 }
    },
    electricityRate: 6,
    state: 'maharashtra'
  });

  const [result, setResult] = useState<any>(null);
  const [expandedSections, setExpandedSections] = useState({ house: true, appliances: true, rate: true });
  const [savingsSlider, setSavingsSlider] = useState(0);

  const stateRates: { [key: string]: number } = {
    maharashtra: 6.5, delhi: 5.8, karnataka: 7.2, tamilnadu: 4.9, gujarat: 5.5,
    rajasthan: 6.8, punjab: 5.2, haryana: 6.1, uttarpradesh: 5.9, westbengal: 7.1
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const generateAIAnalysis = async (auditData: any) => {
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
              content: 'You are an expert energy auditor. Analyze home energy consumption data and provide specific, actionable recommendations to reduce energy usage and costs. Be practical and focus on the highest impact changes.'
            },
            {
              role: 'user',
              content: `Analyze this home energy audit data and provide 6 specific recommendations:
              
              ENERGY CONSUMPTION ANALYSIS:
              - House Type: ${formData.houseType}
              - Family Members: ${formData.familyMembers}
              - Daily Usage: ${formData.electricityHours} hours
              - Monthly Consumption: ${auditData.monthlyKwh.toFixed(1)} kWh
              - Monthly Bill: ₹${auditData.monthlyBill.toFixed(0)}
              - Efficiency Rating: ${auditData.rating}
              - Annual CO2 Emissions: ${auditData.yearlyCO2.toFixed(0)} kg
              
              APPLIANCE BREAKDOWN:
              - Air Conditioner: ${auditData.breakdown['Air Conditioner'].toFixed(1)}% of usage
              - Refrigerator: ${auditData.breakdown['Refrigerator'].toFixed(1)}% of usage
              - Fans: ${auditData.breakdown['Fans'].toFixed(1)}% of usage
              - Lighting: ${auditData.breakdown['Lighting'].toFixed(1)}% of usage
              - Kitchen: ${auditData.breakdown['Kitchen'].toFixed(1)}% of usage
              - Entertainment: ${auditData.breakdown['Entertainment'].toFixed(1)}% of usage
              
              APPLIANCE DETAILS:
              - LED Bulbs: ${formData.appliances.lighting.led}, Tube Lights: ${formData.appliances.lighting.tube}
              - Fans: ${formData.appliances.cooling.fans} (${formData.appliances.cooling.fanHours}h/day)
              - AC: ${formData.appliances.cooling.ac} units (${formData.appliances.cooling.acHours}h/day, ${formData.appliances.cooling.acTon} ton)
              - TV: ${formData.appliances.entertainment.tv}h/day, Laptop: ${formData.appliances.entertainment.laptop}h/day
              
              Provide 6 numbered, specific recommendations with estimated savings in kWh and rupees.`
            }
          ],
          temperature: 0.7,
          max_tokens: 600
        })
      });
      
      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || '';
      
      // Split AI response into lines and filter meaningful content
      const lines = aiResponse.split('\n').filter(line => line.trim() && (line.includes('.') || line.includes('•') || line.includes('-')));
      return lines;
      
    } catch (error) {
      console.error('AI Analysis Error:', error);
      throw error;
    }
  };

  const calculateEnergyAudit = async () => {
    const { appliances } = formData;
    
    // Power consumption calculations (watts)
    const ledPower = appliances.lighting.led * 9 * appliances.lighting.hours;
    const tubePower = appliances.lighting.tube * 40 * appliances.lighting.hours;
    const fanPower = appliances.cooling.fans * 75 * appliances.cooling.fanHours;
    const acPower = appliances.cooling.ac * (appliances.cooling.acTon * 1200) * appliances.cooling.acHours;
    const coolerPower = appliances.cooling.cooler * 200 * appliances.cooling.coolerHours;
    const fridgePower = appliances.kitchen.fridge * 150 * 24;
    const microwavePower = appliances.kitchen.microwave * 1000 * appliances.kitchen.microwave;
    const inductionPower = appliances.kitchen.induction * 2000 * appliances.kitchen.induction;
    const washingPower = appliances.cleaning.washingMachine * 500 * (appliances.cleaning.washingMachine / 7);
    const tvPower = 120 * appliances.entertainment.tv;
    const laptopPower = 65 * appliances.entertainment.laptop;
    const mobilePower = 10 * appliances.entertainment.mobile;

    const dailyWh = ledPower + tubePower + fanPower + acPower + coolerPower + fridgePower + 
                   microwavePower + inductionPower + washingPower + tvPower + laptopPower + mobilePower;
    
    const dailyKwh = dailyWh / 1000;
    const monthlyKwh = dailyKwh * 30;
    const yearlyKwh = dailyKwh * 365;
    const monthlyBill = monthlyKwh * formData.electricityRate;
    const yearlyBill = yearlyKwh * formData.electricityRate;

    // Carbon footprint (India avg: 0.82 kg CO2 per kWh)
    const dailyCO2 = dailyKwh * 0.82;
    const monthlyCO2 = monthlyKwh * 0.82;
    const yearlyCO2 = yearlyKwh * 0.82;
    const treesNeeded = Math.ceil(yearlyCO2 / 22); // 1 tree absorbs ~22kg CO2/year

    // Efficiency rating
    const avgConsumption = formData.familyMembers * 90; // 90 kWh per person per month
    const efficiencyRatio = monthlyKwh / avgConsumption;
    let rating = 'A';
    if (efficiencyRatio > 1.5) rating = 'E';
    else if (efficiencyRatio > 1.2) rating = 'D';
    else if (efficiencyRatio > 1.0) rating = 'C';
    else if (efficiencyRatio > 0.8) rating = 'B';

    // Appliance breakdown
    const breakdown = {
      'Air Conditioner': (acPower / dailyWh) * 100,
      'Refrigerator': (fridgePower / dailyWh) * 100,
      'Fans': (fanPower / dailyWh) * 100,
      'Lighting': ((ledPower + tubePower) / dailyWh) * 100,
      'Kitchen': ((microwavePower + inductionPower) / dailyWh) * 100,
      'Entertainment': ((tvPower + laptopPower + mobilePower) / dailyWh) * 100,
      'Others': ((washingPower + coolerPower) / dailyWh) * 100
    };

    const auditResult = {
      dailyKwh, monthlyKwh, yearlyKwh, monthlyBill, yearlyBill,
      dailyCO2, monthlyCO2, yearlyCO2, treesNeeded, rating, breakdown,
      aiAnalysis: null
    };

    setResult(auditResult);

    // Generate AI analysis
    try {
      const aiAnalysis = await generateAIAnalysis(auditResult);
      setResult(prev => ({ ...prev, aiAnalysis }));
    } catch (error) {
      setResult(prev => ({ ...prev, aiAnalysis: ['AI analysis failed. Please try again later.'] }));
    }
  };

  const getRatingColor = (rating: string) => {
    const colors = { A: '#22c55e', B: '#84cc16', C: '#eab308', D: '#f97316', E: '#ef4444' };
    return colors[rating as keyof typeof colors] || '#6b7280';
  };

  const calculateSavings = (reductionHours: number) => {
    if (!result) return { units: 0, money: 0, co2: 0 };
    const reduction = (reductionHours / formData.electricityHours);
    return {
      units: result.monthlyKwh * reduction,
      money: result.monthlyBill * reduction,
      co2: result.monthlyCO2 * reduction
    };
  };

  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-2" style={{ color: '#FFD700' }}>Home Energy Audit</h2>
        <p className="text-xl" style={{ color: '#E6C55F' }}>Complete energy analysis with personalized recommendations</p>
      </div>

      <div className="space-y-8">
        {/* TOP PANEL - INPUT */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold" style={{ color: '#FFD700' }}>Enter Your Home Details</h3>
          
          {/* House Information */}
          <div className="rounded-xl shadow-lg overflow-hidden" style={{ background: 'rgba(45, 80, 22, 0.2)', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
            <div className="p-4 cursor-pointer flex justify-between items-center" onClick={() => toggleSection('house')} style={{ background: 'rgba(255, 215, 0, 0.1)' }}>
              <h4 className="font-semibold flex items-center" style={{ color: '#FFD700' }}>
                <Home className="mr-2" size={20} />
                1️⃣ House Information
              </h4>
              {expandedSections.house ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {expandedSections.house && (
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-base mb-2" style={{ color: '#E6C55F' }}>House Type</label>
                  <select value={formData.houseType} onChange={(e) => setFormData(prev => ({ ...prev, houseType: e.target.value }))} className="w-full px-3 py-2 border rounded-md" style={{ background: '#1a1a1a', border: '2px solid #FFD700', color: '#00ff00', fontFamily: 'monospace', fontSize: '16px', fontWeight: 'bold' }}>
                    <option value="apartment">Apartment</option>
                    <option value="independent">Independent Home</option>
                    <option value="hostel">Hostel/PG</option>
                  </select>
                </div>
                <div>
                  <label className="block text-base mb-2" style={{ color: '#E6C55F' }}>Family Members (1-10)</label>
                  <input type="number" min="1" max="10" value={formData.familyMembers} onChange={(e) => setFormData(prev => ({ ...prev, familyMembers: Number(e.target.value) }))} className="w-full px-3 py-2 border rounded-md" style={{ background: '#1a1a1a', border: '2px solid #FFD700', color: '#00ff00', fontFamily: 'monospace', fontSize: '16px', fontWeight: 'bold', textAlign: 'center' }} />
                </div>
                <div>
                  <label className="block text-base mb-2" style={{ color: '#E6C55F' }}>Hours of electricity usage per day</label>
                  <input type="number" min="1" max="24" value={formData.electricityHours} onChange={(e) => setFormData(prev => ({ ...prev, electricityHours: Number(e.target.value) }))} className="w-full px-3 py-2 border rounded-md" style={{ background: '#1a1a1a', border: '2px solid #FFD700', color: '#00ff00', fontFamily: 'monospace', fontSize: '16px', fontWeight: 'bold', textAlign: 'center' }} />
                </div>
              </div>
            )}
          </div>

          {/* Appliances */}
          <div className="rounded-xl shadow-lg overflow-hidden" style={{ background: 'rgba(45, 80, 22, 0.2)', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
            <div className="p-4 cursor-pointer flex justify-between items-center" onClick={() => toggleSection('appliances')} style={{ background: 'rgba(255, 215, 0, 0.1)' }}>
              <h4 className="font-semibold flex items-center" style={{ color: '#FFD700' }}>
                <Zap className="mr-2" size={20} />
                2️⃣ Electricity Appliances
              </h4>
              {expandedSections.appliances ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {expandedSections.appliances && (
              <div className="p-4 space-y-6">
                {/* Lighting */}
                <div className="p-4 rounded-lg" style={{ background: 'rgba(255, 215, 0, 0.1)', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
                  <h5 className="font-medium mb-3" style={{ color: '#FFD700' }}>💡 Lighting</h5>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm mb-1" style={{ color: '#E6C55F' }}>LED Bulbs</label>
                      <input type="number" min="0" value={formData.appliances.lighting.led} onChange={(e) => setFormData(prev => ({ ...prev, appliances: { ...prev.appliances, lighting: { ...prev.appliances.lighting, led: Number(e.target.value) }}}))} className="w-full px-2 py-1 border rounded text-sm" style={{ background: '#1a1a1a', border: '2px solid #FFD700', color: '#00ff00', fontFamily: 'monospace', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }} />
                    </div>
                    <div>
                      <label className="block text-sm mb-1" style={{ color: '#E6C55F' }}>Tube Lights</label>
                      <input type="number" min="0" value={formData.appliances.lighting.tube} onChange={(e) => setFormData(prev => ({ ...prev, appliances: { ...prev.appliances, lighting: { ...prev.appliances.lighting, tube: Number(e.target.value) }}}))} className="w-full px-2 py-1 border rounded text-sm" style={{ background: '#1a1a1a', border: '2px solid #FFD700', color: '#00ff00', fontFamily: 'monospace', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }} />
                    </div>
                    <div>
                      <label className="block text-sm mb-1" style={{ color: '#E6C55F' }}>Daily Hours</label>
                      <input type="number" min="0" max="24" value={formData.appliances.lighting.hours} onChange={(e) => setFormData(prev => ({ ...prev, appliances: { ...prev.appliances, lighting: { ...prev.appliances.lighting, hours: Number(e.target.value) }}}))} className="w-full px-2 py-1 border rounded text-sm" style={{ background: '#1a1a1a', border: '2px solid #FFD700', color: '#00ff00', fontFamily: 'monospace', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }} />
                    </div>
                  </div>
                </div>

                {/* Cooling */}
                <div className="p-4 rounded-lg" style={{ background: 'rgba(255, 215, 0, 0.1)', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
                  <h5 className="font-medium mb-3" style={{ color: '#FFD700' }}>❄️ Cooling</h5>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm mb-1" style={{ color: '#E6C55F' }}>Fans (qty)</label>
                        <input type="number" min="0" value={formData.appliances.cooling.fans} onChange={(e) => setFormData(prev => ({ ...prev, appliances: { ...prev.appliances, cooling: { ...prev.appliances.cooling, fans: Number(e.target.value) }}}))} className="w-full px-2 py-1 border rounded text-sm" style={{ background: '#1a1a1a', border: '2px solid #FFD700', color: '#00ff00', fontFamily: 'monospace', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }} />
                      </div>
                      <div>
                        <label className="block text-sm mb-1" style={{ color: '#E6C55F' }}>Hours/day</label>
                        <input type="number" min="0" max="24" value={formData.appliances.cooling.fanHours} onChange={(e) => setFormData(prev => ({ ...prev, appliances: { ...prev.appliances, cooling: { ...prev.appliances.cooling, fanHours: Number(e.target.value) }}}))} className="w-full px-2 py-1 border rounded text-sm" style={{ background: '#1a1a1a', border: '2px solid #FFD700', color: '#00ff00', fontFamily: 'monospace', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm mb-1" style={{ color: '#E6C55F' }}>AC (qty)</label>
                        <input type="number" min="0" value={formData.appliances.cooling.ac} onChange={(e) => setFormData(prev => ({ ...prev, appliances: { ...prev.appliances, cooling: { ...prev.appliances.cooling, ac: Number(e.target.value) }}}))} className="w-full px-2 py-1 border rounded text-sm" style={{ background: '#1a1a1a', border: '2px solid #FFD700', color: '#00ff00', fontFamily: 'monospace', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }} />
                      </div>
                      <div>
                        <label className="block text-sm mb-1" style={{ color: '#E6C55F' }}>Hours/day</label>
                        <input type="number" min="0" max="24" value={formData.appliances.cooling.acHours} onChange={(e) => setFormData(prev => ({ ...prev, appliances: { ...prev.appliances, cooling: { ...prev.appliances.cooling, acHours: Number(e.target.value) }}}))} className="w-full px-2 py-1 border rounded text-sm" style={{ background: '#1a1a1a', border: '2px solid #FFD700', color: '#00ff00', fontFamily: 'monospace', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }} />
                      </div>
                      <div>
                        <label className="block text-sm mb-1" style={{ color: '#E6C55F' }}>Ton</label>
                        <select value={formData.appliances.cooling.acTon} onChange={(e) => setFormData(prev => ({ ...prev, appliances: { ...prev.appliances, cooling: { ...prev.appliances.cooling, acTon: Number(e.target.value) }}}))} className="w-full px-2 py-1 border rounded text-sm" style={{ background: '#1a1a1a', border: '2px solid #FFD700', color: '#00ff00', fontFamily: 'monospace', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>
                          <option value={1}>1 Ton</option>
                          <option value={1.5}>1.5 Ton</option>
                          <option value={2}>2 Ton</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kitchen */}
                <div className="p-4 rounded-lg" style={{ background: 'rgba(255, 215, 0, 0.1)', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
                  <h5 className="font-medium mb-3" style={{ color: '#FFD700' }}>🍳 Kitchen</h5>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm mb-1" style={{ color: '#E6C55F' }}>Fridge</label>
                      <select value={formData.appliances.kitchen.fridge} onChange={(e) => setFormData(prev => ({ ...prev, appliances: { ...prev.appliances, kitchen: { ...prev.appliances.kitchen, fridge: Number(e.target.value) }}}))} className="w-full px-2 py-1 border rounded text-sm" style={{ background: '#1a1a1a', border: '2px solid #FFD700', color: '#00ff00', fontFamily: 'monospace', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1" style={{ color: '#E6C55F' }}>Microwave (hrs/day)</label>
                      <input type="number" min="0" max="24" step="0.5" value={formData.appliances.kitchen.microwave} onChange={(e) => setFormData(prev => ({ ...prev, appliances: { ...prev.appliances, kitchen: { ...prev.appliances.kitchen, microwave: Number(e.target.value) }}}))} className="w-full px-2 py-1 border rounded text-sm" style={{ background: '#1a1a1a', border: '2px solid #FFD700', color: '#00ff00', fontFamily: 'monospace', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }} />
                    </div>
                    <div>
                      <label className="block text-sm mb-1" style={{ color: '#E6C55F' }}>Induction (hrs/day)</label>
                      <input type="number" min="0" max="24" step="0.5" value={formData.appliances.kitchen.induction} onChange={(e) => setFormData(prev => ({ ...prev, appliances: { ...prev.appliances, kitchen: { ...prev.appliances.kitchen, induction: Number(e.target.value) }}}))} className="w-full px-2 py-1 border rounded text-sm" style={{ background: '#1a1a1a', border: '2px solid #FFD700', color: '#00ff00', fontFamily: 'monospace', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }} />
                    </div>
                  </div>
                </div>

                {/* Entertainment */}
                <div className="p-4 rounded-lg" style={{ background: 'rgba(255, 215, 0, 0.1)', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
                  <h5 className="font-medium mb-3" style={{ color: '#FFD700' }}>📺 Entertainment</h5>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm mb-1" style={{ color: '#E6C55F' }}>TV (hrs/day)</label>
                      <input type="number" min="0" max="24" value={formData.appliances.entertainment.tv} onChange={(e) => setFormData(prev => ({ ...prev, appliances: { ...prev.appliances, entertainment: { ...prev.appliances.entertainment, tv: Number(e.target.value) }}}))} className="w-full px-2 py-1 border rounded text-sm" style={{ background: '#1a1a1a', border: '2px solid #FFD700', color: '#00ff00', fontFamily: 'monospace', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }} />
                    </div>
                    <div>
                      <label className="block text-sm mb-1" style={{ color: '#E6C55F' }}>Laptop (hrs/day)</label>
                      <input type="number" min="0" max="24" value={formData.appliances.entertainment.laptop} onChange={(e) => setFormData(prev => ({ ...prev, appliances: { ...prev.appliances, entertainment: { ...prev.appliances.entertainment, laptop: Number(e.target.value) }}}))} className="w-full px-2 py-1 border rounded text-sm" style={{ background: '#1a1a1a', border: '2px solid #FFD700', color: '#00ff00', fontFamily: 'monospace', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }} />
                    </div>
                    <div>
                      <label className="block text-sm mb-1" style={{ color: '#E6C55F' }}>Mobile Charging</label>
                      <input type="number" min="0" value={formData.appliances.entertainment.mobile} onChange={(e) => setFormData(prev => ({ ...prev, appliances: { ...prev.appliances, entertainment: { ...prev.appliances.entertainment, mobile: Number(e.target.value) }}}))} className="w-full px-2 py-1 border rounded text-sm" style={{ background: '#1a1a1a', border: '2px solid #FFD700', color: '#00ff00', fontFamily: 'monospace', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Energy Rate */}
          <div className="rounded-xl shadow-lg overflow-hidden" style={{ background: 'rgba(45, 80, 22, 0.2)', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
            <div className="p-4 cursor-pointer flex justify-between items-center" onClick={() => toggleSection('rate')} style={{ background: 'rgba(255, 215, 0, 0.1)' }}>
              <h4 className="font-semibold flex items-center" style={{ color: '#FFD700' }}>
                <Calculator className="mr-2" size={20} />
                3️⃣ Energy Rate Input
              </h4>
              {expandedSections.rate ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {expandedSections.rate && (
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-base mb-2" style={{ color: '#E6C55F' }}>State Selection</label>
                  <select value={formData.state} onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value, electricityRate: stateRates[e.target.value] }))} className="w-full px-3 py-2 border rounded-md" style={{ background: '#1a1a1a', border: '2px solid #FFD700', color: '#00ff00', fontFamily: 'monospace', fontSize: '16px', fontWeight: 'bold' }}>
                    {Object.keys(stateRates).map(state => (
                      <option key={state} value={state}>{state.charAt(0).toUpperCase() + state.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-base mb-2" style={{ color: '#E6C55F' }}>Electricity Cost per Unit (₹)</label>
                  <input type="number" step="0.1" value={formData.electricityRate} onChange={(e) => setFormData(prev => ({ ...prev, electricityRate: Number(e.target.value) }))} className="w-full px-3 py-2 border rounded-md" style={{ background: '#1a1a1a', border: '2px solid #FFD700', color: '#00ff00', fontFamily: 'monospace', fontSize: '16px', fontWeight: 'bold', textAlign: 'center' }} />
                </div>
              </div>
            )}
          </div>

          <button onClick={calculateEnergyAudit} className="w-full text-white py-4 px-6 rounded-xl text-xl font-bold transition-all duration-300 hover:scale-105" style={{ background: 'linear-gradient(135deg, #B8860B, #DAA520)', border: '2px solid #FFD700', boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)' }}>
            <Calculator className="mr-3" size={24} />
            Calculate Energy Audit
          </button>
        </div>

        {/* BOTTOM PANEL - OUTPUT */}
        {result && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold" style={{ color: '#FFD700' }}>Your Energy & Cost Analysis</h3>
            
            {/* Total Energy Consumption */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl p-4 text-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white' }}>
                <Zap size={32} className="mx-auto mb-2" />
                <div className="text-2xl font-bold">{result.yearlyKwh.toFixed(0)}</div>
                <div className="text-sm">kWh/year</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'linear-gradient(135deg, #10b981, #047857)', color: 'white' }}>
                <span className="text-2xl">₹</span>
                <div className="text-2xl font-bold">{result.yearlyBill.toFixed(0)}</div>
                <div className="text-sm">Bill/year</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: `linear-gradient(135deg, ${getRatingColor(result.rating)}, ${getRatingColor(result.rating)}dd)`, color: 'white' }}>
                <Award size={32} className="mx-auto mb-2" />
                <div className="text-2xl font-bold">{result.rating}</div>
                <div className="text-sm">Efficiency</div>
              </div>
            </div>

            {/* Carbon Footprint */}
            <div className="rounded-xl p-6" style={{ background: 'rgba(45, 80, 22, 0.2)', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
              <h4 className="font-semibold mb-4 flex items-center" style={{ color: '#FFD700' }}>
                <Leaf className="mr-2" size={20} />
                🌍 Carbon Footprint Impact
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ color: '#E6C55F' }}>{result.yearlyCO2.toFixed(0)} kg</div>
                  <div className="text-base" style={{ color: '#E6C55F' }}>CO₂ per year</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ color: '#E6C55F' }}>{result.treesNeeded}</div>
                  <div className="text-base" style={{ color: '#E6C55F' }}>Trees needed</div>
                </div>
              </div>
            </div>

            {/* Appliance Breakdown */}
            <div className="rounded-xl p-6" style={{ background: 'rgba(45, 80, 22, 0.2)', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
              <h4 className="font-semibold mb-4" style={{ color: '#FFD700' }}>🔥 Appliance Breakdown</h4>
              <div className="space-y-3">
                {Object.entries(result.breakdown).map(([appliance, percentage]) => (
                  <div key={appliance} className="flex justify-between items-center">
                    <span className="text-base" style={{ color: '#E6C55F' }}>{appliance}</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                      </div>
                      <span className="text-base font-medium" style={{ color: '#FFD700' }}>{percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Savings Simulator */}
            <div className="rounded-xl p-6" style={{ background: 'rgba(45, 80, 22, 0.2)', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
              <h4 className="font-semibold mb-4" style={{ color: '#FFD700' }}>🌿 Savings Simulator</h4>
              <div className="mb-4">
                <label className="block text-base mb-2" style={{ color: '#E6C55F' }}>Reduce usage by {savingsSlider} hours per day</label>
                <input type="range" min="0" max="4" step="0.5" value={savingsSlider} onChange={(e) => setSavingsSlider(Number(e.target.value))} className="w-full" />
              </div>
              {savingsSlider > 0 && (
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-green-600">{calculateSavings(savingsSlider).units.toFixed(0)}</div>
                    <div className="text-base" style={{ color: '#E6C55F' }}>kWh saved/month</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-green-600">₹{calculateSavings(savingsSlider).money.toFixed(0)}</div>
                    <div className="text-base" style={{ color: '#E6C55F' }}>Money saved/month</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-green-600">{calculateSavings(savingsSlider).co2.toFixed(0)} kg</div>
                    <div className="text-base" style={{ color: '#E6C55F' }}>CO₂ saved/month</div>
                  </div>
                </div>
              )}
            </div>

            {/* AI-Powered Recommendations */}
            <div className="rounded-xl p-6" style={{ background: 'rgba(45, 80, 22, 0.2)', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
              <h4 className="font-semibold mb-4 flex items-center" style={{ color: '#FFD700' }}>
                <Lightbulb className="mr-2" size={20} />
                🤖 AI Energy Analysis
              </h4>
              {result.aiAnalysis ? (
                <div className="space-y-3">
                  {result.aiAnalysis.map((analysis: string, index: number) => (
                    <div key={index} className="p-3 rounded-lg" style={{ background: 'rgba(255, 215, 0, 0.1)', border: '1px solid rgba(255, 215, 0, 0.2)' }}>
                      <p className="text-base" style={{ color: '#E6C55F' }}>{analysis}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="animate-spin w-6 h-6 border-4 border-t-transparent rounded-full mx-auto mb-2" style={{ borderColor: '#FFD700' }}></div>
                  <p style={{ color: '#E6C55F' }}>AI is analyzing your energy usage...</p>
                </div>
              )}
            </div>

            {/* Download Report */}
            <button className="w-full text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
              <Download className="mr-2" size={20} />
              Download Energy Report (PDF)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};