import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Instagram, Mail, MoreVertical, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockContent = [
  { id: 1, type: "Single Post", platform: "Instagram", title: "Summer Collection Launch", date: "2024-01-15", engagement: 2400 },
  { id: 2, type: "Carousel", platform: "Instagram", title: "Product Features", date: "2024-01-14", engagement: 3200 },
  { id: 3, type: "Newsletter", platform: "Email", title: "Monthly Updates", date: "2024-01-13", engagement: 1800 },
  { id: 4, type: "Reel", platform: "Instagram", title: "Behind the Scenes", date: "2024-01-12", engagement: 4100 },
];

const performanceData = [
  { name: "Mon", engagement: 2400 },
  { name: "Tue", engagement: 1398 },
  { name: "Wed", engagement: 9800 },
  { name: "Thu", engagement: 3908 },
  { name: "Fri", engagement: 4800 },
  { name: "Sat", engagement: 3800 },
  { name: "Sun", engagement: 4300 },
];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredContent = mockContent.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = activeTab === "all" || item.platform.toLowerCase() === activeTab;
    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Content Management</h1>
          <p className="text-muted-foreground">Manage and track all your generated content</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New
        </Button>
      </div>

      {/* Analytics Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 shadow-soft hover:shadow-medium transition-all">
            <h3 className="text-sm text-muted-foreground mb-2">Total Content</h3>
            <p className="text-3xl font-bold">{mockContent.length}</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 shadow-soft hover:shadow-medium transition-all">
            <h3 className="text-sm text-muted-foreground mb-2">Avg. Engagement</h3>
            <p className="text-3xl font-bold">2,875</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 shadow-soft hover:shadow-medium transition-all">
            <h3 className="text-sm text-muted-foreground mb-2">Top Performing</h3>
            <p className="text-lg font-semibold">Behind the Scenes</p>
          </Card>
        </motion.div>
      </div>

      {/* Performance Chart */}
      <Card className="p-6 shadow-soft">
        <h3 className="text-xl font-semibold mb-4">Weekly Engagement</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }} 
            />
            <Bar dataKey="engagement" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="instagram">Instagram</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-6 shadow-soft hover:shadow-medium transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {item.platform === "Instagram" ? (
                    <Instagram className="h-5 w-5 text-primary" />
                  ) : (
                    <Mail className="h-5 w-5 text-primary" />
                  )}
                  <span className="text-sm font-medium text-muted-foreground">{item.type}</span>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card">
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{item.date}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Engagement</span>
                <span className="font-semibold">{item.engagement.toLocaleString()}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;
