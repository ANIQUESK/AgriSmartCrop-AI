import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TrendingUp, Search } from "lucide-react";
import {
ResponsiveContainer,
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
CartesianGrid
} from "recharts";

/* Agricultural Market Knowledge Base */

const MARKET_DATA: Record<string, any> = {

Rice:{
base:22,
msp:21.8,
unit:"₹/kg",
emoji:"🌾",
harvest:["Oct","Nov"],
demandIndex:0.85,
exportFactor:0.7,
volatility:0.12
},

Wheat:{
base:21,
msp:22,
unit:"₹/kg",
emoji:"🌿",
harvest:["Mar","Apr"],
demandIndex:0.9,
exportFactor:0.6,
volatility:0.1
},

Maize:{
base:18,
msp:20,
unit:"₹/kg",
emoji:"🌽",
harvest:["Sep","Oct"],
demandIndex:0.75,
exportFactor:0.65,
volatility:0.14
},

Cotton:{
base:65,
msp:70,
unit:"₹/kg",
emoji:"☁️",
harvest:["Nov","Dec"],
demandIndex:0.8,
exportFactor:0.85,
volatility:0.18
},

Soybean:{
base:45,
msp:46,
unit:"₹/kg",
emoji:"🫘",
harvest:["Oct"],
demandIndex:0.78,
exportFactor:0.7,
volatility:0.16
},

Tomato:{
base:25,
msp:null,
unit:"₹/kg",
emoji:"🍅",
harvest:["Feb","Mar","Jul"],
demandIndex:0.92,
exportFactor:0.4,
volatility:0.35
},

Potato:{
base:14,
msp:null,
unit:"₹/kg",
emoji:"🥔",
harvest:["Jan","Feb"],
demandIndex:0.82,
exportFactor:0.45,
volatility:0.28
},

Sugarcane:{
base:3.5,
msp:3.4,
unit:"₹/kg",
emoji:"🎋",
harvest:["Dec","Jan","Feb"],
demandIndex:0.88,
exportFactor:0.75,
volatility:0.08
}

};

const MONTHS=[
"Jan","Feb","Mar","Apr","May","Jun",
"Jul","Aug","Sep","Oct","Nov","Dec"
];

/* Agricultural Forecast Model */

const generateForecast=(crop:any)=>{

return MONTHS.map((month,i)=>{

/* Seasonal Harvest Impact */

const harvestImpact=crop.harvest.includes(month)
?-crop.base*0.12
:crop.base*0.04;

/* Demand Supply Dynamics */

const demandEffect=crop.base*crop.demandIndex*0.1;

/* Export Influence */

const exportEffect=crop.base*crop.exportFactor*0.08;

/* Volatility */

const volatility=(Math.random()-0.5)*crop.base*crop.volatility;

/* Trend (post harvest recovery) */

const recovery=i>6?crop.base*0.05:0;

const price=
crop.base+
harvestImpact+
demandEffect+
exportEffect+
volatility+
recovery;

return{
month,
price:+price.toFixed(2),
forecast:i>=6
};

});

};

const MarketPrices=()=>{

const [selectedCrop,setSelectedCrop]=useState("Rice");
const [search,setSearch]=useState("");

const crops=Object.keys(MARKET_DATA)
.filter(c=>c.toLowerCase().includes(search.toLowerCase()));

const crop=MARKET_DATA[selectedCrop];

const data=generateForecast(crop);

const maxMonth=data.reduce((a,b)=>
(a.price>b.price?a:b)
);

const currentPrice=data[new Date().getMonth()].price;

const change=
((currentPrice-crop.base)/crop.base*100).toFixed(1);

const advisory=
currentPrice>crop.base
?"Good time to sell — market price above seasonal average"
:"Hold stock if possible — price expected to improve";

/* UI (unchanged) */

return(

<div className="max-w-6xl mx-auto space-y-6">

<div className="flex items-center gap-3">

<div className="w-10 h-10 bg-[#B7410E] rounded-xl flex items-center justify-center">
<TrendingUp className="w-5 h-5 text-white"/>
</div>

<div>

<h2 className="font-bold text-xl text-[#2E2E2E]">
Market Price Forecast
</h2>

<p className="text-sm text-[#5C3A21]">
Time-series prediction · Optimal selling time advisory
</p>

</div>

</div>

<div className="grid lg:grid-cols-4 gap-4">

<Card className="bg-[#F4E6C8] border-[#5C3A21]/20">

<CardHeader className="pb-2">

<CardTitle className="text-sm text-[#2E2E2E]">
Select Crop
</CardTitle>

<div className="relative">

<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5C3A21]" />

<Input
placeholder="Search..."
value={search}
onChange={e=>setSearch(e.target.value)}
className="pl-8 h-8 text-xs border-[#5C3A21]/30"
/>

</div>

</CardHeader>

<CardContent className="p-2 space-y-1">

{crops.map(c=>(

<button
key={c}
onClick={()=>setSelectedCrop(c)}
className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all

${selectedCrop===c
?"bg-[#B7410E]/10 text-[#B7410E] font-semibold"
:"hover:bg-[#DBCEA5] text-[#2E2E2E]"}
`}
>

<span>{MARKET_DATA[c].emoji}</span>
{c}

</button>

))}

</CardContent>

</Card>

<div className="lg:col-span-3 space-y-4">

<div className="grid grid-cols-3 gap-3">

<Card className="bg-[#F4E6C8] border-[#5C3A21]/20">

<CardContent className="p-4">

<p className="text-xs text-[#5C3A21]">
Current Price
</p>

<p className="text-2xl font-bold text-[#2E2E2E]">
₹{currentPrice}
</p>

<Badge
className={
+change>=0
?"bg-[#6B8E23]/10 text-[#6B8E23] border-[#6B8E23]/30"
:"bg-[#B7410E]/10 text-[#B7410E] border-[#B7410E]/30"
}
>

{+change>=0?"+":""}{change}% vs avg

</Badge>

</CardContent>

</Card>

<Card className="bg-[#F4E6C8] border-[#5C3A21]/20">

<CardContent className="p-4">

<p className="text-xs text-[#5C3A21]">
Best Month to Sell
</p>

<p className="text-2xl font-bold text-[#2E2E2E]">
{maxMonth.month}
</p>

<p className="text-xs text-[#5C3A21]">
Est. ₹{maxMonth.price}/kg
</p>

</CardContent>

</Card>

<Card className="bg-[#F4E6C8] border-[#5C3A21]/20">

<CardContent className="p-4">

<p className="text-xs text-[#5C3A21]">
MSP Reference
</p>

<p className="text-2xl font-bold text-[#2E2E2E]">
{crop.msp?`₹${crop.msp}`:"N/A"}
</p>

<p className="text-xs text-[#5C3A21]">
Government MSP
</p>

</CardContent>

</Card>

</div>

<Card className="bg-[#F4E6C8] border-[#5C3A21]/20">

<CardHeader className="pb-2">

<CardTitle className="text-base text-[#2E2E2E]">
{selectedCrop} Price Trend & Forecast
</CardTitle>

</CardHeader>

<CardContent>

<ResponsiveContainer width="100%" height={240}>

<LineChart data={data}>

<CartesianGrid strokeDasharray="3 3" stroke="#E5D3AF"/>

<XAxis
dataKey="month"
tick={{fontSize:11,fill:"#5C3A21"}}
axisLine={false}
tickLine={false}
/>

<YAxis
tick={{fontSize:11,fill:"#5C3A21"}}
axisLine={false}
tickLine={false}
/>

<Tooltip
contentStyle={{
borderRadius:"10px",
border:"1px solid #E5D3AF",
fontSize:"12px"
}}
formatter={(v:any)=>[`₹${v}`,"Price"]}
/>

<Line
type="monotone"
dataKey="price"
stroke="#B7410E"
strokeWidth={3}
dot={{r:3}}
/>

</LineChart>

</ResponsiveContainer>

<p className="text-xs text-[#5C3A21] mt-2 text-center">
Advisory: {advisory}
</p>

</CardContent>

</Card>

</div>

</div>

</div>

);

};

export default MarketPrices;