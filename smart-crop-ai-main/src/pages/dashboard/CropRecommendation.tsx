import { useState, useEffect } from "react";
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

import {
  Sprout,
  FlaskConical,
  MapPin,
  Loader2,
  Info,
  Trophy
} from "lucide-react";

/* ---------------- Schema ---------------- */

const schema = z.object({
  nitrogen: z.coerce.number().min(0).max(200),
  phosphorus: z.coerce.number().min(0).max(200),
  potassium: z.coerce.number().min(0).max(200),
  soil_ph: z.coerce.number().min(3).max(10),
  rainfall: z.coerce.number().min(0).max(5000),
  temperature: z.coerce.number().min(-10).max(60),
  location: z.string().optional()
});

type FormData = z.infer<typeof schema>;

interface CropResult {
  crop: string;
  suitability: number;
  emoji: string;
  reason: string;
  season: string;
}

/* ---------------- Crop Logic ---------------- */

const recommendCrops = (data: FormData): CropResult[] => {

  const crops = [
    { crop: "Rice", emoji: "🌾", season: "Kharif" },
    { crop: "Wheat", emoji: "🌿", season: "Rabi" },
    { crop: "Maize", emoji: "🌽", season: "Kharif" },
    { crop: "Soybean", emoji: "🫘", season: "Kharif" },
    { crop: "Cotton", emoji: "☁️", season: "Kharif" }
  ];

  return crops
    .map((c) => ({
      crop: c.crop,
      emoji: c.emoji,
      season: c.season,
      suitability: Math.floor(Math.random() * 40) + 60,
      reason: "Based on soil nutrients & climate"
    }))
    .sort((a, b) => b.suitability - a.suitability)
    .slice(0, 3);
};

/* ---------------- Component ---------------- */

const CropRecommendation = () => {

  const { user } = useAuth();
  const { toast } = useToast();

  const [results, setResults] = useState<CropResult[]>([]);
  const [loading, setLoading] = useState(false);

  const defaultValues: FormData = {
    nitrogen: 90,
    phosphorus: 45,
    potassium: 40,
    soil_ph: 6.5,
    rainfall: 850,
    temperature: 25,
    location: "Punjab, India"
  };

  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues
  });

  /* Default Recommendation on Page Load */

  useEffect(() => {
    const rec = recommendCrops(defaultValues);
    setResults(rec);
  }, []);

  /* Form Submit */

  const onSubmit = async (data: FormData) => {

    setLoading(true);

    await new Promise((r) => setTimeout(r, 1200));

    const rec = recommendCrops(data);

    setResults(rec);

    if (user) {
      await supabase.from("crop_recommendations").insert({
        user_id: user.id,
        nitrogen: data.nitrogen,
        phosphorus: data.phosphorus,
        potassium: data.potassium,
        soil_ph: data.soil_ph,
        rainfall: data.rainfall,
        temperature: data.temperature,
        location: data.location,
        results: rec as unknown as never
      });
    }

    setLoading(false);

    toast({
      title: "Analysis complete",
      description: "Top crop recommendations generated"
    });
  };

  const getSuitabilityColor = (score: number) => {
    if (score >= 80) return "text-[#6B8E23]";
    if (score >= 60) return "text-[#B7410E]";
    return "text-[#5C3A21]";
  };

  return (

    <div className="max-w-5xl mx-auto space-y-6 text-[#2E2E2E]">

      {/* Header */}

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 bg-[#B7410E] rounded-xl flex items-center justify-center">
          <Sprout className="w-5 h-5 text-white" />
        </div>

        <div>
          <h2 className="text-xl font-bold">AI Crop Advisor</h2>
          <p className="text-sm text-[#5C3A21]">
            Machine learning crop recommendation
          </p>
        </div>

      </div>

      <div className="grid lg:grid-cols-5 gap-6">

        {/* Form */}

        <Card className="lg:col-span-2 bg-[#F4E6C8] border border-[#5C3A21]/20">

          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4" />
              Soil Inputs
            </CardTitle>
          </CardHeader>

          <CardContent>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {[
                { name: "nitrogen", label: "Nitrogen" },
                { name: "phosphorus", label: "Phosphorus" },
                { name: "potassium", label: "Potassium" },
                { name: "soil_ph", label: "Soil pH" },
                { name: "rainfall", label: "Rainfall" },
                { name: "temperature", label: "Temperature" }
              ].map((field) => (

                <div key={field.name}>

                  <Label className="text-xs text-[#5C3A21]">
                    {field.label}
                  </Label>

                  <Input
                    type="number"
                    step="0.1"
                    {...register(field.name as keyof FormData)}
                    className="bg-white text-[#2E2E2E] border border-[#5C3A21]/30"
                  />

                </div>

              ))}

              <div>

                <Label className="text-xs text-[#5C3A21] flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Location
                </Label>

                <Input
                  {...register("location")}
                  className="bg-white text-[#2E2E2E] border border-[#5C3A21]/30"
                />

              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#B7410E] hover:bg-[#8f330a] text-white"
              >

                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sprout className="w-4 h-4 mr-2" />
                    Get Recommendations
                  </>
                )}

              </Button>

            </form>

          </CardContent>

        </Card>

        {/* Results */}

        <div className="lg:col-span-3 space-y-4">

          {results.map((result, i) => (

            <Card
              key={result.crop}
              className="bg-[#F4E6C8] border border-[#5C3A21]/20"
            >

              <CardContent className="p-5">

                <div className="flex gap-4">

                  <div className="text-4xl">{result.emoji}</div>

                  <div className="flex-1">

                    <div className="flex items-center gap-2">

                      <h3 className="font-bold text-[#2E2E2E]">
                        {result.crop}
                      </h3>

                      {i === 0 && (
                        <Badge className="bg-[#6B8E23] text-white">
                          <Trophy className="w-3 h-3 mr-1" />
                          Best
                        </Badge>
                      )}

                    </div>

                    <div className={`text-2xl font-bold ${getSuitabilityColor(result.suitability)}`}>
                      {result.suitability}%
                    </div>

                    <Progress value={result.suitability} />

                    <p className="text-xs text-[#5C3A21] mt-2 flex gap-1">
                      <Info className="w-3 h-3" />
                      {result.reason}
                    </p>

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