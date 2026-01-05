import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, Heart, MessageCircle, Instagram, AlertCircle, CheckCircle } from "lucide-react";
import { analyzeInstagram } from "../axios";

// Toast component
const Toast = ({ message, type, onClose }) => {
  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-amber-500"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 ${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50`}
    >
      {type === 'success' && <CheckCircle className="h-5 w-5" />}
      {type === 'error' && <AlertCircle className="h-5 w-5" />}
      {type === 'warning' && <AlertCircle className="h-5 w-5" />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 font-bold">×</button>
    </motion.div>
  );
};

const ProfileAnalytics = () => {
  const [instagramHandle, setInstagramHandle] = useState("");
  const [dataFetched, setDataFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Extract follower and engagement data from posts_data if available
  const followerData = analyticsData?.posts_data
    ? analyticsData.posts_data.map((post, idx) => ({
        month: `Post ${idx + 1}`,
        followers: analyticsData.followers || 0 // No per-post follower history, so use static
      }))
    : [];

  const engagementData = analyticsData?.posts_data
    ? analyticsData.posts_data.map((post, idx) => ({
        day: `Post ${idx + 1}`,
        rate: calculateEngagementRate(post.likes, post.comments, analyticsData.followers)
      }))
    : [];

  // Extract top hashtags from captions
  const hashtagCounts = {};
  if (analyticsData?.captions) {
    analyticsData.captions.forEach(caption => {
      (caption.match(/#[\w]+/g) || []).forEach(tag => {
        hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
      });
    });
  }
  const topHashtags = Object.entries(hashtagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag, count]) => ({ tag, count }));

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFetchData = async () => {
    if (!instagramHandle.trim()) {
      showToast("Please enter an Instagram handle", "error");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Remove @ if user includes it
      const cleanHandle = instagramHandle.replace('@', '').trim();
      
      // Call the backend API using the axios service
      const response = await analyzeInstagram(cleanHandle, true);
      
      console.log("API Response:", response.data);
      
      setAnalyticsData(response.data);
      setDataFetched(true);
      
      if (response.data.error) {
        showToast(`Data loaded with note: ${response.data.error}`, "warning");
      } else {
        showToast(`Analytics loaded for @${response.data.username}`, "success");
      }
      
    } catch (err) {
      console.error("Error fetching Instagram data:", err);
      const errorMsg = err.response?.data?.detail || err.message || "Failed to fetch analytics. Please try again.";
      setError(errorMsg);
      showToast("Failed to fetch analytics", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num?.toString() || '0';
  };

  const calculateEngagementRate = (likes, comments, followers) => {
    if (!followers) return 0;
    return (((likes + comments) / followers) * 100).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Profile Analytics
          </h1>
          <p className="text-slate-600">Understand your brand performance on Instagram</p>
        </div>

        <AnimatePresence mode="wait">
          {!dataFetched ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-center min-h-[60vh]"
            >
              <Card className="p-8 w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <Instagram className="h-8 w-8 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Connect Your Profile</h3>
                    <p className="text-slate-600">
                      Enter your Instagram handle to view detailed analytics
                    </p>
                  </div>

                  {error && (
                    <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-600 text-left">{error}</p>
                    </div>
                  )}

                  <div className="w-full space-y-4">
                    <Input
                      placeholder="@your_instagram_handle"
                      value={instagramHandle}
                      onChange={(e) => setInstagramHandle(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleFetchData()}
                      className="text-center text-lg border-2 focus:border-purple-400"
                      disabled={isLoading}
                    />
                    
                    <motion.div
                      whileHover={{ scale: isLoading ? 1 : 1.02 }}
                      whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    >
                      <Button
                        onClick={handleFetchData}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        size="lg"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            Fetching Data...
                          </span>
                        ) : (
                          "Fetch Analytics"
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="analytics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Profile Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between bg-white/80 backdrop-blur p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <Instagram className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">@{analyticsData?.username}</h2>
                    <a 
                      href={analyticsData?.profile_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-purple-600 hover:text-purple-700 hover:underline"
                    >
                      View Profile on Instagram →
                    </a>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDataFetched(false);
                    setInstagramHandle("");
                    setAnalyticsData(null);
                    setError(null);
                  }}
                  className="border-2 hover:border-purple-400"
                >
                  Analyze Another Profile
                </Button>
              </motion.div>

              {/* Warning if using sample data */}
              {analyticsData?.error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-4 bg-amber-50 border-amber-200">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-amber-900">Note</p>
                        <p className="text-sm text-amber-700">{analyticsData.error}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Key Metrics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid md:grid-cols-4 gap-6"
              >
                <Card className="p-6 shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Followers</p>
                      <p className="text-2xl font-bold text-slate-900">{formatNumber(analyticsData?.followers)}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center">
                      <Heart className="h-6 w-6 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Avg. Likes</p>
                      <p className="text-2xl font-bold text-slate-900">{formatNumber(analyticsData?.avg_likes || 0)}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Avg. Comments</p>
                      <p className="text-2xl font-bold text-slate-900">{formatNumber(analyticsData?.avg_comments || 0)}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-purple-500 to-pink-500 border-0 text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-white/90">Engagement Rate</p>
                      <p className="text-2xl font-bold">{analyticsData?.engagement_rate?.toFixed(2)}%</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Posts Analyzed Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Card className="p-4 bg-slate-100 border-0">
                  <p className="text-sm text-center text-slate-700">
                    <span className="font-semibold text-slate-900">{analyticsData?.posts_analyzed || 0}</span> posts analyzed from recent activity
                  </p>
                </Card>
              </motion.div>

              {/* Charts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid md:grid-cols-2 gap-6"
              >
                <Card className="p-6 shadow-lg bg-white/80 backdrop-blur border-0">
                  <h3 className="text-xl font-semibold mb-4 text-slate-900">Follower Growth Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={followerData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "white", 
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="followers" 
                        stroke="#a855f7" 
                        strokeWidth={3}
                        dot={{ fill: "#a855f7", r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6 shadow-lg bg-white/80 backdrop-blur border-0">
                  <h3 className="text-xl font-semibold mb-4 text-slate-900">Engagement Rate by Day</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="day" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "white", 
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                        }} 
                      />
                      <Bar dataKey="rate" fill="#ec4899" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>

              {/* Top Hashtags */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 shadow-lg bg-white/80 backdrop-blur border-0">
                  <h3 className="text-xl font-semibold mb-4 text-slate-900">Top Performing Hashtags</h3>
                  <div className="flex flex-wrap gap-3">
                    {topHashtags.map((hashtag, index) => (
                      <motion.div
                        key={hashtag.tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center gap-2 hover:from-purple-200 hover:to-pink-200 transition-all cursor-pointer"
                      >
                        <span className="font-medium text-slate-800">{hashtag.tag}</span>
                        
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Top Performing Content (from backend) */}
              {analyticsData?.posts_data && analyticsData.posts_data.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="p-6 shadow-lg bg-white/80 backdrop-blur border-0">
                    <h3 className="text-xl font-semibold mb-4 text-slate-900">Top-Performing Content</h3>
                    <div className="space-y-4">
                      {analyticsData.posts_data
                        .slice()
                        .sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments))
                        .slice(0, 3)
                        .map((post, index) => (
                          <motion.div 
                            key={index} 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all"
                          >
                            <div>
                              <p className="font-semibold text-slate-900 max-w-xs truncate" title={post.caption}>{post.caption || 'No caption'}</p>
                              <p className="text-sm text-slate-600">Likes: {post.likes}, Comments: {post.comments}</p>
                            </div>
                            <div className="flex gap-6 text-sm text-slate-700">
                              <span className="flex items-center gap-1">
                                <Heart className="h-4 w-4 text-pink-500" /> {post.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="h-4 w-4 text-blue-500" /> {post.comments}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileAnalytics;