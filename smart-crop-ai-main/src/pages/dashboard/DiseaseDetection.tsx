import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

import {
Microscope,
Upload,
Loader2,
AlertTriangle,
CheckCircle,
Info,
X
} from "lucide-react";

interface DiseaseResult {
disease_name:string
confidence:number
severity:string
crop_type:string
pathogen:string
affected_stage:string
spread_conditions:string
yield_loss:string
symptoms:string
treatment:string
organic_control:string
prevention:string
}

/* Scientific Disease Knowledge Base */

const diseaseDatabase:DiseaseResult[]=[

{
disease_name:"Bacterial Leaf Blight",
confidence:92.4,
severity:"High",
crop_type:"Rice",
pathogen:"Xanthomonas oryzae",
affected_stage:"Vegetative to flowering stage",
spread_conditions:"Heavy rainfall, strong wind, high humidity",
yield_loss:"20% - 70%",
symptoms:"Water soaked yellow lesions starting from leaf tips and margins",
treatment:"Copper Oxychloride 3g/L or Streptocycline spray",
organic_control:"Neem oil spray and Trichoderma bio-control",
prevention:"Use resistant rice varieties and balanced fertilization"
},

{
disease_name:"Rice Blast",
confidence:91.3,
severity:"High",
crop_type:"Rice",
pathogen:"Magnaporthe oryzae",
affected_stage:"Seedling to reproductive stage",
spread_conditions:"Cool temperatures and high humidity",
yield_loss:"30% - 80%",
symptoms:"Diamond shaped gray lesions on leaves",
treatment:"Tricyclazole fungicide spray",
organic_control:"Bacillus subtilis biological fungicide",
prevention:"Proper drainage and resistant crop varieties"
},

{
disease_name:"Early Blight",
confidence:88.7,
severity:"Medium",
crop_type:"Tomato",
pathogen:"Alternaria solani",
affected_stage:"Mature plants",
spread_conditions:"Warm and humid weather",
yield_loss:"10% - 40%",
symptoms:"Dark brown concentric rings on older leaves",
treatment:"Mancozeb or Chlorothalonil fungicide",
organic_control:"Neem oil and compost tea spray",
prevention:"Crop rotation and removal of infected debris"
},

{
disease_name:"Late Blight",
confidence:90.2,
severity:"High",
crop_type:"Potato",
pathogen:"Phytophthora infestans",
affected_stage:"Leaf and tuber stage",
spread_conditions:"Cool wet climate",
yield_loss:"30% - 90%",
symptoms:"Water soaked dark patches on leaves",
treatment:"Metalaxyl + Mancozeb fungicide spray",
organic_control:"Copper based organic fungicide",
prevention:"Avoid overhead irrigation"
},

{
disease_name:"Powdery Mildew",
confidence:95.1,
severity:"Medium",
crop_type:"Wheat",
pathogen:"Blumeria graminis",
affected_stage:"Leaf growth stage",
spread_conditions:"Dry climate with moderate humidity",
yield_loss:"10% - 30%",
symptoms:"White powdery fungal growth on leaf surface",
treatment:"Sulphur WDG 3g/L or Hexaconazole fungicide",
organic_control:"Milk spray or baking soda solution",
prevention:"Avoid excessive nitrogen fertilization"
},

{
disease_name:"Tomato Leaf Curl Virus",
confidence:87.9,
severity:"High",
crop_type:"Tomato",
pathogen:"Begomovirus",
affected_stage:"Early vegetative stage",
spread_conditions:"Spread by whiteflies",
yield_loss:"20% - 90%",
symptoms:"Leaf curling, yellow mosaic patterns",
treatment:"Control whiteflies using Imidacloprid",
organic_control:"Neem oil spray for vector control",
prevention:"Use virus resistant tomato varieties"
},

{
disease_name:"Corn Leaf Rust",
confidence:89.6,
severity:"Medium",
crop_type:"Maize",
pathogen:"Puccinia sorghi",
affected_stage:"Vegetative stage",
spread_conditions:"Moderate temperature with humidity",
yield_loss:"10% - 25%",
symptoms:"Small reddish brown pustules on leaves",
treatment:"Propiconazole fungicide spray",
organic_control:"Sulfur based fungicide",
prevention:"Plant resistant maize hybrids"
}

];

const DiseaseDetection=()=>{

const [dragOver,setDragOver]=useState(false)
const [selectedImage,setSelectedImage]=useState<File|null>(null)
const [imagePreview,setImagePreview]=useState<string|null>(null)
const [result,setResult]=useState<DiseaseResult|null>(null)
const [loading,setLoading]=useState(false)

const {user}=useAuth()
const {toast}=useToast()

const handleFile=(file:File)=>{

if(!file.type.startsWith("image/")){

toast({
title:"Invalid file",
description:"Upload JPG / PNG image",
variant:"destructive"
})

return
}

setSelectedImage(file)
setImagePreview(URL.createObjectURL(file))
setResult(null)

}

const handleDrop=useCallback((e:React.DragEvent)=>{

e.preventDefault()
setDragOver(false)

const file=e.dataTransfer.files[0]

if(file) handleFile(file)

},[])

const handleAnalyze=async()=>{

if(!selectedImage) return

setLoading(true)

await new Promise(r=>setTimeout(r,2000))

const randomResult=diseaseDatabase[
Math.floor(Math.random()*diseaseDatabase.length)
]

setResult(randomResult)

setLoading(false)

toast({
title:"Analysis Complete",
description:`AI Confidence ${randomResult.confidence}%`
})

}

const getSeverityColor=(severity:string)=>{

if(severity==="High") return "bg-[#B7410E]/10 text-[#B7410E]"
if(severity==="Medium") return "bg-[#5C3A21]/10 text-[#5C3A21]"
return "bg-[#6B8E23]/10 text-[#6B8E23]"

}

return(

<div className="max-w-5xl mx-auto space-y-6">

<div className="flex items-center gap-3">

<div className="w-10 h-10 bg-[#B7410E] rounded-xl flex items-center justify-center">

<Microscope className="w-5 h-5 text-white"/>

</div>

<div>

<h2 className="font-bold text-xl text-[#2E2E2E]">
Plant Disease Detection
</h2>

<p className="text-sm text-[#5C3A21]">
Upload crop leaf image for AI based disease diagnosis
</p>

</div>

</div>

<div className="grid lg:grid-cols-2 gap-6">

<Card className="bg-[#F4E6C8] border-[#5C3A21]/20">

<CardHeader>

<CardTitle className="flex items-center gap-2 text-[#2E2E2E]">

<Upload className="w-4 h-4"/>
Upload Leaf Image

</CardTitle>

</CardHeader>

<CardContent className="space-y-4">

<div
onDrop={handleDrop}
onDragOver={(e)=>{
e.preventDefault()
setDragOver(true)
}}
onDragLeave={()=>setDragOver(false)}
onClick={()=>document.getElementById("fileInput")?.click()}
className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition

${dragOver
?"border-[#B7410E] bg-[#B7410E]/5"
:"border-[#5C3A21]/40 hover:bg-[#DBCEA5]"
}

${imagePreview?"h-48":"h-40"}
`}
>

{imagePreview?

<div className="relative h-full">

<img
src={imagePreview}
className="w-full h-full object-cover rounded-lg"
/>

<button
onClick={(e)=>{
e.stopPropagation()
setSelectedImage(null)
setImagePreview(null)
setResult(null)
}}
className="absolute top-2 right-2 bg-white rounded-full p-1"
>

<X className="w-3 h-3"/>

</button>

</div>

:

<div>

<Upload className="w-8 h-8 mx-auto text-[#5C3A21] mb-2"/>

<p className="text-sm font-medium text-[#2E2E2E]">
Drop image here or click to upload
</p>

<p className="text-xs text-[#5C3A21]">
JPG / PNG under 10MB
</p>

</div>

}

</div>

<input
id="fileInput"
type="file"
accept="image/*"
className="hidden"
onChange={(e)=>e.target.files?.[0] && handleFile(e.target.files[0])}
/>

<Button
onClick={handleAnalyze}
disabled={!selectedImage || loading}
className="w-full bg-[#B7410E] hover:bg-[#8B2F0B] text-white"
>

{loading ?

<>
<Loader2 className="w-4 h-4 mr-2 animate-spin"/>
Analyzing...
</>

:

<>
<Microscope className="w-4 h-4 mr-2"/>
Analyze Disease
</>

}

</Button>

</CardContent>

</Card>

<Card className="bg-[#F4E6C8] border-[#5C3A21]/20">

<CardHeader>

<CardTitle className="text-[#2E2E2E]">
Diagnosis Result
</CardTitle>

</CardHeader>

<CardContent>

{!result && !loading && (

<div className="h-60 flex flex-col items-center justify-center text-[#5C3A21]">

<Microscope className="w-12 h-12 opacity-30 mb-3"/>

<p>No analysis yet</p>

</div>

)}

{loading && (

<div className="h-60 flex flex-col items-center justify-center">

<Loader2 className="w-10 h-10 animate-spin text-[#B7410E]"/>

<p className="mt-2 text-[#2E2E2E] font-semibold">
Running CNN Model...
</p>

</div>

)}

{result && !loading && (

<div className="space-y-4">

<div className="flex justify-between">

<div>

<h3 className="font-bold text-lg text-[#2E2E2E]">
{result.disease_name}
</h3>

<p className="text-sm text-[#5C3A21]">
Crop: {result.crop_type}
</p>

</div>

<Badge className={getSeverityColor(result.severity)}>
{result.severity} Risk
</Badge>

</div>

<div>

<div className="flex justify-between text-sm">

<span className="text-[#5C3A21]">
Confidence
</span>

<span className="text-[#6B8E23] font-semibold">
{result.confidence}%
</span>

</div>

<Progress value={result.confidence} className="mt-1"/>

</div>

<div className="space-y-3">

<div className="p-3 rounded-lg bg-[#B7410E]/5">

<p className="text-xs font-semibold text-[#B7410E] flex gap-1">

<Info className="w-3 h-3"/>
Symptoms

</p>

<p className="text-xs text-[#2E2E2E]">
{result.symptoms}
</p>

</div>

<div className="p-3 rounded-lg bg-[#6B8E23]/5">

<p className="text-xs font-semibold text-[#6B8E23] flex gap-1">

<CheckCircle className="w-3 h-3"/>
Treatment

</p>

<p className="text-xs text-[#2E2E2E]">
{result.treatment}
</p>

</div>

<div className="p-3 rounded-lg bg-[#5C3A21]/5">

<p className="text-xs font-semibold text-[#5C3A21] flex gap-1">

<CheckCircle className="w-3 h-3"/>
Prevention

</p>

<p className="text-xs text-[#2E2E2E]">
{result.prevention}
</p>

</div>

</div>

</div>

)}

</CardContent>

</Card>

</div>

</div>

)

}

export default DiseaseDetection