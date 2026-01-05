import { useState } from "react";
import { analyzeInstagram } from "../axios";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, GitCompare, FileBarChart, TrendingUp, TrendingDown, Minus, Instagram } from "lucide-react";
import { toast } from "sonner";

const Competitors = () => {
  const [competitorHandle, setCompetitorHandle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null); // Only show latest analysis result

  // Always fetch fresh competitor data from backend
  const handleFetchData = async () => {
    if (!competitorHandle.trim()) {
      toast.error("Please enter a competitor's Instagram handle");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      // Always force refresh for real-time competitor analysis
      const res = await analyzeInstagram(competitorHandle.trim(), true);
      const data = res?.data;

      if (data && data.username) {
        setResult({
          name: data.username,
          followers: data.followers?.toLocaleString() || "0",
          engagement: data.engagement_rate ? `${data.engagement_rate}%` : "-",
          trend: data.engagement_rate && data.engagement_rate > 5 ? "up" : "down",
          profile_url: data.profile_url,
          captions: data.captions || [],
          posts_data: data.posts_data || [],
        });
        toast.success(`Competitor data loaded for ${data.username}`);
      } else {
        toast.error("No data found for this handle");
      }
    } catch (e) {
      toast.error("Failed to fetch competitor data");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <GitCompare className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Competitors
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Analyze and compare competitor performance
          </p>
        </motion.div>

        <Card className="p-8 mb-8 shadow-xl">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Search className="w-6 h-6 text-purple-600" />
            Analyze Competitor
          </h2>
          <p className="text-gray-600 mb-4">
            Enter a competitor's Instagram handle to view stats
          </p>
          <div className="flex gap-4">
            <Input
              placeholder="@competitor_handle"
              value={competitorHandle}
              onChange={(e) => setCompetitorHandle(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleFetchData()}
              className="text-center text-lg"
            />
            <Button
              onClick={handleFetchData}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isLoading ? "Analyzing..." : "Analyze Competitor"}
            </Button>
          </div>
        </Card>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="p-8 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Instagram className="w-8 h-8 text-purple-600" />
                    <h3 className="text-2xl font-bold">{result.name}</h3>
                  </div>
                  {result.trend === "up" ? (
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  ) : (
                    <TrendingDown className="w-8 h-8 text-red-500" />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg">
                    <p className="text-gray-600 mb-2">Followers</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {result.followers}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg">
                    <p className="text-gray-600 mb-2">Engagement Rate</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {result.engagement}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-lg">
                    <p className="text-gray-600 mb-2">Tone Match</p>
                    <p className="text-3xl font-bold text-pink-600">-</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-lg">
                    <p className="text-gray-600 mb-2">Visual Consistency</p>
                    <p className="text-3xl font-bold text-purple-600">-</p>
                  </div>
                </div>

                {/* Show captions if available */}
                {result.captions && result.captions.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-2">Recent Captions</h4>
                    <ul className="list-disc pl-6 text-gray-700">
                      {result.captions.slice(0, 5).map((caption, idx) => (
                        <li key={idx} className="mb-1">{caption}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Show posts_data if available */}
                {result.posts_data && result.posts_data.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Recent Posts</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm text-left">
                        <thead>
                          <tr>
                            <th className="pr-4 py-2">Likes</th>
                            <th className="pr-4 py-2">Comments</th>
                            <th className="pr-4 py-2">Caption</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.posts_data.slice(0, 5).map((post, idx) => (
                            <tr key={idx} className="border-b">
                              <td className="pr-4 py-2">{post.likes}</td>
                              <td className="pr-4 py-2">{post.comments}</td>
                              <td className="pr-4 py-2 max-w-xs truncate" title={post.caption}>{post.caption}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Competitors;