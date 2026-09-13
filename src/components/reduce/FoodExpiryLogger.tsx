import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Edit, Trash2, Bell, X, Award, TrendingUp, Bot } from 'lucide-react';
import { getFoodExpiryItems, createFoodExpiryItem, getAllFoodExpiryItems, updateFoodExpiryItem, deleteFoodExpiryItem } from '../../lib/database';
import { getCurrentUser } from '../../lib/auth';

interface FoodItem {
  id: string;
  name: string;
  expiryDate: string;
  storageLocation: string;
  status: 'fresh' | 'expiring' | 'expired';
}

const AIWastePreventionTips: React.FC<{ expiredItems: FoodItem[], expiringItems: FoodItem[] }> = ({ expiredItems, expiringItems }) => {
  const [tips, setTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generateTips = async () => {
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
              content: 'You are a food waste prevention specialist. Provide specific, actionable tips to prevent food waste based on the user\'s expired and expiring food patterns.'
            },
            {
              role: 'user',
              content: `Based on my food waste patterns, provide 6 specific prevention tips:
              
              EXPIRED ITEMS: ${expiredItems.map(item => `${item.name} (${item.storageLocation})`).join(', ')}
              EXPIRING SOON: ${expiringItems.map(item => `${item.name} (${item.storageLocation})`).join(', ')}
              
              Give me 6 practical, specific tips to prevent these types of foods from expiring in the future. Focus on storage, timing, and consumption strategies.`
            }
          ],
          temperature: 0.7,
          max_tokens: 300
        })
      });
      
      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || '';
      
      const tipsList = aiResponse.split('\n').filter(line => 
        line.trim() && (line.includes('.') || line.includes('•') || line.includes('-'))
      ).slice(0, 6);
      
      setTips(tipsList.length > 0 ? tipsList : [
        'Buy smaller quantities when unsure about consumption',
        'Store items in labeled containers with expiry dates visible',
        'Organize fridge by expiry date — oldest items in front',
        'Set phone reminders to check expiry dates weekly',
        'Freeze perishables before they expire to extend shelf life',
        'Use transparent containers to easily track food quantities'
      ]);
    } catch (error) {
      setTips([
        'Buy smaller quantities when unsure about consumption',
        'Store items in labeled containers with expiry dates visible',
        'Organize fridge by expiry date — oldest items in front',
        'Set phone reminders to check expiry dates weekly',
        'Freeze perishables before they expire to extend shelf life',
        'Use transparent containers to easily track food quantities'
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateTips();
  }, [expiredItems, expiringItems]);

  return (
    <div>
      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin w-6 h-6 border-4 border-t-transparent rounded-full mx-auto mb-2" style={{ borderColor: '#e3b645' }}></div>
          <p style={{ color: '#e7c97b' }}>Generating prevention tips...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-3">
              <Bot size={16} className="mt-1 flex-shrink-0" style={{ color: '#28A745' }} />
              <span className="text-sm" style={{ color: '#e7c97b' }}>
                {tip.replace(/^\d+\.\s*/, '').replace(/^[•-]\s*/, '')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AIFoodWasteAnalysis: React.FC<{ foodItems: FoodItem[] }> = ({ foodItems }) => {
  const [analysis, setAnalysis] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generateAnalysis = async () => {
    setLoading(true);
    try {
      const expiredItems = foodItems.filter(item => item.status === 'expired');
      const expiringItems = foodItems.filter(item => item.status === 'expiring');
      const freshItems = foodItems.filter(item => item.status === 'fresh');
      
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
              content: 'You are a food waste prevention expert. Analyze expired food patterns and provide specific strategies to prevent food from expiring. Focus on storage methods, timing, and consumption habits that prevent waste.'
            },
            {
              role: 'user',
              content: `Analyze my expired food items and provide specific prevention strategies:
              
              EXPIRED FOOD ANALYSIS:
              Total Expired Items: ${expiredItems.length}
              Expired Foods: ${expiredItems.map(item => `${item.name} (stored in ${item.storageLocation}, expired on ${item.expiryDate})`).join(', ')}
              
              EXPIRING SOON (Risk Items): ${expiringItems.length}
              At-Risk Foods: ${expiringItems.map(item => `${item.name} (expires ${item.expiryDate})`).join(', ')}
              
              STORAGE PATTERNS OF EXPIRED ITEMS:
              ${expiredItems.reduce((acc, item) => {
                acc[item.storageLocation] = (acc[item.storageLocation] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)}
              
              Based on these specific expired items and storage patterns, provide 6 targeted strategies to prevent future food waste. Focus on why these particular items expired and how to avoid it.`
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });
      
      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || '';
      
      const recommendations = aiResponse.split('\n').filter(line => 
        line.trim() && (line.includes('.') || line.includes('•') || line.includes('-'))
      ).slice(0, 6);
      
      setAnalysis(recommendations);
    } catch (error) {
      console.error('AI Analysis Error:', error);
      setAnalysis([
        'Check expiry dates when buying - choose items with longer shelf life',
        'Store perishables in optimal conditions (proper temperature/humidity)',
        'Use transparent containers to easily see what needs to be consumed first',
        'Plan meals around items that expire soonest',
        'Set phone reminders 2-3 days before expiry dates',
        'Learn proper storage techniques for different food types'
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (foodItems.length > 0) {
      generateAnalysis();
    }
  }, [foodItems]);

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="text-center py-6">
          <div className="animate-spin w-8 h-8 border-4 border-t-transparent rounded-full mx-auto mb-4" style={{ borderColor: '#e3b645' }}></div>
          <p style={{ color: '#e7c97b' }}>AI is analyzing your food inventory...</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(40, 167, 69, 0.1)' }}>
              <div className="text-2xl font-bold" style={{ color: '#28A745' }}>{foodItems.filter(item => item.status === 'fresh').length}</div>
              <div className="text-sm" style={{ color: '#e7c97b' }}>Fresh Items</div>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(242, 201, 76, 0.1)' }}>
              <div className="text-2xl font-bold" style={{ color: '#f2c94c' }}>{foodItems.filter(item => item.status === 'expiring').length}</div>
              <div className="text-sm" style={{ color: '#e7c97b' }}>Expiring Soon</div>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(235, 87, 87, 0.1)' }}>
              <div className="text-2xl font-bold" style={{ color: '#eb5757' }}>{foodItems.filter(item => item.status === 'expired').length}</div>
              <div className="text-sm" style={{ color: '#e7c97b' }}>Expired</div>
            </div>
          </div>
          
          <div className="space-y-3">
            {analysis.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg" style={{
                background: 'rgba(227, 182, 69, 0.1)',
                border: '1px solid rgba(227, 182, 69, 0.3)'
              }}>
                <Bot size={16} className="mt-1 flex-shrink-0" style={{ color: '#e3b645' }} />
                <p className="text-sm" style={{ color: '#e7c97b' }}>
                  {recommendation.replace(/^\d+\.\s*/, '').replace(/^[•-]\s*/, '')}
                </p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-4">
            <button
              onClick={generateAnalysis}
              disabled={loading}
              className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #B8860B, #DAA520)',
                color: 'white',
                border: '2px solid #e3b645'
              }}
            >
              {loading ? 'Analyzing...' : 'Refresh Analysis'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export const FoodExpiryLogger: React.FC = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  useEffect(() => {
    const loadUserAndItems = async () => {
      try {
        const user = await getCurrentUser();
        console.log('Current user:', user);
        setCurrentUser(user);
        
        // Try to load all food items first (for testing)
        const { data: allData, error: allError } = await getAllFoodExpiryItems();
        console.log('All food items:', allData, 'Error:', allError);
        
        if (allData && allData.length > 0) {
          const formattedItems = allData.map((item: any) => ({
            id: item.id,
            name: item.name,
            expiryDate: item.expiry_date,
            storageLocation: item.category || 'Fridge',
            status: item.status
          }));
          console.log('Formatted items:', formattedItems);
          setFoodItems(formattedItems);
        } else if (user) {
          const { data, error } = await getFoodExpiryItems(user.id);
          console.log('User food items data:', data, 'Error:', error);
          
          if (data && data.length > 0) {
            const formattedItems = data.map((item: any) => ({
              id: item.id,
              name: item.name,
              expiryDate: item.expiry_date,
              storageLocation: item.category || 'Fridge',
              status: item.status
            }));
            console.log('Formatted items:', formattedItems);
            setFoodItems(formattedItems);
          } else {
            // Load dummy data if no database data
            setFoodItems([
              { id: '1', name: 'Apples', expiryDate: '2025-03-12', storageLocation: 'Fridge', status: 'fresh' },
              { id: '2', name: 'Milk', expiryDate: '2025-02-28', storageLocation: 'Fridge', status: 'expiring' },
              { id: '3', name: 'Bread', expiryDate: '2025-01-22', storageLocation: 'Pantry', status: 'expired' },
              { id: '4', name: 'Tomatoes', expiryDate: '2025-03-10', storageLocation: 'Fridge', status: 'fresh' },
              { id: '5', name: 'Eggs', expiryDate: '2025-02-20', storageLocation: 'Fridge', status: 'expiring' },
              { id: '6', name: 'Cheese', expiryDate: '2025-02-27', storageLocation: 'Fridge', status: 'expiring' }
            ]);
          }
        } else {
          // Load dummy data if no user
          setFoodItems([
            { id: '1', name: 'Apples', expiryDate: '2025-03-12', storageLocation: 'Fridge', status: 'fresh' },
            { id: '2', name: 'Milk', expiryDate: '2025-02-28', storageLocation: 'Fridge', status: 'expiring' },
            { id: '3', name: 'Bread', expiryDate: '2025-01-22', storageLocation: 'Pantry', status: 'expired' },
            { id: '4', name: 'Tomatoes', expiryDate: '2025-03-10', storageLocation: 'Fridge', status: 'fresh' },
            { id: '5', name: 'Eggs', expiryDate: '2025-02-20', storageLocation: 'Fridge', status: 'expiring' },
            { id: '6', name: 'Cheese', expiryDate: '2025-02-27', storageLocation: 'Fridge', status: 'expiring' }
          ]);
        }
      } catch (error) {
        console.error('Error loading food items:', error);
        // Load dummy data on error
        setFoodItems([
          { id: '1', name: 'Apples', expiryDate: '2025-03-12', storageLocation: 'Fridge', status: 'fresh' },
          { id: '2', name: 'Milk', expiryDate: '2025-02-28', storageLocation: 'Fridge', status: 'expiring' },
          { id: '3', name: 'Bread', expiryDate: '2025-01-22', storageLocation: 'Pantry', status: 'expired' },
          { id: '4', name: 'Tomatoes', expiryDate: '2025-03-10', storageLocation: 'Fridge', status: 'fresh' },
          { id: '5', name: 'Eggs', expiryDate: '2025-02-20', storageLocation: 'Fridge', status: 'expiring' },
          { id: '6', name: 'Cheese', expiryDate: '2025-02-27', storageLocation: 'Fridge', status: 'expiring' }
        ]);
      }
    };
    
    loadUserAndItems();
  }, []);
  
  const [newItem, setNewItem] = useState({ name: '', expiryDate: '', storageLocation: 'Fridge' });
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [weeklyStatus, setWeeklyStatus] = useState<'good' | 'expired'>('good');
  const [weeklyPoints, setWeeklyPoints] = useState(0);

  const storageOptions = ['Fridge', 'Freezer', 'Pantry', 'Shelf', 'Cupboard', 'Rack', 'Other'];

  // Check weekly expiry status
  useEffect(() => {
    const checkWeeklyStatus = () => {
      const today = new Date();
      const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
      
      const expiredThisWeek = foodItems.some(item => {
        const expiryDate = new Date(item.expiryDate);
        return item.status === 'expired' && expiryDate >= weekStart;
      });
      
      const newStatus = expiredThisWeek ? 'expired' : 'good';
      setWeeklyStatus(newStatus);
      
      // Award points if no expired items this week
      if (newStatus === 'good' && weeklyPoints === 0) {
        const currentPoints = parseInt(localStorage.getItem('userTotalPoints') || '0');
        const newTotal = currentPoints + 200;
        localStorage.setItem('userTotalPoints', newTotal.toString());
        setWeeklyPoints(200);
      }
    };
    
    checkWeeklyStatus();
  }, [foodItems, weeklyPoints]);



  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'fresh': return { color: '#28A745', label: 'Fresh', bgColor: 'rgba(40, 167, 69, 0.1)' };
      case 'expiring': return { color: '#F2C94C', label: 'Expiring Soon', bgColor: 'rgba(242, 201, 76, 0.1)' };
      case 'expired': return { color: '#EB5757', label: 'Expired', bgColor: 'rgba(235, 87, 87, 0.1)' };
      default: return { color: '#28A745', label: 'Fresh', bgColor: 'rgba(40, 167, 69, 0.1)' };
    }
  };



  const addFoodItem = async () => {
    if (newItem.name && newItem.expiryDate && currentUser) {
      const today = new Date();
      const expiry = new Date(newItem.expiryDate);
      const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
      
      let status: 'fresh' | 'expiring' | 'expired' = 'fresh';
      if (diffDays < 0) status = 'expired';
      else if (diffDays <= 2) status = 'expiring';

      const { data, error } = await createFoodExpiryItem({
        user_id: currentUser.id,
        name: newItem.name,
        category: newItem.storageLocation,
        expiry_date: newItem.expiryDate,
        status: status,
        quantity: 1
      });
      
      if (data) {
        const item: FoodItem = {
          id: data[0].id,
          name: newItem.name,
          expiryDate: newItem.expiryDate,
          storageLocation: newItem.storageLocation,
          status
        };
        
        setFoodItems(prev => [...prev, item]);
        setNewItem({ name: '', expiryDate: '', storageLocation: 'Fridge' });
        alert('Food item saved successfully!');
      } else if (error) {
        console.error('Error saving food item:', error);
        alert('Failed to save food item. Please try again.');
      }
    }
  };

  const deleteFoodItem = async (id: string) => {
    const { error } = await deleteFoodExpiryItem(id);
    if (!error) {
      setFoodItems(prev => prev.filter(item => item.id !== id));
    } else {
      alert('Failed to delete item');
    }
  };

  const editFoodItem = (item: FoodItem) => {
    setEditingItem({ ...item });
  };

  const saveEditedItem = async () => {
    if (editingItem) {
      const today = new Date();
      const expiry = new Date(editingItem.expiryDate);
      const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
      
      let status: 'fresh' | 'expiring' | 'expired' = 'fresh';
      if (diffDays < 0) status = 'expired';
      else if (diffDays <= 2) status = 'expiring';

      const { error } = await updateFoodExpiryItem(editingItem.id, {
        name: editingItem.name,
        expiry_date: editingItem.expiryDate,
        category: editingItem.storageLocation,
        status: status
      });

      if (!error) {
        setFoodItems(prev => prev.map(item => 
          item.id === editingItem.id 
            ? { ...editingItem, status }
            : item
        ));
        setEditingItem(null);
        alert('Item updated successfully!');
      } else {
        alert('Failed to update item');
      }
    }
  };

  const expiredItems = foodItems.filter(item => item.status === 'expired');
  const expiringItems = foodItems.filter(item => item.status === 'expiring');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold mb-4" style={{
          fontFamily: 'Playfair Display',
          color: '#FFD700',
          textShadow: '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.3)'
        }}>
          Food Expiry Logger & Smart Inventory
        </h2>
        <p className="text-xl" style={{ color: '#FFD700' }}>
          Track your food effortlessly and reduce waste with smart reminders
        </p>
      </div>

      {/* Weekly Points Status */}
      <div className="p-6 rounded-3xl border-2 mb-6" style={{
        background: '#1a2f24',
        borderColor: '#f2c94c',
        boxShadow: '0 8px 32px rgba(242, 201, 76, 0.2)'
      }}>
        <div className="flex items-center gap-3 mb-4">
          <Award size={24} style={{ color: weeklyStatus === 'good' ? '#FFD700' : '#eb5757' }} />
          <h3 className="text-2xl font-semibold" style={{ color: weeklyStatus === 'good' ? '#FFD700' : '#eb5757' }}>
            Weekly Status
          </h3>
        </div>
        <div className="text-center p-4 rounded-xl" style={{
          background: weeklyStatus === 'good' ? 'rgba(255, 215, 0, 0.2)' : 'rgba(235, 87, 87, 0.2)'
        }}>
          {weeklyStatus === 'good' ? (
            <p style={{ color: '#FFD700', fontSize: '18px', fontWeight: 'bold', textShadow: '0 0 10px rgba(255, 215, 0, 0.5)' }}>
              🎉 No expiry this week – You'll get 200 points!
            </p>
          ) : (
            <p style={{ color: '#eb5757', fontSize: '18px' }}>
              ❌ Expired items found – No bonus this week
            </p>
          )}
        </div>
      </div>

      {/* Notification Alerts */}
      {(expiredItems.length > 0 || expiringItems.length > 0) && (
        <div className="p-6 rounded-3xl border-2" style={{
          background: '#1a2f24',
          borderColor: '#f2c94c',
          boxShadow: '0 8px 32px rgba(242, 201, 76, 0.2)'
        }}>
          <div className="flex items-center gap-3 mb-4">
            <Bell className="text-yellow-400" size={24} style={{ filter: 'drop-shadow(0 0 8px #ffd86b)' }} />
            <h3 className="text-2xl font-semibold" style={{ color: '#f2c94c' }}>Expiry Alerts</h3>
          </div>
          {expiredItems.length > 0 && (
            <div className="mb-3 p-3 rounded-xl" style={{ background: 'rgba(235, 87, 87, 0.1)' }}>
              <p style={{ color: '#eb5757' }}>⚠️ {expiredItems.length} items have expired</p>
            </div>
          )}
          {expiringItems.length > 0 && (
            <div className="p-3 rounded-xl" style={{ background: 'rgba(242, 201, 76, 0.1)' }}>
              <p style={{ color: '#f2c94c' }}>⏰ {expiringItems.length} items expiring soon</p>
            </div>
          )}
        </div>
      )}

      {/* Smart Food Logging Panel */}
      <div className="p-8 rounded-3xl border-2" style={{
        background: '#11271d',
        borderColor: '#e3b645',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(227, 182, 69, 0.2)'
      }}>
        <h3 className="text-3xl font-bold mb-8 text-center" style={{
          fontFamily: 'Playfair Display',
          color: '#e3b645'
        }}>
          Add New Food Item
        </h3>

        {/* Manual Input Fields */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block mb-2 font-medium" style={{ color: '#e7c97b' }}>Food Name</label>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-4 rounded-2xl border-2 transition-all duration-300 focus:scale-105"
              style={{
                background: '#0f1f17',
                borderColor: '#eac14d',
                color: '#f3f3f3',
                fontFamily: 'Inter'
              }}
              placeholder="Enter Food Name (Example: Apple, Milk, Rice)"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium" style={{ color: '#e7c97b' }}>Expiry Date</label>
            <input
              type="date"
              value={newItem.expiryDate}
              onChange={(e) => setNewItem(prev => ({ ...prev, expiryDate: e.target.value }))}
              className="w-full p-4 rounded-2xl border-2 transition-all duration-300 focus:scale-105"
              style={{
                background: '#0f1f17',
                borderColor: '#eac14d',
                color: '#f3f3f3',
                fontFamily: 'Inter'
              }}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium" style={{ color: '#e7c97b' }}>Storage Location</label>
            <select
              value={newItem.storageLocation}
              onChange={(e) => setNewItem(prev => ({ ...prev, storageLocation: e.target.value }))}
              className="w-full p-4 rounded-2xl border-2 transition-all duration-300 focus:scale-105"
              style={{
                background: '#0f1f17',
                borderColor: '#eac14d',
                color: '#f3f3f3',
                fontFamily: 'Inter',
                boxShadow: '0 0 10px rgba(234, 193, 77, 0.3)'
              }}
            >
              {storageOptions.map(option => (
                <option key={option} value={option} style={{ background: '#0f1f17' }}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>



        {/* Save Button */}
        <div className="text-center">
          <button
            onClick={addFoodItem}
            className="px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105"
            style={{
              background: '#eac14d',
              color: '#0a1911',
              boxShadow: '0 8px 25px rgba(234, 193, 77, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#c99f28';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(201, 159, 40, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#eac14d';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(234, 193, 77, 0.4)';
            }}
          >
            Save Food Item
          </button>
        </div>
      </div>

      {/* Smart Inventory Shelf */}
      <div className="space-y-6">
        <h3 className="text-4xl font-bold text-center" style={{
          fontFamily: 'Playfair Display',
          color: '#e3b645'
        }}>
          Smart Inventory Shelf
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {foodItems.map((item, index) => {
            const statusInfo = getStatusInfo(item.status);
            const cardColors = [
              'from-purple-600 to-indigo-700 text-white',
              'from-blue-600 to-cyan-700 text-white', 
              'from-emerald-500 to-green-600 text-white',
              'from-green-600 to-teal-700 text-white',
              'from-yellow-500 to-orange-600 text-white',
              'from-red-600 to-pink-700 text-white',
              'from-indigo-600 to-purple-700 text-white',
              'from-orange-500 to-red-600 text-white',
              'from-teal-600 to-cyan-700 text-white',
              'from-violet-600 to-purple-700 text-white',
              'from-blue-800 to-indigo-900 text-white',
              'from-green-700 to-emerald-800 text-white',
              'from-pink-600 to-rose-700 text-white'
            ];
            const cardColor = cardColors[index % cardColors.length];
            
            return (
              <div
                key={item.id}
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
                <div className={`bg-gradient-to-r ${cardColor} p-4 text-center`}>
                  <div className="text-white mb-2">
                    <Calendar size={24} />
                  </div>
                  <span className="text-xs font-medium bg-white bg-opacity-20 px-2 py-1 rounded-full text-white">
                    {item.name}
                  </span>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#FFD700' }}>{item.name}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} style={{ color: '#E6C55F' }} />
                      <span className="text-sm" style={{ color: '#E6C55F' }}>{item.expiryDate}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin size={14} style={{ color: '#E6C55F' }} />
                      <span className="text-sm" style={{ color: '#E6C55F' }}>{item.storageLocation}</span>
                    </div>
                  </div>

                  <div className="text-center mb-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: statusInfo.color,
                        color: 'white',
                        boxShadow: `0 0 10px ${statusInfo.color}40`
                      }}
                    >
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="flex justify-center gap-2">
                    <button 
                      onClick={() => editFoodItem(item)}
                      className="p-2 rounded-lg transition-all duration-300 hover:scale-110" 
                      style={{
                        background: 'rgba(255, 215, 0, 0.2)',
                        color: '#FFD700',
                        border: '1px solid #FFD700'
                      }}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => deleteFoodItem(item.id)}
                      className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
                      style={{
                        background: 'rgba(235, 87, 87, 0.2)',
                        color: '#eb5757',
                        border: '1px solid #eb5757'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Food Waste Analysis */}
      <div className="p-6 rounded-3xl border-2" style={{
        background: '#11271d',
        borderColor: '#e3b645',
        boxShadow: '0 8px 32px rgba(227, 182, 69, 0.2)'
      }}>
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp size={24} style={{ color: '#e3b645' }} />
          <h3 className="text-2xl font-bold" style={{ color: '#e3b645' }}>🤖 AI Food Waste Analysis</h3>
        </div>
        <AIFoodWasteAnalysis foodItems={foodItems} />
      </div>

      {/* Expired Items & Tips Section */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Expired Items */}
        <div className="p-6 rounded-3xl" style={{
          background: '#11271d',
          border: '2px solid #eb5757'
        }}>
          <h4 className="text-2xl font-bold mb-4" style={{ color: '#eb5757' }}>Expired Items</h4>
          {expiredItems.length === 0 ? (
            <p style={{ color: '#e7c97b' }}>No expired items! 🎉</p>
          ) : (
            <div className="space-y-3">
              {expiredItems.map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 rounded-xl" style={{
                  background: 'rgba(235, 87, 87, 0.1)'
                }}>
                  <span style={{ color: '#f3f3f3' }}>{item.name}</span>
                  <button
                    onClick={() => deleteFoodItem(item.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Waste Prevention Tips */}
        <div className="p-6 rounded-3xl" style={{
          background: '#11271d',
          border: '2px solid #e3b645'
        }}>
          <h4 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: '#e3b645' }}>
            <Bot size={20} />
            🤖 AI Waste Prevention Tips
          </h4>
          <AIWastePreventionTips expiredItems={expiredItems} expiringItems={expiringItems} />
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="p-8 rounded-3xl border-2 max-w-md w-full mx-4" style={{
            background: '#11271d',
            borderColor: '#e3b645'
          }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold" style={{ color: '#e3b645' }}>Edit Food Item</h3>
              <button 
                onClick={() => setEditingItem(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium" style={{ color: '#e7c97b' }}>Food Name</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="w-full p-3 rounded-xl border-2"
                  style={{
                    background: '#0f1f17',
                    borderColor: '#eac14d',
                    color: '#f3f3f3'
                  }}
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium" style={{ color: '#e7c97b' }}>Expiry Date</label>
                <input
                  type="date"
                  value={editingItem.expiryDate}
                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, expiryDate: e.target.value } : null)}
                  className="w-full p-3 rounded-xl border-2"
                  style={{
                    background: '#0f1f17',
                    borderColor: '#eac14d',
                    color: '#f3f3f3'
                  }}
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium" style={{ color: '#e7c97b' }}>Storage Location</label>
                <select
                  value={editingItem.storageLocation}
                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, storageLocation: e.target.value } : null)}
                  className="w-full p-3 rounded-xl border-2"
                  style={{
                    background: '#0f1f17',
                    borderColor: '#eac14d',
                    color: '#f3f3f3'
                  }}
                >
                  {storageOptions.map(option => (
                    <option key={option} value={option} style={{ background: '#0f1f17' }}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setEditingItem(null)}
                className="flex-1 py-3 rounded-xl border-2"
                style={{
                  background: 'transparent',
                  borderColor: '#666',
                  color: '#ccc'
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveEditedItem}
                className="flex-1 py-3 rounded-xl font-semibold"
                style={{
                  background: '#eac14d',
                  color: '#0a1911'
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
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
    </div>
  );
};