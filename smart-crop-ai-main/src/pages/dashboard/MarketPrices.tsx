import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TrendingUp, Search } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

const MARKET_DATA: Record<string, { base: number; unit: string; emoji: string }> = {
  Rice: { base: 22, unit: "₹/kg", emoji: "🌾" },
  Wheat: { base: 21, unit: "₹/kg", emoji: "🌿" },
  Maize: { base: 18, unit: "₹/kg", emoji: "🌽" },
  Cotton: { base: 65, unit: "₹/kg", emoji: "☁️" },
  Soybean: { base: 45, unit: "₹/kg", emoji: "🫘" },
  Tomato: { base: 25, unit: "₹/kg", emoji: "🍅" },
  Potato: { base: 14, unit: "₹/kg", emoji: "🥔" },
  Sugarcane: { base: 3.5, unit: "₹/kg", emoji: "🎋" },
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const generateForecast = (base: number) => {
  return MONTHS.map((month, i) => {
    const seasonal = Math.sin((i - 2) * Math.PI / 6) * base * 0.15;
    const noise = (Math.random() - 0.5) * base * 0.08;
    const trend = i > 8 ? base * 0.05 : 0;
    return { month, price: +(base + seasonal + noise + trend).toFixed(2), forecast: i >= 6 };
  });
};

const MarketPrices = () => {
  const [selectedCrop, setSelectedCrop] = useState("Rice");
  const [search, setSearch] = useState("");

  const crops = Object.keys(MARKET_DATA).filter(c => c.toLowerCase().includes(search.toLowerCase()));
  const crop = MARKET_DATA[selectedCrop];
  const data = generateForecast(crop.base);
  const maxMonth = data.reduce((a, b) => (a.price > b.price ? a : b));
  const currentPrice = data[new Date().getMonth()].price;
  const change = ((currentPrice - crop.base) / crop.base * 100).toFixed(1);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-gradient-accent rounded-xl flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-accent-foreground" />
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">Market Price Forecast</h2>
          <p className="text-muted-foreground text-sm">Time-series prediction · Optimal selling time advisory</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Select Crop</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-xs" />
            </div>
          </CardHeader>
          <CardContent className="p-2 space-y-1">
            {crops.map(c => (
              <button key={c} onClick={() => setSelectedCrop(c)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${selectedCrop === c ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted text-foreground"}`}>
                <span>{MARKET_DATA[c].emoji}</span> {c}
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Card className="shadow-card border-border/50">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Current Price</p>
                <p className="text-2xl font-display font-bold text-foreground">{crop.unit[0]}{currentPrice}</p>
                <Badge className={+change >= 0 ? "bg-success/10 text-success border-success/20 text-xs" : "bg-danger/10 text-danger border-danger/20 text-xs"}>
                  {+change >= 0 ? "+" : ""}{change}% vs avg
                </Badge>
              </CardContent>
            </Card>
            <Card className="shadow-card border-border/50">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Best Month to Sell</p>
                <p className="text-2xl font-display font-bold text-foreground">{maxMonth.month}</p>
                <p className="text-xs text-muted-foreground">Est. {crop.unit[0]}{maxMonth.price}/kg</p>
              </CardContent>
            </Card>
            <Card className="shadow-card border-border/50">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Annual Average</p>
                <p className="text-2xl font-display font-bold text-foreground">{crop.unit[0]}{crop.base}</p>
                <p className="text-xs text-muted-foreground">Base price/kg</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{selectedCrop} Price Trend & Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(140,20%,90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "10px", fontSize: "12px" }} formatter={(v) => [`${crop.unit[0]}${v}`, "Price"]} />
                  <Line type="monotone" dataKey="price" stroke="hsl(145,63%,28%)" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-muted-foreground mt-2 text-center">Dashed area = forecasted prices (Jul–Dec)</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MarketPrices;
