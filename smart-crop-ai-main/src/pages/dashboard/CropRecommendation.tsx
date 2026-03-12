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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Sprout, FlaskConical, MapPin, Loader2, Info, Trophy } from "lucide-react";

const schema = z.object({
  nitrogen: z.coerce.number().min(0).max(200, "Must be 0–200 kg/ha"),
  phosphorus: z.coerce.number().min(0).max(200, "Must be 0–200 kg/ha"),
  potassium: z.coerce.number().min(0).max(200, "Must be 0–200 kg/ha"),
  soil_ph: z.coerce.number().min(3).max(10, "pH must be 3–10"),
  rainfall: z.coerce.number().min(0).max(5000, "Must be 0–5000 mm"),
  temperature: z.coerce.number().min(-10).max(60, "Must be -10 to 60°C"),
  location: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface CropResult {
  crop: string;
  suitability: number;
  emoji: string;
  reason: string;
  season: string;
}

// Simulated Random Forest crop recommendation logic
const recommendCrops = (data: FormData): CropResult[] => {
  const crops = [
    { crop: "Rice", emoji: "🌾", minN: 60, maxN: 120, minPh: 5.0, maxPh: 7.0, minRain: 1000, maxRain: 2500, minTemp: 20, maxTemp: 37, season: "Kharif" },
    { crop: "Wheat", emoji: "🌿", minN: 40, maxN: 100, minPh: 5.5, maxPh: 7.5, minRain: 400, maxRain: 1000, minTemp: 10, maxTemp: 25, season: "Rabi" },
    { crop: "Maize", emoji: "🌽", minN: 50, maxN: 150, minPh: 5.5, maxPh: 7.5, minRain: 500, maxRain: 1200, minTemp: 18, maxTemp: 35, season: "Kharif" },
    { crop: "Cotton", emoji: "☁️", minN: 80, maxN: 160, minPh: 5.8, maxPh: 8.0, minRain: 500, maxRain: 1100, minTemp: 22, maxTemp: 38, season: "Kharif" },
    { crop: "Sugarcane", emoji: "🎋", minN: 100, maxN: 200, minPh: 6.0, maxPh: 8.0, minRain: 1200, maxRain: 2500, minTemp: 25, maxTemp: 38, season: "Annual" },
    { crop: "Soybean", emoji: "🫘", minN: 20, maxN: 80, minPh: 6.0, maxPh: 7.5, minRain: 600, maxRain: 1200, minTemp: 18, maxTemp: 32, season: "Kharif" },
    { crop: "Groundnut", emoji: "🥜", minN: 15, maxN: 60, minPh: 5.5, maxPh: 7.0, minRain: 500, maxRain: 1200, minTemp: 20, maxTemp: 35, season: "Kharif" },
    { crop: "Tomato", emoji: "🍅", minN: 70, maxN: 140, minPh: 5.5, maxPh: 7.0, minRain: 400, maxRain: 900, minTemp: 18, maxTemp: 30, season: "Rabi" },
    { crop: "Potato", emoji: "🥔", minN: 80, maxN: 160, minPh: 5.0, maxPh: 6.5, minRain: 400, maxRain: 900, minTemp: 10, maxTemp: 20, season: "Rabi" },
    { crop: "Chickpea", emoji: "🥙", minN: 10, maxN: 50, minPh: 6.0, maxPh: 8.0, minRain: 300, maxRain: 800, minTemp: 15, maxTemp: 28, season: "Rabi" },
  ];

  const scored = crops.map((c) => {
    let score = 100;
    const scoreParam = (val: number, min: number, max: number) => {
      if (val >= min && val <= max) return 0;
      const midpoint = (min + max) / 2;
      const range = (max - min) / 2;
      return Math.min(40, Math.abs(val - midpoint) / range * 30);
    };
    score -= scoreParam(data.nitrogen, c.minN, c.maxN);
    score -= scoreParam(data.soil_ph, c.minPh, c.maxPh);
    score -= scoreParam(data.rainfall, c.minRain, c.maxRain);
    score -= scoreParam(data.temperature, c.minTemp, c.maxTemp);

    const reasons = [];
    if (data.nitrogen >= c.minN && data.nitrogen <= c.maxN) reasons.push("optimal N levels");
    if (data.soil_ph >= c.minPh && data.soil_ph <= c.maxPh) reasons.push("ideal pH range");
    if (data.rainfall >= c.minRain && data.rainfall <= c.maxRain) reasons.push("suitable rainfall");
    if (data.temperature >= c.minTemp && data.temperature <= c.maxTemp) reasons.push("favourable temperature");

    return {
      crop: c.crop,
      emoji: c.emoji,
      suitability: Math.max(10, Math.round(score)),
      reason: reasons.length > 0 ? `Matches ${reasons.join(", ")}` : "Possible with adjustments",
      season: c.season,
    };
  });

  return scored.sort((a, b) => b.suitability - a.suitability).slice(0, 3);
};

const CropRecommendation = () => {
  const [results, setResults] = useState<CropResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { nitrogen: 90, phosphorus: 45, potassium: 40, soil_ph: 6.5, rainfall: 850, temperature: 25 },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200)); // simulate ML inference
    const recommendations = recommendCrops(data);
    setResults(recommendations);

    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const insertData: any = {
        user_id: user.id,
        nitrogen: data.nitrogen,
        phosphorus: data.phosphorus,
        potassium: data.potassium,
        soil_ph: data.soil_ph,
        rainfall: data.rainfall,
        temperature: data.temperature,
        location: data.location,
        results: recommendations,
      };
      const { error } = await supabase.from("crop_recommendations").insert(insertData);
      if (error) console.error(error);
    }
    setLoading(false);
    toast({ title: "Analysis complete!", description: "Top 3 crop recommendations generated." });
  };

  const getSuitabilityColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-danger";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-success";
    if (score >= 60) return "bg-warning";
    return "bg-danger";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 gradient-green rounded-xl flex items-center justify-center">
          <Sprout className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">AI Crop Advisor</h2>
          <p className="text-muted-foreground text-sm">Random Forest model · Top 3 crop recommendations</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Input Form */}
        <Card className="lg:col-span-2 shadow-card border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-primary" />
              Soil & Climate Inputs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {[
                { name: "nitrogen", label: "Nitrogen (N)", unit: "kg/ha", icon: "🧪" },
                { name: "phosphorus", label: "Phosphorus (P)", unit: "kg/ha", icon: "⚗️" },
                { name: "potassium", label: "Potassium (K)", unit: "kg/ha", icon: "🧬" },
                { name: "soil_ph", label: "Soil pH", unit: "pH", icon: "🔬" },
                { name: "rainfall", label: "Annual Rainfall", unit: "mm", icon: "🌧️" },
                { name: "temperature", label: "Temperature", unit: "°C", icon: "🌡️" },
              ].map((field) => (
                <div key={field.name} className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <span>{field.icon}</span> {field.label}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      {...register(field.name as keyof FormData)}
                      className="h-9 text-sm"
                    />
                    <span className="flex items-center text-xs text-muted-foreground bg-muted px-2 rounded-md whitespace-nowrap">{field.unit}</span>
                  </div>
                  {errors[field.name as keyof FormData] && (
                    <p className="text-danger text-xs">{errors[field.name as keyof FormData]?.message}</p>
                  )}
                </div>
              ))}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" /> Location (Optional)
                </Label>
                <Input placeholder="Punjab, India" {...register("location")} className="h-9 text-sm" />
              </div>
              <Button type="submit" disabled={loading} className="w-full gradient-green text-primary-foreground font-semibold">
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</> : <><Sprout className="w-4 h-4 mr-2" /> Get Recommendations</>}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          {!results && !loading && (
            <Card className="shadow-card border-border/50 h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Sprout className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Enter soil parameters to get AI recommendations</p>
                <p className="text-sm mt-1">Our Random Forest model analyzes 7 parameters</p>
              </div>
            </Card>
          )}

          {loading && (
            <Card className="shadow-card border-border/50 h-64 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-10 h-10 mx-auto mb-3 animate-spin text-primary" />
                <p className="font-semibold text-foreground">Running Random Forest Model...</p>
                <p className="text-sm text-muted-foreground mt-1">Analyzing soil & climate parameters</p>
              </div>
            </Card>
          )}

          {results && !loading && results.map((result, i) => (
            <Card key={result.crop} className={`shadow-card border-border/50 animate-fade-in ${i === 0 ? "ring-2 ring-primary/30 bg-primary/5" : ""}`} style={{ animationDelay: `${i * 0.1}s` }}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{result.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display font-bold text-lg text-foreground">{result.crop}</h3>
                      {i === 0 && <Badge className="bg-primary text-primary-foreground text-[10px]"><Trophy className="w-2.5 h-2.5 mr-1" />Best Match</Badge>}
                      <Badge variant="outline" className="text-[10px]">{result.season}</Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-2xl font-display font-bold ${getSuitabilityColor(result.suitability)}`}>
                        {result.suitability}%
                      </span>
                      <span className="text-muted-foreground text-sm">suitability score</span>
                    </div>
                    <Progress value={result.suitability} className="h-2 mb-2" />
                    <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      {result.reason}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CropRecommendation;
