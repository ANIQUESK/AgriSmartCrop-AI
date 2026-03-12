import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sprout, Microscope, BarChart3, TrendingUp, CloudSun, Bug, ArrowRight, Activity, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

const mockYieldTrend = [
  { month: "Jan", yield: 2100 }, { month: "Feb", yield: 2400 }, { month: "Mar", yield: 2200 },
  { month: "Apr", yield: 2800 }, { month: "May", yield: 3100 }, { month: "Jun", yield: 2900 },
  { month: "Jul", yield: 3400 }, { month: "Aug", yield: 3200 }, { month: "Sep", yield: 3600 },
];

const modules = [
  { path: "/dashboard/crop-recommendation", icon: Sprout, label: "Crop Advisor", desc: "Get AI recommendations based on soil & climate data", color: "from-primary to-primary-light", badge: "AI" },
  { path: "/dashboard/disease-detection", icon: Microscope, label: "Disease Detection", desc: "Upload leaf images for CNN disease analysis", color: "from-emerald-600 to-teal-500", badge: "CNN" },
  { path: "/dashboard/yield-prediction", icon: BarChart3, label: "Yield Prediction", desc: "ML regression for expected harvest per hectare", color: "from-blue-600 to-blue-500", badge: "ML" },
  { path: "/dashboard/market-prices", icon: TrendingUp, label: "Market Forecast", desc: "Time-series price forecasting & optimal sell timing", color: "from-amber-500 to-orange-500", badge: null },
  { path: "/dashboard/weather", icon: CloudSun, label: "Weather Intel", desc: "Real-time weather with storm & heatwave alerts", color: "from-sky-500 to-blue-400", badge: null },
  { path: "/dashboard/pest-advisory", icon: Bug, label: "Pest Advisory", desc: "Expert knowledge base for pest prevention", color: "from-red-500 to-pink-500", badge: null },
];

const DashboardOverview = () => {
  const { user } = useAuth();
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Farmer";

  const { data: cropCount } = useQuery({
    queryKey: ["crop-count"],
    queryFn: async () => {
      const { count } = await supabase.from("crop_recommendations").select("*", { count: "exact", head: true }).eq("user_id", user!.id);
      return count || 0;
    },
    enabled: !!user,
  });
  const { data: diseaseCount } = useQuery({
    queryKey: ["disease-count"],
    queryFn: async () => {
      const { count } = await supabase.from("disease_reports").select("*", { count: "exact", head: true }).eq("user_id", user!.id);
      return count || 0;
    },
    enabled: !!user,
  });
  const { data: yieldCount } = useQuery({
    queryKey: ["yield-count"],
    queryFn: async () => {
      const { count } = await supabase.from("yield_predictions").select("*", { count: "exact", head: true }).eq("user_id", user!.id);
      return count || 0;
    },
    enabled: !!user,
  });

  const stats = [
    { label: "Crop Analyses", value: cropCount ?? 0, icon: Sprout, change: "+12%", color: "text-primary" },
    { label: "Disease Scans", value: diseaseCount ?? 0, icon: Microscope, change: "+5%", color: "text-emerald-600" },
    { label: "Yield Forecasts", value: yieldCount ?? 0, icon: BarChart3, change: "+8%", color: "text-blue-600" },
    { label: "Alerts Active", value: 2, icon: Activity, change: "Live", color: "text-amber-500" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="gradient-hero rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-full opacity-10 flex items-center justify-end pr-8">
          <Leaf className="w-48 h-48" />
        </div>
        <div className="relative z-10">
          <Badge className="bg-white/20 text-white border-white/30 mb-3">🌱 SmartCrop AI Platform</Badge>
          <h2 className="text-2xl lg:text-3xl font-display font-bold mb-2">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, {name.split(" ")[0]}!
          </h2>
          <p className="text-white/80 mb-4 max-w-lg">
            Your AI-powered farm advisor is ready. Get crop recommendations, detect plant diseases, and forecast your yield — all with machine learning.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Button asChild variant="secondary" className="bg-white text-primary hover:bg-white/90 font-semibold">
              <Link to="/dashboard/crop-recommendation">
                <Sprout className="w-4 h-4 mr-2" />
                Analyze Soil
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white/40 text-white hover:bg-white/10">
              <Link to="/dashboard/disease-detection">
                <Microscope className="w-4 h-4 mr-2" />
                Scan Leaf
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-xs font-semibold text-success">{stat.change}</span>
              </div>
              <div className="text-2xl font-display font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Yield Trend Chart */}
      <Card className="shadow-card border-border/50">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-foreground">Yield Performance Trend</h3>
              <p className="text-muted-foreground text-sm">Simulated data · kg/hectare</p>
            </div>
            <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">2025</Badge>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={mockYieldTrend}>
              <defs>
                <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(145,63%,28%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(145,63%,28%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(140,15%,45%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(140,15%,45%)" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid hsl(140,20%,88%)", backgroundColor: "white", fontSize: "12px" }}
                formatter={(v) => [`${v} kg/ha`, "Yield"]}
              />
              <Area type="monotone" dataKey="yield" stroke="hsl(145,63%,28%)" strokeWidth={2} fill="url(#yieldGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Modules Grid */}
      <div>
        <h3 className="font-display font-bold text-foreground text-lg mb-4">AI Modules</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => (
            <Link key={mod.path} to={mod.path} className="group">
              <Card className="shadow-card border-border/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center`}>
                      <mod.icon className="w-6 h-6 text-white" />
                    </div>
                    {mod.badge && (
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">{mod.badge}</Badge>
                    )}
                  </div>
                  <h4 className="font-display font-bold text-foreground mb-1">{mod.label}</h4>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-3">{mod.desc}</p>
                  <div className="flex items-center text-primary text-xs font-semibold group-hover:gap-1.5 gap-1 transition-all">
                    Open Module <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
