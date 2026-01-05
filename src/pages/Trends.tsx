import { Card } from "@/components/ui/card";
import { TrendingUp, Hash, Clock } from "lucide-react";

const Trends = () => {
  const categories = [
    { name: "Product Showcases", growth: "+45%", color: "bg-blue-500" },
    { name: "Behind the Scenes", growth: "+38%", color: "bg-purple-500" },
    { name: "User Generated Content", growth: "+32%", color: "bg-pink-500" },
    { name: "Educational Content", growth: "+28%", color: "bg-green-500" },
  ];

  const hashtags = [
    { tag: "#contentcreator", posts: "12.5M", trend: "+15%" },
    { tag: "#digitalmarketing", posts: "8.9M", trend: "+12%" },
    { tag: "#brandstrategy", posts: "5.2M", trend: "+18%" },
    { tag: "#socialmedia", posts: "15.8M", trend: "+10%" },
  ];

  const timingInsights = [
    { time: "9:00 AM - 11:00 AM", engagement: "High", description: "Peak morning engagement" },
    { time: "1:00 PM - 3:00 PM", engagement: "Medium", description: "Lunch break activity" },
    { time: "7:00 PM - 9:00 PM", engagement: "Very High", description: "Evening peak hours" },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Trends</h1>
        <p className="text-muted-foreground">Stay ahead with the latest content trends</p>
      </div>

      {/* Top Performing Categories */}
      <Card className="p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-semibold">Top Performing Content Categories</h3>
        </div>
        
        <div className="space-y-4">
          {categories.map((category, index) => (
            <div key={index} className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                  <h4 className="font-semibold">{category.name}</h4>
                </div>
                <span className="text-green-500 font-medium">{category.growth}</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden ml-6">
                <div
                  className={`h-full ${category.color}`}
                  style={{ width: `${parseInt(category.growth)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Emerging Hashtag Trends */}
      <Card className="p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-6">
          <Hash className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-semibold">Emerging Hashtag Trends</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {hashtags.map((hashtag, index) => (
            <div key={index} className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold text-primary">{hashtag.tag}</h4>
                <span className="text-sm text-green-500 font-medium">{hashtag.trend}</span>
              </div>
              <p className="text-sm text-muted-foreground">{hashtag.posts} posts</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Post Timing Insights */}
      <Card className="p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-semibold">Best Times to Post</h3>
        </div>

        <div className="space-y-4">
          {timingInsights.map((insight, index) => (
            <div key={index} className="p-4 bg-muted rounded-lg flex items-center justify-between">
              <div>
                <h4 className="font-semibold mb-1">{insight.time}</h4>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    insight.engagement === "Very High"
                      ? "bg-green-500/20 text-green-700"
                      : insight.engagement === "High"
                      ? "bg-blue-500/20 text-blue-700"
                      : "bg-yellow-500/20 text-yellow-700"
                  }`}
                >
                  {insight.engagement}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Trends;
