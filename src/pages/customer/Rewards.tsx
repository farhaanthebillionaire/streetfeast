import { useState } from 'react';
import { CheckCircle2 as CheckCircleIcon, ArrowRight as ArrowRightIcon, X as XMarkIcon } from 'lucide-react';
import { motion } from 'framer-motion';

// Types
type Tier = {
  name: string;
  level: number;
  minPoints: number;
  color: string;
  benefits: string[];
};

type Reward = {
  id: number;
  name: string;
  description: string;
  points: number;
  validFor: string;
  image: string;
  category?: string;
};

// Mock data
const rewardsData = {
  points: 1250,
  currentTier: {
    name: 'Gold',
    level: 2,
    minPoints: 1000,
    color: 'bg-yellow-500',
    benefits: [
      '5% off all orders',
      'Free delivery over $15',
      'Exclusive offers',
      'Early access to new items'
    ],
  },
  tiers: [
    {
      name: 'Silver',
      level: 1,
      minPoints: 0,
      color: 'bg-gray-400',
      benefits: [
        '3% off all orders',
        'Free delivery over $20',
        'Basic support'
      ]
    },
    {
      name: 'Gold',
      level: 2,
      minPoints: 1000,
      color: 'bg-yellow-500',
      benefits: [
        '5% off all orders',
        'Free delivery over $15',
        'Exclusive offers',
        'Early access to new items'
      ]
    },
    {
      name: 'Platinum',
      level: 3,
      minPoints: 2250,
      color: 'bg-purple-600',
      benefits: [
        '10% off all orders',
        'Always free delivery',
        'Birthday reward',
        'Priority support',
        'Free item monthly'
      ]
    }
  ],
  nextTier: {
    name: 'Platinum',
    pointsNeeded: 1000,
    benefits: [
      '10% off all orders',
      'Always free delivery',
      'Birthday reward',
      'Priority support',
      'Free item monthly'
    ]
  },
  availableRewards: [
    {
      id: 1,
      name: 'Free Appetizer',
      description: 'With any order over $20',
      points: 300,
      validFor: '30 days',
      image: 'https://images.unsplash.com/photo-1541014741259-de529411b96a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60'
    },
    // More rewards...
  ],
  redeemedRewards: [
    {
      id: 101,
      rewardId: 1,
      name: 'Free Delivery',
      date: '2023-07-20',
      status: 'active',
      code: 'FREEDEL-7X9P2A'
    },
    // More redeemed rewards...
  ],
  pointsHistory: [
    { id: 1, date: '2023-07-25', description: 'Order #123', points: '+150', type: 'earned' },
    // More history...
  ]
};

const Rewards = () => {
  const [activeTab, setActiveTab] = useState<'rewards' | 'history'>('rewards');
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [showTierComparison, setShowTierComparison] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const { points, currentTier, nextTier, availableRewards, redeemedRewards, pointsHistory, tiers } = rewardsData;
  
  const pointsToNextTier = nextTier.pointsNeeded - (points - currentTier.minPoints);

  // Calculate progress to next tier
  const progress = Math.min(100, ((points - currentTier.minPoints) / nextTier.pointsNeeded) * 100);
  const nextTierData = tiers.find(tier => tier.level === currentTier.level + 1);
  
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Rewards</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Points and Tier Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center">
                  <div className={`${currentTier.color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                    {currentTier.name} Tier
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mt-3">{points.toLocaleString()}
                  <span className="text-base font-normal text-gray-500 ml-1">points</span>
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {pointsToNextTier} more points to reach <span className="font-medium">{nextTier.name} Tier</span>
                </p>
              </div>
              
              <div className="relative w-full md:w-1/3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Level {currentTier.level}</span>
                  <span>Level {nextTierData?.level || currentTier.level + 1}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    className={`h-full ${currentTier.color} rounded-full`}
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs">
                  <span className="text-gray-500">{currentTier.minPoints} pts</span>
                  <span className="text-gray-900 font-medium">{nextTier.pointsNeeded} pts</span>
                </div>
              </div>
            </div>
            
            {/* Tier benefits */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-gray-900">Your Benefits</h3>
                <button 
                  onClick={() => setShowTierComparison(!showTierComparison)}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
                >
                  {showTierComparison ? 'Hide comparison' : 'Compare tiers'}
                  <ArrowRightIcon className={`h-4 w-4 ml-1 transition-transform ${showTierComparison ? 'rotate-90' : ''}`} />
                </button>
              </div>
              
              {!showTierComparison ? (
                <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentTier.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Benefit</th>
                        {tiers.map((tier) => (
                          <th key={tier.name} className={`px-4 py-3 text-center text-xs font-medium ${tier.name === currentTier.name ? 'text-indigo-600' : 'text-gray-500'} uppercase tracking-wider`}>
                            {tier.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Array.from(new Set(tiers.flatMap(t => t.benefits))).map((benefit, i) => (
                        <tr key={i}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{benefit}</td>
                          {tiers.map((tier) => (
                            <td key={tier.name} className="px-4 py-3 whitespace-nowrap text-center">
                              {tier.benefits.includes(benefit) ? (
                                <CheckCircleIcon className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <XMarkIcon className="h-5 w-5 text-gray-300 mx-auto" />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('rewards')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'rewards' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Available Rewards
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My Rewards
            </button>
          </nav>
        </div>
        
        {/* Rewards Tab */}
        {activeTab === 'rewards' ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {availableRewards.map((reward) => (
              <div key={reward.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="h-40 bg-gray-200 overflow-hidden">
                  <img 
                    src={reward.image} 
                    alt={reward.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{reward.name}</h3>
                      <p className="text-sm text-gray-600">{reward.description}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {reward.points} pts
                    </span>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        setSelectedReward(reward);
                        setIsModalOpen(true);
                      }}
                      className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700"
                    >
                      Redeem Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* History Tab */
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">My Rewards</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {redeemedRewards.map((reward) => (
                  <div key={reward.id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-900">{reward.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        reward.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {reward.status === 'active' ? 'Active' : 'Used'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Code: {reward.code}</p>
                    <p className="text-xs text-gray-400 mt-2">Redeemed on {reward.date}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Points History</h2>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {pointsHistory.map((item) => (
                    <li key={item.id} className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.description}</p>
                          <p className="text-xs text-gray-500">{item.date}</p>
                        </div>
                        <span className={`text-sm font-medium ${
                          item.type === 'earned' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.points}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Redeem Modal */}
      {isModalOpen && selectedReward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Redeem Reward</h2>
              <p className="text-gray-600 mb-6">Are you sure you want to redeem <span className="font-medium">{selectedReward.name}</span> for <span className="font-medium">{selectedReward.points} points</span>?</p>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle redemption
                    setIsModalOpen(false);
                  }}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rewards;
