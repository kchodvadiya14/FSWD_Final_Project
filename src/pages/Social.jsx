import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  TrophyIcon,
  FireIcon,
  UsersIcon,
  ChartBarIcon,
  StarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const Social = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [leaderboard, setLeaderboard] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('week');

  const tabs = [
    { id: 'leaderboard', name: 'Leaderboard', icon: TrophyIcon },
    { id: 'challenges', name: 'Challenges', icon: FireIcon },
    { id: 'feed', name: 'Community Feed', icon: UsersIcon }
  ];

  const timeframes = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
    { value: 'all', label: 'All Time' }
  ];

  const categories = [
    { id: 'workouts', name: 'Most Workouts', icon: ChartBarIcon, unit: 'workouts' },
    { id: 'calories', name: 'Calories Burned', icon: FireIcon, unit: 'cal' },
    { id: 'streak', name: 'Longest Streak', icon: StarIcon, unit: 'days' },
    { id: 'goals', name: 'Goals Achieved', icon: TrophyIcon, unit: 'goals' }
  ];

  const [selectedCategory, setSelectedCategory] = useState('workouts');

  useEffect(() => {
    fetchData();
  }, [activeTab, timeframe, selectedCategory]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Mock data - in production, fetch from API
      if (activeTab === 'leaderboard') {
        setLeaderboard(generateMockLeaderboard());
      } else if (activeTab === 'challenges') {
        setChallenges(generateMockChallenges());
      } else if (activeTab === 'feed') {
        setPosts(generateMockPosts());
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const generateMockLeaderboard = () => {
    const users = [
      { id: 1, name: 'Alex Chen', avatar: '👨‍💼', value: 15, change: 2 },
      { id: 2, name: 'Sarah Johnson', avatar: '👩‍🦰', value: 12, change: -1 },
      { id: 3, name: 'Mike Rodriguez', avatar: '👨‍🚀', value: 11, change: 3 },
      { id: 4, name: 'Emma Wilson', avatar: '👩‍💻', value: 9, change: 0 },
      { id: 5, name: 'David Park', avatar: '👨‍🎓', value: 8, change: 1 },
      { id: user?.id || 6, name: user?.name || 'You', avatar: '😊', value: 6, change: 2, isCurrentUser: true }
    ];

    return users.sort((a, b) => b.value - a.value);
  };

  const generateMockChallenges = () => [
    {
      id: 1,
      title: '7-Day Workout Challenge',
      description: 'Complete at least one workout every day for 7 days',
      participants: 156,
      daysLeft: 3,
      progress: 4,
      total: 7,
      reward: '🏆 Champion Badge',
      joined: true
    },
    {
      id: 2,
      title: 'Burn 3000 Calories',
      description: 'Burn a total of 3000 calories this week',
      participants: 89,
      daysLeft: 5,
      progress: 1850,
      total: 3000,
      reward: '🔥 Fire Badge',
      joined: false
    },
    {
      id: 3,
      title: 'Morning Warrior',
      description: 'Complete 5 morning workouts before 8 AM',
      participants: 234,
      daysLeft: 7,
      progress: 2,
      total: 5,
      reward: '🌅 Early Bird Badge',
      joined: true
    }
  ];

  const generateMockPosts = () => [
    {
      id: 1,
      author: 'Sarah Johnson',
      avatar: '👩‍🦰',
      time: '2 hours ago',
      content: 'Just completed my first 5K run! The feeling is incredible. Thanks to everyone who motivated me to start! 🏃‍♀️💪',
      likes: 23,
      comments: 8,
      image: null,
      achievement: 'First 5K Run'
    },
    {
      id: 2,
      author: 'Mike Rodriguez',
      avatar: '👨‍🚀',
      time: '4 hours ago',
      content: 'Week 3 of my strength training program. Already seeing improvements! Consistency is key 💯',
      likes: 15,
      comments: 5,
      image: null,
      achievement: null
    },
    {
      id: 3,
      author: 'Emma Wilson',
      avatar: '👩‍💻',
      time: '1 day ago',
      content: 'Tried a new yoga routine today. Perfect for stress relief after long work days. Highly recommend! 🧘‍♀️',
      likes: 31,
      comments: 12,
      image: null,
      achievement: 'Zen Master'
    }
  ];

  const joinChallenge = (challengeId) => {
    setChallenges(challenges.map(challenge =>
      challenge.id === challengeId
        ? { ...challenge, joined: true, participants: challenge.participants + 1 }
        : challenge
    ));
    toast.success('Joined challenge successfully!');
  };

  const leaveChallenge = (challengeId) => {
    setChallenges(challenges.map(challenge =>
      challenge.id === challengeId
        ? { ...challenge, joined: false, participants: challenge.participants - 1 }
        : challenge
    ));
    toast.success('Left challenge');
  };

  const likePost = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const renderLeaderboard = () => (
    <div className="space-y-6">
      {/* Category and Timeframe Filters */}
      <div className="flex flex-wrap gap-4 justify-between">
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm"
        >
          {timeframes.map((tf) => (
            <option key={tf.value} value={tf.value}>
              {tf.label}
            </option>
          ))}
        </select>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <TrophyIcon className="h-5 w-5 text-yellow-500" />
            {categories.find(c => c.id === selectedCategory)?.name} - {timeframes.find(t => t.value === timeframe)?.label}
          </h3>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {leaderboard.map((user, index) => (
              <div
                key={user.id}
                className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                  user.isCurrentUser ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-50 text-gray-500'
                  }`}>
                    {index < 3 ? (index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉') : `#${index + 1}`}
                  </div>
                  <div className="text-2xl">{user.avatar}</div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {user.name}
                      {user.isCurrentUser && <span className="text-indigo-600 ml-2">(You)</span>}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>
                        {user.value} {categories.find(c => c.id === selectedCategory)?.unit}
                      </span>
                      {user.change !== 0 && (
                        <div className={`flex items-center gap-1 ${
                          user.change > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {user.change > 0 ? (
                            <ArrowUpIcon className="h-3 w-3" />
                          ) : (
                            <ArrowDownIcon className="h-3 w-3" />
                          )}
                          <span>{Math.abs(user.change)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderChallenges = () => (
    <div className="space-y-6">
      <div className="grid gap-6">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{challenge.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{challenge.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <UsersIcon className="h-4 w-4" />
                    {challenge.participants} participants
                  </div>
                  <div className="flex items-center gap-1">
                    <FireIcon className="h-4 w-4" />
                    {challenge.daysLeft} days left
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">{challenge.reward.split(' ')[0]}</div>
                <div className="text-xs text-gray-500">{challenge.reward.split(' ').slice(1).join(' ')}</div>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-600">
                  {challenge.progress} / {challenge.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-end">
              {challenge.joined ? (
                <button
                  onClick={() => leaveChallenge(challenge.id)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Leave Challenge
                </button>
              ) : (
                <button
                  onClick={() => joinChallenge(challenge.id)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Join Challenge
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFeed = () => (
    <div className="space-y-6">
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Post Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl">{post.avatar}</div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">{post.author}</div>
              <div className="text-sm text-gray-500">{post.time}</div>
            </div>
            {post.achievement && (
              <div className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                🏆 {post.achievement}
              </div>
            )}
          </div>

          {/* Post Content */}
          <p className="text-gray-700 mb-4">{post.content}</p>

          {/* Post Actions */}
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <button
              onClick={() => likePost(post.id)}
              className="flex items-center gap-2 hover:text-red-500 transition-colors"
            >
              <HeartIcon className="h-4 w-4" />
              {post.likes}
            </button>
            <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
              <ChatBubbleLeftIcon className="h-4 w-4" />
              {post.comments}
            </button>
            <button className="flex items-center gap-2 hover:text-gray-700 transition-colors">
              <EyeIcon className="h-4 w-4" />
              View
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Community</h1>
        <p className="text-gray-600 mt-2">Connect, compete, and celebrate with fellow fitness enthusiasts</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'leaderboard' && renderLeaderboard()}
      {activeTab === 'challenges' && renderChallenges()}
      {activeTab === 'feed' && renderFeed()}
    </div>
  );
};

export default Social;