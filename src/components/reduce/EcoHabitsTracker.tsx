import React, { useState, useEffect } from 'react';
import { CheckCircle, Target, TrendingUp, Calendar, Star } from 'lucide-react';

interface EcoHabit {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  streak: number;
  category: string;
}

export const EcoHabitsTracker: React.FC = () => {
  const [currentHabits, setCurrentHabits] = useState<EcoHabit[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [completedHabits, setCompletedHabits] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);

  const allHabits: Omit<EcoHabit, 'id' | 'completed' | 'streak'>[] = [
    { title: 'Turn off lights when leaving room', description: 'Save energy by switching off lights', points: 5, category: 'Energy' },
    { title: 'Carry reusable water bottle', description: 'Avoid single-use plastic bottles', points: 10, category: 'Plastic-Free' },
    { title: 'Avoid tissue usage', description: 'Use cloth napkins instead of tissues', points: 8, category: 'Waste' },
    { title: 'Use natural light during day', description: 'Keep curtains open for natural lighting', points: 5, category: 'Energy' },
    { title: 'Reduce screen brightness', description: 'Lower device brightness to save battery', points: 5, category: 'Energy' },
    { title: 'Compost wet waste', description: 'Turn organic waste into fertilizer', points: 15, category: 'Waste' },
    { title: 'Use stairs instead of elevator', description: 'Choose stairs for 1-3 floors', points: 8, category: 'Health' },
    { title: 'Unplug chargers when not in use', description: 'Prevent phantom energy consumption', points: 5, category: 'Energy' },
    { title: 'Use both sides of paper', description: 'Maximize paper usage efficiency', points: 8, category: 'Waste' },
    { title: 'Take shorter showers', description: 'Limit shower time to 5 minutes', points: 10, category: 'Water' },
    { title: 'Use public transport', description: 'Choose bus/train over private vehicle', points: 15, category: 'Transport' },
    { title: 'Eat plant-based meals', description: 'Include more vegetables in diet', points: 12, category: 'Food' },
    { title: 'Use reusable shopping bags', description: 'Bring cloth bags when shopping', points: 8, category: 'Plastic-Free' },
    { title: 'Air dry clothes', description: 'Use natural drying instead of dryer', points: 10, category: 'Energy' },
    { title: 'Turn off tap while brushing', description: 'Save water during daily routines', points: 5, category: 'Water' },
    { title: 'Use cold water for washing', description: 'Wash clothes in cold water', points: 8, category: 'Energy' },
    { title: 'Walk for short distances', description: 'Walk instead of driving for nearby trips', points: 10, category: 'Transport' },
    { title: 'Use natural cleaning products', description: 'Choose eco-friendly cleaners', points: 12, category: 'Health' },
    { title: 'Reduce food waste', description: 'Plan meals and use leftovers', points: 15, category: 'Food' },
    { title: 'Use programmable thermostat', description: 'Optimize heating and cooling', points: 15, category: 'Energy' },
    { title: 'Choose digital receipts', description: 'Opt for email receipts', points: 5, category: 'Digital' },
    { title: 'Use refillable containers', description: 'Bring containers for bulk purchases', points: 10, category: 'Plastic-Free' },
    { title: 'Practice mindful consumption', description: 'Think before buying new items', points: 15, category: 'Mindfulness' },
    { title: 'Use energy-efficient appliances', description: 'Choose ENERGY STAR products', points: 20, category: 'Energy' },
    { title: 'Collect rainwater', description: 'Use rainwater for plants', points: 15, category: 'Water' },
    { title: 'Use bamboo products', description: 'Replace plastic with bamboo alternatives', points: 12, category: 'Plastic-Free' },
    { title: 'Support local businesses', description: 'Buy from local eco-friendly stores', points: 15, category: 'Community' },
    { title: 'Use natural pest control', description: 'Avoid chemical pesticides', points: 12, category: 'Gardening' },
    { title: 'Practice zero waste cooking', description: 'Use all parts of ingredients', points: 18, category: 'Food' },
    { title: 'Use solar chargers', description: 'Charge devices with solar power', points: 20, category: 'Energy' },
    { title: 'Choose sustainable fashion', description: 'Buy second-hand or eco-friendly clothes', points: 15, category: 'Fashion' },
    { title: 'Use natural beauty products', description: 'Choose organic cosmetics', points: 12, category: 'Health' },
    { title: 'Practice water conservation', description: 'Fix leaks and use water-saving devices', points: 15, category: 'Water' },
    { title: 'Use green transportation', description: 'Bike, walk, or use electric vehicles', points: 18, category: 'Transport' },
    { title: 'Support renewable energy', description: 'Choose green energy providers', points: 25, category: 'Energy' },
    { title: 'Use eco-friendly packaging', description: 'Choose products with minimal packaging', points: 10, category: 'Packaging' },
    { title: 'Practice sustainable gardening', description: 'Use organic methods and native plants', points: 20, category: 'Gardening' },
    { title: 'Use natural air fresheners', description: 'Essential oils instead of sprays', points: 8, category: 'Health' },
    { title: 'Support conservation efforts', description: 'Donate to environmental organizations', points: 25, category: 'Activism' },
    { title: 'Use biodegradable products', description: 'Choose items that break down naturally', points: 15, category: 'Products' },
    { title: 'Practice green computing', description: 'Use energy-efficient computer settings', points: 10, category: 'Technology' },
    { title: 'Use natural fabric softeners', description: 'Use vinegar or wool dryer balls', points: 8, category: 'Laundry' },
    { title: 'Choose sustainable gifts', description: 'Give experiences or eco-friendly presents', points: 15, category: 'Gifts' },
    { title: 'Use green cleaning tools', description: 'Choose sustainable cleaning equipment', points: 10, category: 'Cleaning' },
    { title: 'Practice mindful water use', description: 'Be conscious of every drop', points: 10, category: 'Water' },
    { title: 'Use sustainable office supplies', description: 'Choose eco-friendly work materials', points: 12, category: 'Office' },
    { title: 'Support environmental education', description: 'Learn and teach about sustainability', points: 15, category: 'Education' },
    { title: 'Use natural food preservation', description: 'Avoid chemical preservatives', points: 12, category: 'Food' },
    { title: 'Practice sustainable tourism', description: 'Choose eco-friendly travel options', points: 20, category: 'Travel' },
    { title: 'Use eco-friendly pet products', description: 'Choose sustainable pet supplies', points: 12, category: 'Pets' }
  ];

  const getRandomHabits = () => {
    const shuffled = [...allHabits].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5).map((habit, index) => ({
      ...habit,
      id: `${Date.now()}-${index}`,
      completed: false,
      streak: 0
    }));
  };

  useEffect(() => {
    setCurrentHabits(getRandomHabits());
  }, []);

  const completeHabit = (habitId: string) => {
    setCurrentHabits(prev => 
      prev.map(habit => 
        habit.id === habitId 
          ? { ...habit, completed: true, streak: habit.streak + 1 }
          : habit
      )
    );
    
    const habit = currentHabits.find(h => h.id === habitId);
    if (habit && !habit.completed) {
      setTotalPoints(prev => prev + habit.points);
      setCompletedHabits(prev => prev + 1);
    }
  };

  const loadNewHabits = () => {
    const allCompleted = currentHabits.every(h => h.completed);
    if (allCompleted) {
      setCurrentHabits(getRandomHabits());
      setCurrentStreak(prev => prev + 1);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Energy': 'yellow',
      'Water': 'blue',
      'Transport': 'purple',
      'Food': 'orange',
      'Waste': 'teal',
      'Plastic-Free': 'emerald',
      'Health': 'pink',
      'Digital': 'cyan',
      'Mindfulness': 'indigo'
    };
    return colors[category] || 'gray';
  };

  const completionPercentage = (completedHabits / currentHabits.length) * 100;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Eco Habits Tracker</h2>
          <p className="text-gray-600">Build sustainable habits one step at a time</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-4 py-2 rounded-xl">
            <div className="flex items-center">
              <Star className="mr-2" size={20} />
              <span className="font-bold">{totalPoints} Points</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-2 rounded-xl">
            <div className="flex items-center">
              <TrendingUp className="mr-2" size={20} />
              <span className="font-bold">{currentStreak} Streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Today's Progress</h3>
            <Target className="text-green-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">{completedHabits}/5</div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Total Points</h3>
            <Star className="text-yellow-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-yellow-600">{totalPoints}</div>
          <p className="text-sm text-gray-500">Lifetime earned</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Current Streak</h3>
            <Calendar className="text-purple-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-purple-600">{currentStreak}</div>
          <p className="text-sm text-gray-500">Sets completed</p>
        </div>
      </div>

      {/* Current Habits */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentHabits.map((habit) => (
          <div
            key={habit.id}
            className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${
              habit.completed ? 'ring-2 ring-green-400' : ''
            }`}
          >
            <div className={`bg-gradient-to-r from-${getCategoryColor(habit.category)}-400 to-${getCategoryColor(habit.category)}-500 p-4`}>
              <div className="flex justify-between items-center">
                <span className="text-white text-xs font-medium bg-white bg-opacity-20 px-2 py-1 rounded-full">
                  {habit.category}
                </span>
                <div className="flex items-center text-white">
                  <Star className="mr-1" size={16} />
                  <span className="font-bold">{habit.points} pts</span>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{habit.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{habit.description}</p>
              
              {habit.streak > 0 && (
                <div className="flex items-center text-sm text-orange-600 mb-3">
                  <TrendingUp size={14} className="mr-1" />
                  <span>{habit.streak} day streak</span>
                </div>
              )}
              
              <button
                onClick={() => completeHabit(habit.id)}
                disabled={habit.completed}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                  habit.completed
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:shadow-lg'
                }`}
              >
                {habit.completed ? (
                  <>
                    <CheckCircle className="mr-2" size={16} />
                    Completed!
                  </>
                ) : (
                  <>
                    <Target className="mr-2" size={16} />
                    Mark Complete
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load New Habits */}
      {currentHabits.every(h => h.completed) && (
        <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6 text-center">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">All Habits Completed!</h3>
          <p className="text-gray-600 mb-4">
            Great job! You've completed all 5 habits. Ready for the next set?
          </p>
          <button
            onClick={loadNewHabits}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200"
          >
            Load Next 5 Habits
          </button>
        </div>
      )}
    </div>
  );
};