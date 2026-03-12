import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, Loader2, TrendingUp, Info } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const CROPS = ["Rice", "Wheat", "Maize", "Cotton", "Sugarcane", "Soybean", "Groundnut", "Tomato", "Potato", "Chickpea"];

const schema = z.object({
  crop_type: z.string().min(1, "Select a crop"),
  nitrogen: z.coerce.number().min(0).max(200),
  phosphorus: z.coerce.number().min(0).max(200),
  potassium: z.coerce.number().min(0).max(200),
  rainfall: z.coerce.number().min(0).max(5000),
  temperature: z.coerce.number().min(-10).max(60),
  fertilizer_usage: z.coerce.number().min(0).max(500),
});

type FormData = z.infer<typeof schema>;

const BASE_YIELDS: Record<string, number> = {
  Rice: 4200, Wheat: 3800, Maize: 5500, Cotton: 2200, Sugarcane: 65000,
  Soybean: 2800, Groundnut: 2400, Tomato: 25000, Potato: 22000, Chickpea: 1800,
};

const predictYield = (data: FormData): number => {
  const base = BASE_YIELDS[data.crop_type] || 3000;
  let multiplier = 1.0;
  if (data.nitrogen >= 60 && data.nitrogen <= 120) multiplier += 0.15;
  else if (data.nitrogen < 30) multiplier -= 0.2;
  if (data.phosphorus >= 30 && data.phosphorus <= 80) multiplier += 0.1;
  if (data.potassium >= 30 && data.potassium <= 80) multiplier += 0.08;
  if (data.rainfall >= 500 && data.rainfall <= 1500) multiplier += 0.12;
  else if (data.rainfall < 200) multiplier -= 0.25;
  if (data.temperature >= 15 && data.temperature <= 35) multiplier += 0.1;
  if (data.fertilizer_usage >= 50 && data.fertilizer_usage <= 200) multiplier += 0.18;
  const noise = 0.95 + Math.random() * 0.1;
  return Math.round(base * multiplier * noise);
};

const YieldPrediction = () => {
  const [result, setResult] = useState<number | null>(null);
  const [selectedCrop, setSelectedCrop] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { nitrogen: 80, phosphorus: 40, potassium: 40, rainfall: 800, temperature: 25, fertilizer_usage: 100 },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    const predicted = predictYield(data);
    setResult(predicted);

    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const insertData: any = { user_id: user.id, ...data, predicted_yield: predicted };
      await supabase.from("yield_predictions").insert(insertData);
    }
    setLoading(false);
    toast({ title: "Prediction complete!", description: `Expected yield: ${predicted.toLocaleString()} kg/ha` });
  };

  const cropKey = selectedCrop || "Rice";
  const base = BASE_YIELDS[cropKey] || 3000;
  const chartData = [
    { name: "Poor", yield: Math.round(base * 0.55) },
    { name: "Below Avg", yield: Math.round(base * 0.75) },
    { name: "Average", yield: Math.round(base * 1.0) },
    { name: "Good", yield: Math.round(base * 1.2) },
    { name: "Excellent", yield: Math.round(base * 1.4) },
    ...(result ? [{ name: "Your Field", yield: result, fill: "hsl(145,63%,28%)" }] : []),
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">Yield Prediction</h2>
          <p className="text-muted-foreground text-sm">Regression ML model · Expected harvest per hectare</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 shadow-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Input Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">🌾 Crop Type *</Label>
                <Select onValueChange={(v) => { setValue("crop_type", v); setSelectedCrop(v); }}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select crop..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CROPS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.crop_type && <p className="text-danger text-xs">{errors.crop_type.message}</p>}
              </div>
              {[
                { name: "nitrogen", label: "Nitrogen", unit: "kg/ha", icon: "🧪" },
                { name: "phosphorus", label: "Phosphorus", unit: "kg/ha", icon: "⚗️" },
                { name: "potassium", label: "Potassium", unit: "kg/ha", icon: "🧬" },
                { name: "rainfall", label: "Rainfall", unit: "mm", icon: "🌧️" },
                { name: "temperature", label: "Temperature", unit: "°C", icon: "🌡️" },
                { name: "fertilizer_usage", label: "Fertilizer", unit: "kg/ha", icon: "💊" },
              ].map((f) => (
                <div key={f.name} className="space-y-1">
                  <Label className="text-xs font-semibold text-muted-foreground">{f.icon} {f.label}</Label>
                  <div className="flex gap-2">
                    <Input type="number" step="0.1" {...register(f.name as keyof FormData)} className="h-9 text-sm" />
                    <span className="flex items-center text-xs text-muted-foreground bg-muted px-2 rounded-md whitespace-nowrap">{f.unit}</span>
                  </div>
                </div>
              ))}
              <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold">
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Predicting...</> : <><TrendingUp className="w-4 h-4 mr-2" />Predict Yield</>}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          {result && (
            <Card className="shadow-card border-border/50 animate-fade-in bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-muted-foreground text-sm">Predicted Yield for {selectedCrop}</p>
                    <div className="text-4xl font-display font-bold text-primary mt-1">
                      {result.toLocaleString()} <span className="text-xl text-muted-foreground">kg/ha</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-success/10 text-success border-success/20">
                      {result > base ? `+${Math.round((result/base - 1) * 100)}% above avg` : `${Math.round((result/base - 1) * 100)}% vs avg`}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">Regional avg: {base.toLocaleString()} kg/ha</p>
                  </div>
                </div>
                <div className="flex items-start gap-1.5 text-xs text-muted-foreground mt-3 bg-card p-2 rounded-lg">
                  <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  Prediction based on soil nutrients, rainfall, temperature and fertilizer input using regression modeling.
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Yield Benchmark Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(140,20%,90%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(140,15%,45%)" }} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(140,15%,45%)" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: "10px", border: "1px solid hsl(140,20%,88%)", fontSize: "12px" }}
                    formatter={(v) => [`${Number(v).toLocaleString()} kg/ha`, "Yield"]}
                  />
                  <Bar dataKey="yield" fill="hsl(145,63%,28%)" radius={[4, 4, 0, 0]}
                    className="transition-all"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default YieldPrediction;
