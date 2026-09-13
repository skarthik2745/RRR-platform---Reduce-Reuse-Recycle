import React, { useState } from 'react';
import { Trophy, Camera, CheckCircle, Calendar, Upload } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export const WeeklyChallenges: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null);
  const [proofPhoto, setProofPhoto] = useState('');
  const [proofDescription, setProofDescription] = useState('');

  const challenges = [
    {
      id: 1,
      title: 'No Plastic Week',
      description: 'Use zero plastic for 7 days',
      week: 1,
      difficulty: 'Hard',
      badge: '🚫🥤'
    },
    {
      id: 2,
      title: 'Zero Food Waste Week',
      description: 'Plan meals to avoid any food waste',
      week: 2,
      difficulty: 'Medium',
      badge: '🍽️♻️'
    },
    {
      id: 3,
      title: 'Bicycle Week',
      description: 'Use bicycle or walk instead of bike/car',
      week: 3,
      difficulty: 'Medium',
      badge: '🚲🌱'
    },
    {
      id: 4,
      title: 'Plant a Sapling',
      description: 'Plant a sapling and upload photo',
      week: 4,
      difficulty: 'Easy',
      badge: '🌱🌳'
    },
    {
      id: 5,
      title: 'Reuse Challenge',
      description: 'Sell or give away 1 old item',
      week: 5,
      difficulty: 'Easy',
      badge: '♻️💝'
    },
    {
      id: 6,
      title: 'Cold Water Challenge',
      description: '5-minute cold water shower challenge',
      week: 6,
      difficulty: 'Hard',
      badge: '🚿❄️'
    },
    {
      id: 7,
      title: 'Stairs Week',
      description: 'Avoid lift and use stairs for the entire week',
      week: 7,
      difficulty: 'Medium',
      badge: '🏃‍♂️📈'
    },
    {
      id: 8,
      title: 'Reusable Bottle Week',
      description: 'Carry reusable water bottle everywhere',
      week: 8,
      difficulty: 'Easy',
      badge: '💧♻️'
    }
  ];

  const currentWeek = Math.ceil(new Date().getDate() / 7);
  const currentChallenge = challenges.find(c => c.week === currentWeek) || challenges[0];

  const completedChallenges = user?.challengeHistory?.filter(c => c.completed) || [];
  const isCurrentChallengeCompleted = completedChallenges.some(c => c.id === currentChallenge.id.toString());

  const handleSubmitProof = () => {
    if (!user || !proofDescription) return;

    const newChallenge = {
      id: currentChallenge.id.toString(),
      title: currentChallenge.title,
      description: currentChallenge.description,
      week: currentChallenge.week,
      completed: true,
      proof: {
        photo: proofPhoto || 'Photo uploaded',
        description: proofDescription
      }
    };

    const updatedHistory = [...(user.challengeHistory || []), newChallenge];
    const updatedBadges = [...(user.ecoBadges || []), currentChallenge.badge];

    updateUser({
      challengeHistory: updatedHistory,
      ecoBadges: updatedBadges
    });

    setProofPhoto('');
    setProofDescription('');
    setSelectedChallenge(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProofPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Weekly Eco-Challenges</h2>
        <p className="text-gray-600 mb-6">
          Complete weekly challenges to earn eco badges and make a positive impact!
        </p>
      </div>

      {/* Current Week Challenge */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Calendar className="text-green-600 mr-3" size={24} />
            <h3 className="text-xl font-semibold text-gray-800">Week {currentWeek} Challenge</h3>
          </div>
          <span className="text-2xl">{currentChallenge.badge}</span>
        </div>
        
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">{currentChallenge.title}</h4>
          <p className="text-gray-600 mb-2">{currentChallenge.description}</p>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            currentChallenge.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
            currentChallenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {currentChallenge.difficulty}
          </span>
        </div>

        {isCurrentChallengeCompleted ? (
          <div className="flex items-center text-green-600">
            <CheckCircle className="mr-2" size={20} />
            <span className="font-medium">Challenge Completed! 🎉</span>
          </div>
        ) : (
          <button
            onClick={() => setSelectedChallenge(currentChallenge.id)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 flex items-center"
          >
            <Camera className="mr-2" size={16} />
            Submit Proof
          </button>
        )}
      </div>

      {/* Proof Submission Modal */}
      {selectedChallenge && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Submit Challenge Proof</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Photo
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full"
                />
                <p className="text-sm text-gray-500 mt-1">Upload a photo showing your challenge completion</p>
                {proofPhoto && (
                  <div className="mt-2">
                    <img src={proofPhoto} alt="Proof" className="w-20 h-20 object-cover rounded" />
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={proofDescription}
                onChange={(e) => setProofDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Describe how you completed the challenge..."
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleSubmitProof}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 flex items-center"
              >
                <Upload className="mr-2" size={16} />
                Submit
              </button>
              <button
                onClick={() => setSelectedChallenge(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Challenge History */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Eco Badges</h3>
        {user?.ecoBadges && user.ecoBadges.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-6">
            {user.ecoBadges.map((badge, index) => (
              <span key={index} className="text-2xl bg-white border border-gray-200 rounded-lg p-3">
                {badge}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mb-6">Complete challenges to earn your first eco badge!</p>
        )}
      </div>

      {/* All Challenges */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">All Challenges</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map((challenge) => {
            const isCompleted = completedChallenges.some(c => c.id === challenge.id.toString());
            return (
              <div key={challenge.id} className={`border rounded-lg p-4 ${
                isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Week {challenge.week}</span>
                  <span className="text-xl">{challenge.badge}</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">{challenge.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                {isCompleted && (
                  <div className="flex items-center text-green-600 text-sm">
                    <Trophy className="mr-1" size={14} />
                    Completed
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};