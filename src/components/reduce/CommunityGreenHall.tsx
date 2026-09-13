import React, { useState, useEffect } from 'react';
import { Search, Plus, Bell, User, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Filter, Award } from 'lucide-react';
import { getGreenHallPosts, createGreenHallPost, getUserGreenHallPosts, updateGreenHallPost, deleteGreenHallPost } from '../../lib/database';
import { getCurrentUser } from '../../lib/auth';

interface Post {
  id: string;
  username: string;
  avatar: string;
  timeAgo: string;
  text: string;
  image: string;
  likes: number;
  comments: Comment[];
  isLiked: boolean;
  isSaved: boolean;
  ecoPoints: number;
  hashtags: string[];
  pointsGiven?: { [userId: string]: number };
}

interface Comment {
  id: string;
  username: string;
  text: string;
  timeAgo: string;
}

interface Story {
  id: string;
  title: string;
  image: string;
  isViewed: boolean;
}

export const CommunityGreenHall: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showComments, setShowComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newPost, setNewPost] = useState({ images: [] as string[], caption: '', hashtags: '' });
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState<string | null>(null);
  const [pointsMessage, setPointsMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [notifications] = useState([
    { id: '1', type: 'like', username: '@green_friend', message: 'liked your post', timeAgo: '2h ago' },
    { id: '2', type: 'comment', username: '@eco_warrior', message: 'commented on your post', timeAgo: '3h ago' }
  ]);

  const stories: Story[] = [
    { id: '1', title: 'My Eco Day', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=100&h=100&fit=crop', isViewed: false },
    { id: '2', title: 'Plastic-Free', image: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=100&h=100&fit=crop', isViewed: true },
    { id: '3', title: 'Bike Commute', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop', isViewed: false },
    { id: '4', title: 'Tree Planting', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=100&fit=crop', isViewed: true },
    { id: '5', title: 'Solar Power', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=100&h=100&fit=crop', isViewed: false }
  ];

  const [posts, setPosts] = useState<Post[]>([]);
  
  useEffect(() => {
    const loadUserAndPosts = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
      
      const { data, error } = await getGreenHallPosts();
      if (data) {
        const formattedPosts = data.map((post: any) => ({
          id: post.id,
          username: post.profiles?.username || 'Anonymous',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
          timeAgo: new Date(post.created_at).toLocaleDateString(),
          text: post.content,
          image: post.image_url || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
          likes: post.likes_count || 0,
          comments: [],
          isLiked: false,
          isSaved: false,
          ecoPoints: post.points_received || 0,
          hashtags: ['#EcoFriendly'],
          pointsGiven: {}
        }));
        setPosts(formattedPosts);
      }
    };
    
    loadUserAndPosts();
  }, []);

  const filters = ['All', '#Electricity', '#PlasticFree', '#WaterSaving', '#FoodWasteReduction', '#TreePlanting'];

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleSave = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, isSaved: !post.isSaved } : post
    ));
  };

  const handleComment = (postId: string) => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      username: '@you',
      text: newComment,
      timeAgo: 'now'
    };

    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, comment] }
        : post
    ));
    
    setNewComment('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setNewPost(prev => ({ ...prev, images: [...prev.images, result] }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setNewPost(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const givePoints = (postId: string, points: number) => {
    const post = posts.find(p => p.id === postId);
    if (!post || post.username === '@you') {
      alert('You cannot give points to your own posts!');
      return;
    }
    
    const currentUser = '@you';
    const today = new Date().toDateString();
    const pointsKey = `${currentUser}_${postId}_${today}`;
    
    if (localStorage.getItem(pointsKey)) {
      alert('You can only give points once per post per day!');
      return;
    }
    
    // Add points to post creator's total
    const currentPoints = parseInt(localStorage.getItem('userTotalPoints') || '0');
    const newTotal = currentPoints + points;
    localStorage.setItem('userTotalPoints', newTotal.toString());
    
    // Mark as given
    localStorage.setItem(pointsKey, 'true');
    
    // Update post
    setPosts(prev => prev.map(p => 
      p.id === postId 
        ? { ...p, pointsGiven: { ...p.pointsGiven, [currentUser]: points } }
        : p
    ));
    
    setPointsMessage(`You awarded ${points} points to ${post.username}`);
    setShowPointsModal(null);
    setTimeout(() => setPointsMessage(''), 3000);
  };

  const handleCreatePost = async () => {
    if (!newPost.caption.trim() || !currentUser) return;
    
    const { data, error } = await createGreenHallPost({
      user_id: currentUser.id,
      content: newPost.caption,
      image_url: newPost.images[0] || null,
      points_received: 0,
      likes_count: 0
    });
    
    if (data && data.length > 0) {
      const hashtags = newPost.hashtags.split(' ').filter(tag => tag.startsWith('#'));
      
      const post: Post = {
        id: data[0].id,
        username: currentUser.user_metadata?.full_name || 'You',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
        timeAgo: 'now',
        text: newPost.caption,
        image: newPost.images[0] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
        likes: 0,
        comments: [],
        isLiked: false,
        isSaved: false,
        ecoPoints: 0,
        hashtags: hashtags.length ? hashtags : ['#EcoFriendly'],
        pointsGiven: {}
      };

      setPosts(prev => [post, ...prev]);
    } else {
      console.error('Failed to create post - no data returned');
      alert('Failed to create post. Please try again.');
    }
    
    setNewPost({ images: [], caption: '', hashtags: '' });
    setShowCreatePost(false);
  };

  const filteredPosts = selectedFilter === 'All' 
    ? posts 
    : posts.filter(post => post.hashtags.includes(selectedFilter));



  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, rgba(45, 80, 22, 0.1) 0%, rgba(45, 80, 22, 0.05) 100%)' }}>
      {/* Top Navigation */}
      <div className="sticky top-0 z-50 backdrop-blur-md border-b" style={{ background: 'rgba(45, 80, 22, 0.95)', borderColor: 'rgba(255, 215, 0, 0.3)' }}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center" style={{ color: '#FFD700', fontFamily: 'Poppins' }}>
              🌿 Green Hall – Eco Activity Feed
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#FFD700' }} size={18} />
                <input 
                  type="text" 
                  placeholder="Search eco posts..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-full border-2 focus:outline-none transition-all"
                  style={{ borderColor: '#FFD700', background: 'rgba(45, 80, 22, 0.1)', color: '#FFD700', boxShadow: '0 0 0 2px rgba(255, 215, 0, 0.3)' }}
                />
              </div>
              <button 
                onClick={() => setShowCreatePost(true)}
                className="p-2 rounded-full transition-all hover:scale-110" 
                style={{ background: 'linear-gradient(135deg, #B8860B, #DAA520)', color: 'white', boxShadow: '0 0 0 2px #FFD700' }}
              >
                <Plus size={20} />
              </button>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full transition-all hover:scale-110 relative" 
                style={{ background: 'linear-gradient(135deg, #B8860B, #DAA520)', color: 'white', boxShadow: '0 0 0 2px #FFD700' }}
              >
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              </button>
              <button 
                onClick={async () => {
                  if (currentUser) {
                    const { data } = await getUserGreenHallPosts(currentUser.id);
                    if (data) {
                      const formattedPosts = data.map((post: any) => ({
                        id: post.id,
                        username: 'You',
                        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
                        timeAgo: new Date(post.created_at).toLocaleDateString(),
                        text: post.content,
                        image: post.image_url || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
                        likes: post.likes_count || 0,
                        comments: [],
                        isLiked: false,
                        isSaved: false,
                        ecoPoints: post.points_received || 0,
                        hashtags: ['#EcoFriendly'],
                        pointsGiven: {}
                      }));
                      setMyPosts(formattedPosts);
                    }
                  }
                  setShowMyPosts(true);
                }}
                className="p-2 rounded-full transition-all hover:scale-110" 
                style={{ background: 'linear-gradient(135deg, #4B0082, #6A0DAD)', color: 'white', boxShadow: '0 0 0 2px #FFD700' }}
                title="My Posts"
              >
                📝
              </button>
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className="p-2 rounded-full transition-all hover:scale-110" 
                style={{ background: 'linear-gradient(135deg, #B8860B, #DAA520)', color: 'white', boxShadow: '0 0 0 2px #FFD700' }}
              >
                <User size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Stories Section */}
        <div className="mb-8">
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {stories.map((story) => (
              <div 
                key={story.id} 
                className="flex-shrink-0 text-center cursor-pointer group"
                onClick={() => alert(`Viewing ${story.title} story`)}
              >
                <div className={`w-16 h-16 rounded-full p-1 transition-all group-hover:scale-110 ${
                  story.isViewed ? 'bg-gray-300' : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                }`}>
                  <img 
                    src={story.image} 
                    alt={story.title}
                    className="w-full h-full rounded-full object-cover border-2 border-white"
                  />
                </div>
                <p className="text-xs mt-2 font-medium" style={{ color: '#FFD700' }}>{story.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <Filter size={18} style={{ color: '#FFD700' }} />
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap hover:scale-105`}
                style={{
                  background: selectedFilter === filter 
                    ? 'linear-gradient(135deg, #B8860B, #DAA520)' 
                    : 'rgba(45, 80, 22, 0.1)',
                  border: '2px solid #FFD700',
                  color: selectedFilter === filter ? 'white' : '#FFD700'
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Profile Header */}
        {showProfile && (
          <div className="mb-6 p-6 rounded-xl" style={{ background: 'rgba(45, 80, 22, 0.2)', border: '2px solid #FFD700' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" 
                  alt="Your Profile" 
                  className="w-20 h-20 rounded-full border-4" 
                  style={{ borderColor: '#FFD700' }}
                />
                <div className="ml-4">
                  <h2 className="text-2xl font-bold" style={{ color: '#FFD700' }}>@you</h2>
                  <p style={{ color: '#E6C55F' }}>{myPosts.length} posts • Eco Warrior</p>
                </div>
              </div>
              <button 
                onClick={() => setShowProfile(false)}
                className="px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                style={{ background: 'rgba(255, 215, 0, 0.2)', color: '#FFD700', border: '2px solid #FFD700' }}
              >
                Back to Feed
              </button>
            </div>
          </div>
        )}

        {showMyPosts && (
          <div className="text-center mb-6">
            <button
              onClick={() => setShowMyPosts(false)}
              className="px-4 py-2 rounded-lg" 
              style={{ background: 'rgba(255, 215, 0, 0.2)', color: '#FFD700', border: '1px solid #FFD700' }}
            >
              ← Back to All Posts
            </button>
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-6">
          {(showMyPosts ? myPosts : showProfile ? posts.filter(p => p.username === '@you') : filteredPosts).map((post) => (
            <div 
              key={post.id} 
              className="rounded-3xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
              style={{ 
                background: 'rgba(45, 80, 22, 0.2)', 
                boxShadow: '0 0 0 2px #FFD700, 0 8px 32px rgba(255, 215, 0, 0.3)',
                border: '2px solid #FFD700'
              }}
            >
              {/* Post Header */}
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center">
                  <img 
                    src={post.avatar} 
                    alt={post.username}
                    className="w-12 h-12 rounded-full object-cover border-2"
                    style={{ borderColor: '#FFD700', boxShadow: '0 0 0 2px rgba(255, 215, 0, 0.5)' }}
                  />
                  <div className="ml-4">
                    <h3 className="font-bold text-lg" style={{ color: '#FFD700', fontFamily: 'Poppins' }}>
                      {post.username}
                    </h3>
                    <p className="text-sm" style={{ color: '#E6C55F' }}>{post.timeAgo}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Total Points Display */}
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{
                    background: 'rgba(255, 215, 0, 0.2)',
                    border: '1px solid #FFD700'
                  }}>
                    <Award size={14} style={{ color: '#FFD700' }} />
                    <span className="text-sm font-bold" style={{ color: '#FFD700' }}>
                      {Object.values(post.pointsGiven || {}).reduce((sum, points) => sum + points, 0)} pts
                    </span>
                  </div>
                  
                  {/* Give Points Button */}
                  {post.username !== '@you' && (
                    <button
                      onClick={() => setShowPointsModal(post.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:scale-105"
                      style={{
                        background: 'linear-gradient(135deg, #B8860B, #DAA520)',
                        color: 'white',
                        boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                      }}
                    >
                      <Award size={16} />
                      <span className="font-medium">Give Points</span>
                    </button>
                  )}
                </div>

              </div>

              {/* Post Content */}
              <div className="px-6 pb-4">
                <p className="text-lg leading-relaxed mb-4" style={{ fontFamily: 'Inter', color: '#E6C55F' }}>
                  {post.text}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.hashtags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:scale-105 transition-all"
                      style={{ background: 'rgba(255, 215, 0, 0.2)', color: '#FFD700', border: '1px solid #FFD700' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Post Image */}
              <div className="relative">
                <img 
                  src={post.image} 
                  alt="Post content"
                  className="w-full h-96 object-cover"
                />
              </div>

              {/* Post Actions */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-6">
                    {showMyPosts && (
                      <>
                        <button
                          onClick={() => {
                            setEditingPost(post);
                            setNewPost({ images: [post.image], caption: post.text, hashtags: post.hashtags.join(' ') });
                            setShowCreatePost(true);
                          }}
                          className="flex items-center space-x-2 transition-all hover:scale-110"
                          style={{ color: '#22C55E' }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm('Delete this post?')) {
                              const { error } = await deleteGreenHallPost(post.id);
                              if (!error) {
                                setMyPosts(myPosts.filter(p => p.id !== post.id));
                              }
                            }
                          }}
                          className="flex items-center space-x-2 transition-all hover:scale-110"
                          style={{ color: '#EF4444' }}
                        >
                          🗑️ Delete
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => handleLike(post.id)}
                      className="flex items-center space-x-2 transition-all hover:scale-110"
                    >
                      <Heart 
                        size={24} 
                        fill={post.isLiked ? '#E63946' : 'none'}
                        style={{ color: post.isLiked ? '#E63946' : '#FFD700' }}
                      />
                      <span className="font-bold" style={{ color: '#FFD700' }}>{post.likes}</span>
                    </button>
                    <button 
                      onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                      className="flex items-center space-x-2 transition-all hover:scale-110"
                    >
                      <MessageCircle size={24} style={{ color: '#FFD700' }} />
                      <span className="font-bold" style={{ color: '#FFD700' }}>{post.comments.length}</span>
                    </button>
                    <button 
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: `${post.username}'s eco post`,
                            text: post.text,
                            url: window.location.href
                          }).catch(() => {
                            navigator.clipboard.writeText(`Check out this eco post: ${post.text}`);
                            alert('Link copied to clipboard!');
                          });
                        } else {
                          navigator.clipboard.writeText(`Check out this eco post: ${post.text}`);
                          alert('Link copied to clipboard!');
                        }
                      }}
                      className="transition-all hover:scale-110"
                    >
                      <Share2 size={24} style={{ color: '#FFD700' }} />
                    </button>
                  </div>
                  <button 
                    onClick={() => handleSave(post.id)}
                    className="transition-all hover:scale-110"
                  >
                    <Bookmark 
                      size={24} 
                      fill={post.isSaved ? '#FFD700' : 'none'}
                      style={{ color: '#FFD700' }}
                    />
                  </button>
                </div>

                {/* Comments Preview */}
                {post.comments.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {post.comments.slice(0, 2).map((comment) => (
                      <div key={comment.id} className="flex items-start space-x-2">
                        <span className="font-bold text-sm" style={{ color: '#FFD700' }}>
                          {comment.username}
                        </span>
                        <span className="text-sm" style={{ color: '#E6C55F' }}>{comment.text}</span>
                      </div>
                    ))}
                    {post.comments.length > 2 && (
                      <button 
                        onClick={() => setShowComments(post.id)}
                        className="text-sm font-medium hover:underline"
                        style={{ color: '#FFD700' }}
                      >
                        View all {post.comments.length} comments
                      </button>
                    )}
                  </div>
                )}

                {/* Comment Input */}
                {showComments === post.id && (
                  <div className="flex items-center space-x-3 mt-4 p-4 rounded-2xl" style={{ background: 'rgba(255, 215, 0, 0.1)' }}>
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-4 py-2 rounded-full border-2 focus:outline-none transition-all"
                      style={{ borderColor: '#FFD700', background: 'rgba(45, 80, 22, 0.1)', color: '#FFD700', boxShadow: '0 0 0 1px #FFD700' }}
                    />
                    <button
                      onClick={() => handleComment(post.id)}
                      className="px-6 py-2 rounded-full font-bold text-white transition-all hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, #B8860B, #DAA520)', boxShadow: '0 0 0 2px #FFD700' }}
                    >
                      Post
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Points Success Message */}
        {pointsMessage && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-xl" style={{
            background: 'rgba(40, 167, 69, 0.9)',
            border: '2px solid #28A745',
            color: 'white'
          }}>
            <p className="font-semibold">{pointsMessage}</p>
          </div>
        )}

        {/* Load More */}
        <div className="text-center py-8">
          <button 
            onClick={() => alert('Loading more posts...')}
            className="px-8 py-3 rounded-full font-bold text-white transition-all hover:scale-105 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #B8860B, #DAA520)', boxShadow: '0 0 0 2px #FFD700, 0 4px 15px rgba(255, 215, 0, 0.3)' }}
          >
            Load More Posts
          </button>
        </div>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="fixed top-20 right-4 rounded-lg shadow-xl z-50 w-80" style={{ background: 'rgba(45, 80, 22, 0.95)', border: '2px solid #FFD700' }}>
            <div className="p-4 border-b" style={{ borderColor: 'rgba(255, 215, 0, 0.3)', background: 'rgba(45, 80, 22, 0.1)' }}>
              <h3 className="font-bold text-lg" style={{ color: '#FFD700' }}>Notifications</h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map(notif => (
                <div key={notif.id} className="p-4 border-b" style={{ borderColor: 'rgba(255, 215, 0, 0.2)' }}>
                  <p className="text-sm font-bold">
                    <span className="font-bold" style={{ color: '#FFD700' }}>{notif.username}</span>
                    <span className="font-bold" style={{ color: '#E6C55F' }}> {notif.message}</span>
                  </p>
                  <p className="text-xs font-bold" style={{ color: '#B8860B' }}>{notif.timeAgo}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Give Points Modal */}
        {showPointsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="p-6 rounded-3xl max-w-sm w-full mx-4" style={{
              background: 'rgba(45, 80, 22, 0.95)',
              border: '2px solid #FFD700'
            }}>
              <h3 className="text-xl font-bold mb-4 text-center" style={{ color: '#FFD700' }}>Give Points</h3>
              <p className="text-center mb-6" style={{ color: '#E6C55F' }}>How many points do you want to give?</p>
              
              <div className="grid grid-cols-5 gap-2 mb-6">
                {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(points => (
                  <button
                    key={points}
                    onClick={() => givePoints(showPointsModal, points)}
                    className="py-2 rounded-lg font-bold text-sm transition-all hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, #B8860B, #DAA520)',
                      color: 'white',
                      boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                    }}
                  >
                    {points}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setShowPointsModal(null)}
                className="w-full py-2 rounded-xl font-medium transition-all hover:scale-105"
                style={{
                  background: 'rgba(255, 215, 0, 0.2)',
                  color: '#FFD700',
                  border: '2px solid #FFD700'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        input[type="file"]::file-selector-button {
          background: linear-gradient(135deg, #B8860B, #DAA520);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          cursor: pointer;
          margin-right: 12px;
        }
        input[type="file"]::file-selector-button:hover {
          transform: scale(1.05);
        }
      `}</style>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-16 p-4" style={{ zIndex: 9999 }}>
          <div className="rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto" style={{ background: 'rgba(45, 80, 22, 0.95)', border: '2px solid #FFD700', boxShadow: '0 0 0 4px rgba(255, 215, 0, 0.3)' }}>
            <div className="p-6 border-b" style={{ borderColor: 'rgba(255, 215, 0, 0.3)' }}>
              <h3 className="text-xl font-semibold" style={{ color: '#FFD700' }}>Create Eco Post</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#E6C55F' }}>Upload Images *</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border-2 rounded-md focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:cursor-pointer"
                  style={{ 
                    borderColor: '#FFD700', 
                    background: 'rgba(45, 80, 22, 0.1)', 
                    color: '#FFD700',
                    '--file-bg': 'linear-gradient(135deg, #B8860B, #DAA520)',
                    '--file-color': 'white'
                  }}
                />
                {newPost.images.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {newPost.images.map((img, index) => (
                      <div key={index} className="relative">
                        <img src={img} alt={`Preview ${index + 1}`} className="w-full h-20 object-cover rounded-md" />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#E6C55F' }}>Caption *</label>
                <textarea
                  rows={4}
                  value={newPost.caption}
                  onChange={(e) => setNewPost(prev => ({ ...prev, caption: e.target.value }))}
                  className="w-full px-3 py-2 border-2 rounded-md focus:outline-none"
                  style={{ borderColor: '#FFD700', background: 'rgba(45, 80, 22, 0.1)', color: '#FFD700' }}
                  placeholder="Share your green moment..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#E6C55F' }}>Hashtags</label>
                <input
                  type="text"
                  value={newPost.hashtags}
                  onChange={(e) => setNewPost(prev => ({ ...prev, hashtags: e.target.value }))}
                  className="w-full px-3 py-2 border-2 rounded-md focus:outline-none"
                  style={{ borderColor: '#FFD700', background: 'rgba(45, 80, 22, 0.1)', color: '#FFD700' }}
                  placeholder="#PlasticFree #EnergySaving #TreePlanting"
                />
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={handleCreatePost}
                  disabled={!newPost.images.length || !newPost.caption.trim()}
                  className="flex-1 py-2 px-4 rounded-md font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #B8860B, #DAA520)', boxShadow: '0 0 0 2px #FFD700' }}
                >
                  Share Post
                </button>
                <button 
                  onClick={() => {
                    setShowCreatePost(false);
                    setNewPost({ images: [], caption: '', hashtags: '' });
                  }}
                  className="flex-1 py-2 px-4 rounded-md font-bold transition-all hover:scale-105"
                  style={{ background: 'rgba(255, 215, 0, 0.2)', color: '#FFD700', border: '2px solid #FFD700' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};