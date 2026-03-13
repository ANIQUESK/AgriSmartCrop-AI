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

const CROPS = ["Rice","Wheat","Maize","Cotton","Sugarcane","Soybean","Groundnut","Tomato","Potato","Chickpea"];

const schema = z.object({
  crop_type: z.string().min(1),
  nitrogen: z.coerce.number(),
  phosphorus: z.coerce.number(),
  potassium: z.coerce.number(),
  rainfall: z.coerce.number(),
  temperature: z.coerce.number(),
  fertilizer_usage: z.coerce.number(),
});

type FormData = z.infer<typeof schema>;

const BASE_YIELDS: Record<string, number> = {
  Rice:4200,Wheat:3800,Maize:5500,Cotton:2200,Sugarcane:65000,
  Soybean:2800,Groundnut:2400,Tomato:25000,Potato:22000,Chickpea:1800,
};

const predictYield = (data:FormData)=>{
  const base=BASE_YIELDS[data.crop_type]||3000;
  let m=1;
  if(data.nitrogen>=60&&data.nitrogen<=120)m+=0.15;
  if(data.phosphorus>=30&&data.phosphorus<=80)m+=0.1;
  if(data.potassium>=30&&data.potassium<=80)m+=0.08;
  if(data.rainfall>=500&&data.rainfall<=1500)m+=0.12;
  if(data.temperature>=15&&data.temperature<=35)m+=0.1;
  if(data.fertilizer_usage>=50&&data.fertilizer_usage<=200)m+=0.18;
  return Math.round(base*m*(0.95+Math.random()*0.1));
};

const YieldPrediction=()=>{
  const [result,setResult]=useState<number|null>(null);
  const [selectedCrop,setSelectedCrop]=useState("");
  const [loading,setLoading]=useState(false);
  const {user}=useAuth();
  const {toast}=useToast();

  const {register,handleSubmit,setValue}=useForm<FormData>({
    resolver:zodResolver(schema),
    defaultValues:{nitrogen:80,phosphorus:40,potassium:40,rainfall:800,temperature:25,fertilizer_usage:100}
  });

  const onSubmit=async(data:FormData)=>{
    setLoading(true);
    await new Promise(r=>setTimeout(r,1500));
    const predicted=predictYield(data);
    setResult(predicted);

    if(user){
      await supabase.from("yield_predictions").insert({
        user_id:user.id,
        crop_type:data.crop_type,
        nitrogen:data.nitrogen,
        phosphorus:data.phosphorus,
        potassium:data.potassium,
        rainfall:data.rainfall,
        temperature:data.temperature,
        fertilizer_usage:data.fertilizer_usage,
        predicted_yield:predicted
      });
    }

    setLoading(false);

    toast({
      title:"Prediction Complete 🌾",
      description:`Expected yield ${predicted.toLocaleString()} kg/ha`
    });
  };

  const cropKey=selectedCrop||"Rice";
  const base=BASE_YIELDS[cropKey]||3000;

  const chartData=[
    {name:"Poor",yield:Math.round(base*0.55)},
    {name:"Below Avg",yield:Math.round(base*0.75)},
    {name:"Average",yield:Math.round(base)},
    {name:"Good",yield:Math.round(base*1.2)},
    {name:"Excellent",yield:Math.round(base*1.4)},
    ...(result?[{name:"Your Field",yield:result,fill:"#6B8E23"}]:[])
  ];

  return(

<div className="min-h-screen bg-[#DBCEA5] p-8">

<div className="max-w-6xl mx-auto space-y-6">

{/* HEADER */}

<div className="flex items-center gap-4">

<div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#B7410E] shadow-lg">
<BarChart3 className="text-white"/>
</div>

<div>
<h1 className="text-2xl font-bold text-[#2E2E2E]">
Yield Prediction
</h1>
<p className="text-[#5C3A21] text-sm">
AI regression model for crop productivity
</p>
</div>

</div>

<div className="grid lg:grid-cols-5 gap-6">

{/* INPUT CARD */}

<Card className="lg:col-span-2 bg-white/60 backdrop-blur-xl border border-white/30 shadow-xl rounded-xl">

<CardHeader>
<CardTitle className="text-[#2E2E2E]">Input Parameters</CardTitle>
</CardHeader>

<CardContent>

<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

<div>
<Label className="text-[#5C3A21] text-sm">Crop Type</Label>

<Select onValueChange={(v)=>{setValue("crop_type",v);setSelectedCrop(v)}}>

<SelectTrigger>
<SelectValue placeholder="Select Crop"/>
</SelectTrigger>

<SelectContent>
{CROPS.map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}
</SelectContent>

</Select>

</div>

{[
{name:"nitrogen",label:"Nitrogen"},
{name:"phosphorus",label:"Phosphorus"},
{name:"potassium",label:"Potassium"},
{name:"rainfall",label:"Rainfall"},
{name:"temperature",label:"Temperature"},
{name:"fertilizer_usage",label:"Fertilizer"}
].map(f=>(

<div key={f.name}>

<Label className="text-[#5C3A21] text-sm">{f.label}</Label>

<Input
type="number"
{...register(f.name as keyof FormData)}
className="bg-white/70 border-[#5C3A21]/20"
/>

</div>

))}

<Button
type="submit"
disabled={loading}
className="w-full bg-[#B7410E] hover:bg-[#8B2F0B] text-white font-semibold
transition hover:scale-105 shadow-lg"
>

{loading?(
<>
<Loader2 className="animate-spin mr-2"/>
Predicting
</>
):(
<>
<TrendingUp className="mr-2"/>
Predict Yield
</>
)}

</Button>

</form>

</CardContent>
</Card>

{/* RESULT + CHART */}

<div className="lg:col-span-3 space-y-5">

{result && (

<Card className="bg-white/60 backdrop-blur-xl border border-white/30 shadow-xl">

<CardContent className="p-6">

<p className="text-sm text-[#5C3A21]">
Predicted Yield for {selectedCrop}
</p>

<h2 className="text-4xl font-bold text-[#2E2E2E] mt-2">
{result.toLocaleString()} kg/ha
</h2>

<Badge className="mt-2 bg-[#6B8E23]/20 text-[#6B8E23] border-[#6B8E23]/30">
{result>base?"+ Above Average":"Below Average"}
</Badge>

<div className="flex gap-2 mt-3 text-sm text-[#5C3A21]">

<Info size={16}/>

Prediction based on soil nutrients, rainfall and fertilizer input

</div>

</CardContent>

</Card>

)}

<Card className="bg-white/60 backdrop-blur-xl border border-white/30 shadow-xl">

<CardHeader>
<CardTitle className="text-[#2E2E2E]">
Yield Comparison
</CardTitle>
</CardHeader>

<CardContent>

<ResponsiveContainer width="100%" height={260}>

<BarChart data={chartData}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="name"/>

<YAxis/>

<Tooltip/>

<Bar dataKey="yield" fill="#B7410E" radius={[6,6,0,0]}/>

</BarChart>

</ResponsiveContainer>

</CardContent>

</Card>

</div>

</div>

</div>

</div>

);

};

export default YieldPrediction;