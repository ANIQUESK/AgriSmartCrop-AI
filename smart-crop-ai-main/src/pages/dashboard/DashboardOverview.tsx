import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
Sprout,
Microscope,
BarChart3,
TrendingUp,
CloudSun,
Bug,
ArrowRight,
Activity,
Leaf
} from "lucide-react";

import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
ResponsiveContainer,
AreaChart,
Area,
XAxis,
YAxis,
Tooltip
} from "recharts";

const mockYieldTrend = [
{ month:"Jan", yield:2100 },
{ month:"Feb", yield:2400 },
{ month:"Mar", yield:2200 },
{ month:"Apr", yield:2800 },
{ month:"May", yield:3100 },
{ month:"Jun", yield:2900 },
{ month:"Jul", yield:3400 },
{ month:"Aug", yield:3200 },
{ month:"Sep", yield:3600 }
];

const modules = [

{
path:"/dashboard/crop-recommendation",
icon:Sprout,
label:"Crop Advisor",
desc:"AI recommendations using soil & climate",
color:"bg-[#B7410E]",
badge:"AI"
},

{
path:"/dashboard/disease-detection",
icon:Microscope,
label:"Disease Detection",
desc:"Upload leaf images for CNN diagnosis",
color:"bg-[#5C3A21]",
badge:"CNN"
},

{
path:"/dashboard/yield-prediction",
icon:BarChart3,
label:"Yield Prediction",
desc:"ML prediction for expected harvest",
color:"bg-[#6B8E23]",
badge:"ML"
},

{
path:"/dashboard/market-prices",
icon:TrendingUp,
label:"Market Forecast",
desc:"AI price trend forecasting",
color:"bg-[#B7410E]",
badge:null
},

{
path:"/dashboard/weather",
icon:CloudSun,
label:"Weather Intel",
desc:"Real-time farm weather insights",
color:"bg-[#5C3A21]",
badge:null
},

{
path:"/dashboard/pest-advisory",
icon:Bug,
label:"Pest Advisory",
desc:"Expert pest prevention guidance",
color:"bg-[#6B8E23]",
badge:null
}

];

const DashboardOverview = () => {

const {user}=useAuth();

const name=
user?.user_metadata?.full_name ||
user?.email?.split("@")[0] ||
"Farmer";

const {data:cropCount}=useQuery({
queryKey:["crop-count"],
queryFn:async()=>{

const {count}=await supabase
.from("crop_recommendations")
.select("*",{count:"exact",head:true})
.eq("user_id",user!.id);

return count || 0;

},
enabled:!!user
});

const {data:diseaseCount}=useQuery({
queryKey:["disease-count"],
queryFn:async()=>{

const {count}=await supabase
.from("disease_reports")
.select("*",{count:"exact",head:true})
.eq("user_id",user!.id);

return count || 0;

},
enabled:!!user
});

const {data:yieldCount}=useQuery({
queryKey:["yield-count"],
queryFn:async()=>{

const {count}=await supabase
.from("yield_predictions")
.select("*",{count:"exact",head:true})
.eq("user_id",user!.id);

return count || 0;

},
enabled:!!user
});

const stats=[

{
label:"Crop Analyses",
value:cropCount ?? 0,
icon:Sprout,
change:"+12%",
color:"text-[#B7410E]"
},

{
label:"Disease Scans",
value:diseaseCount ?? 0,
icon:Microscope,
change:"+5%",
color:"text-[#5C3A21]"
},

{
label:"Yield Forecasts",
value:yieldCount ?? 0,
icon:BarChart3,
change:"+8%",
color:"text-[#6B8E23]"
},

{
label:"Alerts Active",
value:2,
icon:Activity,
change:"Live",
color:"text-[#B7410E]"
}

];

return(

<div className="space-y-6">

{/* Welcome Banner */}

<div className="bg-[#5C3A21] rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">

  {/* Background Leaf Icon */}
  <div className="absolute right-0 top-0 w-64 h-full opacity-10 flex items-center justify-end pr-8">
    <Leaf className="w-48 h-48" />
  </div>

  <div className="relative z-10">

    {/* Platform Badge */}
    <Badge className="bg-white/20 text-white border-white/30 mb-3">
      🌱 SmartCrop AI Platform
    </Badge>

    {/* Greeting */}
    <h2 className="text-2xl lg:text-3xl font-bold mb-2">
      Good {new Date().getHours() < 12
        ? "morning"
        : new Date().getHours() < 18
        ? "afternoon"
        : "evening"}, {name.split(" ")[0]}!
    </h2>

    <p className="text-white/80 mb-4 max-w-lg">
      Your AI powered farm advisor is ready.
    </p>

    {/* Buttons */}
    <div className="flex gap-3 flex-wrap">

      {/* Primary Button */}
      <Button
        asChild
        className="bg-[#B7410E] hover:bg-[#8f330a] text-white font-semibold shadow"
      >
        <Link to="/dashboard/crop-recommendation">
          <Sprout className="w-4 h-4 mr-2" />
          Analyze Soil
        </Link>
      </Button>

      {/* Secondary Button (FIXED VISIBILITY) */}
      <Button
        asChild
        className="bg-[#F4E6C8] text-[#5C3A21] hover:bg-[#DBCEA5] border border-[#5C3A21]/30 font-semibold"
      >
        <Link to="/dashboard/disease-detection">
          <Microscope className="w-4 h-4 mr-2" />
          Scan Leaf
        </Link>
      </Button>

    </div>

  </div>

</div>

{/* Stats */}

<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

{stats.map(stat=>(

<Card key={stat.label} className="bg-[#F4E6C8] border-[#5C3A21]/20">

<CardContent className="p-4">

<div className="flex items-center justify-between mb-3">

<div className="w-9 h-9 rounded-lg bg-[#DBCEA5] flex items-center justify-center">

<stat.icon className={`w-5 h-5 ${stat.color}`}/>

</div>

<span className="text-xs font-semibold text-[#6B8E23]">

{stat.change}

</span>

</div>

<div className="text-2xl font-bold text-[#2E2E2E]">

{stat.value}

</div>

<div className="text-xs text-[#5C3A21] mt-1">

{stat.label}

</div>

</CardContent>

</Card>

))}

</div>

{/* Yield Chart */}

<Card className="bg-[#F4E6C8] border-[#5C3A21]/20">

<CardContent className="p-5">

<div className="flex items-center justify-between mb-4">

<div>

<h3 className="font-bold text-[#2E2E2E]">

Yield Performance Trend

</h3>

<p className="text-sm text-[#5C3A21]">

Simulated data · kg/hectare

</p>

</div>

<Badge className="bg-[#DBCEA5] text-[#B7410E] border-[#B7410E]/20">

2025

</Badge>

</div>

<ResponsiveContainer width="100%" height={180}>

<AreaChart data={mockYieldTrend}>

<defs>

<linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">

<stop offset="5%" stopColor="#B7410E" stopOpacity={0.35}/>

<stop offset="95%" stopColor="#B7410E" stopOpacity={0}/>

</linearGradient>

</defs>

<XAxis dataKey="month" tick={{fontSize:11}} axisLine={false} tickLine={false}/>

<YAxis tick={{fontSize:11}} axisLine={false} tickLine={false}/>

<Tooltip
contentStyle={{
borderRadius:"12px",
border:"1px solid #5C3A21",
background:"#F4E6C8"
}}
formatter={(v)=>[` ${v} kg/ha`,"Yield"]}
/>

<Area
type="monotone"
dataKey="yield"
stroke="#B7410E"
strokeWidth={2}
fill="url(#yieldGradient)"
/>

</AreaChart>

</ResponsiveContainer>

</CardContent>

</Card>

{/* Modules */}

<div>

<h3 className="font-bold text-lg text-[#2E2E2E] mb-4">

AI Modules

</h3>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

{modules.map(mod=>(

<Link key={mod.path} to={mod.path} className="group">

<Card className="bg-[#F4E6C8] border-[#5C3A21]/20 hover:shadow-lg hover:-translate-y-1 transition-all">

<CardContent className="p-5">

<div className="flex items-start justify-between mb-3">

<div className={`w-11 h-11 rounded-xl ${mod.color} flex items-center justify-center`}>

<mod.icon className="w-6 h-6 text-white"/>

</div>

{mod.badge &&(

<Badge className="bg-[#DBCEA5] text-[#B7410E] border-[#B7410E]/20 text-[10px]">

{mod.badge}

</Badge>

)}

</div>

<h4 className="font-bold text-[#2E2E2E] mb-1">

{mod.label}

</h4>

<p className="text-xs text-[#5C3A21] mb-3">

{mod.desc}

</p>

<div className="flex items-center text-[#B7410E] text-xs font-semibold group-hover:gap-2 gap-1 transition-all">

Open Module

<ArrowRight className="w-3.5 h-3.5"/>

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