import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Heart, 
  MessageCircle, 
  Share2,
  Globe,
  Calendar,
  Sparkles,
  ArrowRight,
  Instagram,
  Youtube,
  Linkedin,
  Target
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useCompanyDetails } from "@/hooks/useCompanyDetails";
import { useNavigate } from "react-router-dom";

// Mock data
const socialPlatforms = [
  {
    name: "Instagram",
    icon: Instagram,
    followers: 45200,
    growth: 12.5,
    data: [40000, 41000, 42500, 43200, 44000, 45200],
    color: "#E1306C"
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    followers: 28500,
    growth: 8.3,
    data: [26000, 26500, 27200, 27800, 28200, 28500],
    color: "#0A66C2"
  },
  {
    name: "YouTube",
    icon: Youtube,
    followers: 15800,
    growth: -2.1,
    data: [16500, 16200, 16000, 15900, 15850, 15800],
    color: "#FF0000"
  },
  {
    name: "TikTok",
    icon: Target,
    followers: 62300,
    growth: 18.7,
    data: [52000, 54500, 57200, 59000, 60500, 62300],
    color: "#000000"
  }
];

const growthData = [
  { month: "Jan", followers: 32000, likes: 8500, comments: 1200 },
  { month: "Feb", followers: 35000, likes: 9200, comments: 1350 },
  { month: "Mar", followers: 38500, likes: 10100, comments: 1500 },
  { month: "Apr", followers: 42000, likes: 11300, comments: 1680 },
  { month: "May", followers: 45200, likes: 12800, comments: 1920 },
  { month: "Jun", followers: 48900, likes: 14200, comments: 2150 },
  { month: "Jul", followers: 52300, likes: 15600, comments: 2380 },
  { month: "Aug", followers: 56100, likes: 17200, comments: 2650 },
  { month: "Sep", followers: 60500, likes: 18900, comments: 2890 },
  { month: "Oct", followers: 65200, likes: 20500, comments: 3120 },
  { month: "Nov", followers: 70800, likes: 22300, comments: 3450 },
  { month: "Dec", followers: 76500, likes: 24800, comments: 3780 }
];

const audienceData = [
  { country: "United States", percentage: 35, value: 26775, color: "hsl(43 45% 73%)" },
  { country: "United Kingdom", percentage: 20, value: 15300, color: "hsl(203 23% 71%)" },
  { country: "Canada", percentage: 10, value: 7650, color: "hsl(158 12% 74%)" },
  { country: "Australia", percentage: 8, value: 6120, color: "hsl(355 19% 74%)" },
  { country: "Others", percentage: 27, value: 20655, color: "hsl(36 33% 94%)" }
];

const CompanyDashboard = () => {
  const [dateRange, setDateRange] = useState("month");
  const [selectedMetric, setSelectedMetric] = useState("followers");
  const { companyDetails } = useCompanyDetails();
  const navigate = useNavigate();

  const handleViewPersonas = () => {
    navigate('/dashboard?tab=company-profile&subtab=personas');
  };

  const handleCreateCampaign = () => {
    navigate('/dashboard?tab=content-management&subtab=content-scheduling');
  };

  const totalFollowers = socialPlatforms.reduce((acc, platform) => acc + platform.followers, 0);
  const avgGrowth = (socialPlatforms.reduce((acc, platform) => acc + platform.growth, 0) / socialPlatforms.length).toFixed(1);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {companyDetails?.name || "Company"} Dashboard
          </h1>
          <p className="text-lg text-muted-foreground flex items-center gap-2">
            Here's how your brand is growing this month 🚀
          </p>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Social Media Overview Cards */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Share2 className="h-6 w-6 text-fabel-primary" />
          Social Media Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {socialPlatforms.map((platform) => {
            const Icon = platform.icon;
            const isPositive = platform.growth > 0;
            return (
              <Card key={platform.name} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Icon className="h-8 w-8" style={{ color: platform.color }} />
                    <Badge 
                      variant={isPositive ? "default" : "destructive"}
                      className="flex items-center gap-1"
                    >
                      {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {Math.abs(platform.growth)}%
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{platform.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-foreground">
                      {platform.followers.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">followers</p>
                    <div className="h-12 mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={platform.data.map((val, idx) => ({ value: val }))}>
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke={platform.color} 
                            strokeWidth={2} 
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Growth Analytics Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-fabel-primary" />
            Growth Analytics
          </h2>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="followers">Followers</SelectItem>
              <SelectItem value="likes">Likes</SelectItem>
              <SelectItem value="comments">Comments</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Performance Over Time</CardTitle>
            <CardDescription>Track your social media growth throughout the year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar dataKey={selectedMetric} fill="hsl(43 45% 73%)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audience Insights & Key Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audience Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-fabel-primary" />
              Audience Insights
            </CardTitle>
            <CardDescription>Where your followers are from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={audienceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {audienceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {audienceData.map((item) => (
                  <div key={item.country} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium">{item.country}</span>
                    </div>
                    <span className="text-sm font-bold">{item.percentage}%</span>
                  </div>
                ))}
                <div className="mt-4 p-3 bg-fabel-primary/10 rounded-lg">
                  <p className="text-sm text-foreground">
                    💡 You gained <strong>12% more international followers</strong> this quarter
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-fabel-primary" />
              Key Metrics
            </CardTitle>
            <CardDescription>Your performance highlights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-fabel-primary/20 to-fabel-secondary/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <Heart className="h-5 w-5 text-fabel-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Engagement Rate</p>
                  <p className="text-2xl font-bold">6.8%</p>
                </div>
              </div>
              <Badge className="bg-green-500">+1.2%</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-fabel-secondary/20 to-fabel-accent/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <TrendingUp className="h-5 w-5 text-fabel-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Growth Rate</p>
                  <p className="text-2xl font-bold">{avgGrowth}%</p>
                </div>
              </div>
              <Badge className="bg-green-500">Excellent</Badge>
            </div>

            <div className="p-4 bg-gradient-to-r from-fabel-accent/20 to-fabel-neutral/20 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <MessageCircle className="h-5 w-5 text-fabel-accent" />
                <p className="font-semibold">AI Insight</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Your posts perform best on <strong>Fridays at 2PM</strong>. Consider scheduling more content during this time window.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA / Next Steps */}
      <Card className="bg-gradient-to-br from-fabel-primary/10 via-fabel-secondary/10 to-fabel-accent/10 border-2 border-fabel-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-fabel-primary" />
                Ready to Take Action?
              </h3>
              <p className="text-muted-foreground">
                Use your insights to create compelling campaigns or explore your audience personas
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleCreateCampaign}
                size="lg" 
                className="bg-fabel-primary hover:bg-fabel-primary/90 text-white"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Create New Campaign
              </Button>
              <Button 
                onClick={handleViewPersonas}
                size="lg" 
                variant="outline"
                className="border-2 border-fabel-primary text-fabel-primary hover:bg-fabel-primary/10"
              >
                <Users className="mr-2 h-5 w-5" />
                View Personas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyDashboard;
