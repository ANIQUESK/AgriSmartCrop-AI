import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Bug, Search, ChevronDown, ChevronUp } from "lucide-react";

interface Pest {
name:string
scientific:string
category:string
crops:string[]
severity:string
emoji:string
symptoms:string
treatment:string
biological:string
prevention:string
etl:string
weather:string
yieldLoss:string
season:string
}

/* Extended Agricultural Pest Database */

const PESTS:Pest[]=[

{
name:"Aphids",
scientific:"Aphis gossypii",
category:"Sap sucking insect",
crops:["Wheat","Mustard","Vegetables"],
severity:"Medium",
emoji:"🐛",
symptoms:"Leaves curl and turn yellow with sticky honeydew deposits.",
treatment:"Imidacloprid 0.3 ml/L spray.",
biological:"Release ladybird beetles or lacewings.",
prevention:"Avoid excessive nitrogen fertilizer.",
etl:"20–25 aphids per plant.",
weather:"Cool humid weather encourages multiplication.",
yieldLoss:"10%–35%",
season:"Winter"
},

{
name:"Brown Planthopper",
scientific:"Nilaparvata lugens",
category:"Sap sucking insect",
crops:["Rice"],
severity:"High",
emoji:"🦗",
symptoms:"Plants dry rapidly causing hopper burn.",
treatment:"Buprofezin or Imidacloprid spray.",
biological:"Encourage mirid bugs and spiders.",
prevention:"Maintain proper spacing and balanced fertilizer.",
etl:"10 insects per hill.",
weather:"High humidity and temperature.",
yieldLoss:"20%–70%",
season:"Kharif"
},

{
name:"Fall Armyworm",
scientific:"Spodoptera frugiperda",
category:"Leaf feeding caterpillar",
crops:["Maize","Sorghum"],
severity:"High",
emoji:"🐛",
symptoms:"Large holes in leaves and heavy feeding inside whorl.",
treatment:"Emamectin Benzoate 0.4 g/L.",
biological:"Release Trichogramma parasitoids.",
prevention:"Install pheromone traps.",
etl:"5 larvae per 20 plants.",
weather:"Warm tropical conditions.",
yieldLoss:"20%–60%",
season:"Kharif"
},

{
name:"Whitefly",
scientific:"Bemisia tabaci",
category:"Sap sucking insect",
crops:["Cotton","Tomato"],
severity:"High",
emoji:"🦋",
symptoms:"Leaves yellow and curl; viruses transmitted.",
treatment:"Spiromesifen spray.",
biological:"Parasitoid Encarsia formosa.",
prevention:"Yellow sticky traps.",
etl:"5 adults per leaf.",
weather:"Hot dry climate.",
yieldLoss:"15%–50%",
season:"Kharif"
},

{
name:"Stem Borer",
scientific:"Scirpophaga incertulas",
category:"Borer insect",
crops:["Rice","Maize"],
severity:"High",
emoji:"🐛",
symptoms:"Dead heart and white ear heads.",
treatment:"Fipronil granules.",
biological:"Trichogramma egg parasitoids.",
prevention:"Destroy crop residues.",
etl:"10% dead hearts.",
weather:"Humid monsoon climate.",
yieldLoss:"20%–60%",
season:"Kharif"
},

{
name:"Thrips",
scientific:"Thrips tabaci",
category:"Sap sucking insect",
crops:["Onion","Chilli","Cotton"],
severity:"Medium",
emoji:"🦟",
symptoms:"Silvery streaks on leaves and leaf curling.",
treatment:"Spinosad spray.",
biological:"Predatory mites.",
prevention:"Reflective mulches.",
etl:"5 thrips per leaf.",
weather:"Dry hot weather.",
yieldLoss:"10%–30%",
season:"Dry season"
},

{
name:"Locust",
scientific:"Schistocerca gregaria",
category:"Migratory pest",
crops:["All crops"],
severity:"Critical",
emoji:"🦗",
symptoms:"Large swarms eat leaves and stems rapidly.",
treatment:"Malathion ULV spray.",
biological:"Metarhizium fungal biopesticide.",
prevention:"Early warning monitoring systems.",
etl:"Swarm detection stage.",
weather:"Post rainfall desert conditions.",
yieldLoss:"Up to 100%",
season:"Post monsoon"
},

{
name:"Red Spider Mite",
scientific:"Tetranychus urticae",
category:"Mite pest",
crops:["Vegetables","Cotton"],
severity:"Medium",
emoji:"🕷️",
symptoms:"Yellow speckling on leaves and leaf bronzing.",
treatment:"Abamectin or Dicofol spray.",
biological:"Predatory mites (Phytoseiulus).",
prevention:"Maintain humidity levels.",
etl:"5 mites per leaf.",
weather:"Hot dry weather.",
yieldLoss:"15%–35%",
season:"Summer"
},

{
name:"Fruit Fly",
scientific:"Bactrocera dorsalis",
category:"Fruit boring insect",
crops:["Mango","Vegetables"],
severity:"High",
emoji:"🪰",
symptoms:"Maggots inside fruits causing decay.",
treatment:"Protein bait traps with insecticide.",
biological:"Parasitoid wasps.",
prevention:"Destroy infected fruits.",
etl:"2 flies per trap per day.",
weather:"Warm humid weather.",
yieldLoss:"20%–80%",
season:"Summer"
},

{
name:"Termites",
scientific:"Odontotermes obesus",
category:"Soil pest",
crops:["Sugarcane","Wheat"],
severity:"High",
emoji:"🐜",
symptoms:"Hollow stems and wilting plants.",
treatment:"Chlorpyrifos soil treatment.",
biological:"Entomopathogenic fungi.",
prevention:"Destroy termite mounds.",
etl:"Visible plant damage.",
weather:"Dry soil conditions.",
yieldLoss:"15%–50%",
season:"Dry season"
},

{
name:"Diamondback Moth",
scientific:"Plutella xylostella",
category:"Leaf feeding insect",
crops:["Cabbage","Cauliflower"],
severity:"High",
emoji:"🦋",
symptoms:"Small holes in leaves.",
treatment:"Spinosad spray.",
biological:"Parasitoid wasp Diadegma semiclausum.",
prevention:"Use insect nets.",
etl:"1 larva per plant.",
weather:"Moderate temperature.",
yieldLoss:"20%–40%",
season:"Winter"
},

{
name:"Cutworm",
scientific:"Agrotis ipsilon",
category:"Soil feeding caterpillar",
crops:["Maize","Vegetables"],
severity:"High",
emoji:"🐛",
symptoms:"Seedlings cut at ground level.",
treatment:"Chlorpyrifos soil treatment.",
biological:"Use parasitic nematodes.",
prevention:"Field sanitation.",
etl:"5% seedling damage.",
weather:"Cool moist soil.",
yieldLoss:"10%–30%",
season:"Early crop stage"
}

];

const severityColor={
Critical:"bg-red-100 text-red-700 border-red-300",
High:"bg-orange-100 text-orange-700 border-orange-300",
Medium:"bg-yellow-100 text-yellow-700 border-yellow-300",
Low:"bg-green-100 text-green-700 border-green-300"
};

const PestAdvisory=()=>{

const [search,setSearch]=useState("");
const [expanded,setExpanded]=useState<string|null>(null);

const filtered=PESTS.filter(p=>
p.name.toLowerCase().includes(search.toLowerCase())||
p.crops.some(c=>c.toLowerCase().includes(search.toLowerCase()))
);

return(

<div className="min-h-screen bg-[#DBCEA5] p-8">

<div className="max-w-4xl mx-auto space-y-6">

<div className="flex items-center gap-3">

<div className="w-10 h-10 bg-[#B7410E] rounded-xl flex items-center justify-center shadow">
<Bug className="text-white w-5 h-5"/>
</div>

<div>
<h2 className="text-xl font-bold text-[#2E2E2E]">Pest Advisory</h2>
<p className="text-sm text-[#5C3A21]">Crop pest knowledge base</p>
</div>

</div>

<div className="relative">

<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C3A21]" />

<Input
value={search}
onChange={(e)=>setSearch(e.target.value)}
placeholder="Search pests or crops..."
className="pl-10 bg-white"
/>

</div>

<div className="space-y-3">

{filtered.map(pest=>(

<Card key={pest.name} className="bg-white/70 backdrop-blur shadow">

<button
className="w-full text-left"
onClick={()=>setExpanded(expanded===pest.name?null:pest.name)}
>

<CardContent className="p-4">

<div className="flex justify-between">

<div className="flex gap-3">

<span className="text-3xl">{pest.emoji}</span>

<div>

<div className="flex gap-2 items-center">

<h3 className="font-bold text-[#2E2E2E]">{pest.name}</h3>

<Badge className={`${severityColor[pest.severity]} text-xs`}>
{pest.severity}
</Badge>

</div>

<div className="text-xs text-[#5C3A21] mt-1">
{pest.crops.join(", ")}
</div>

</div>

</div>

{expanded===pest.name?
<ChevronUp className="w-4 h-4 text-[#5C3A21]"/> :
<ChevronDown className="w-4 h-4 text-[#5C3A21]"/>}

</div>

</CardContent>

</button>

{expanded===pest.name &&(

<div className="px-4 pb-4 space-y-3">

<div className="bg-red-50 border border-red-200 p-3 rounded">
<p className="text-xs font-bold text-red-700">Symptoms</p>
<p className="text-xs">{pest.symptoms}</p>
</div>

<div className="bg-blue-50 border border-blue-200 p-3 rounded">
<p className="text-xs font-bold text-blue-700">Treatment</p>
<p className="text-xs">{pest.treatment}</p>
</div>

<div className="bg-green-50 border border-green-200 p-3 rounded">
<p className="text-xs font-bold text-green-700">Biological Control</p>
<p className="text-xs">{pest.biological}</p>
</div>

<div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
<p className="text-xs font-bold text-yellow-700">Economic Threshold Level</p>
<p className="text-xs">{pest.etl}</p>
</div>

<div className="bg-gray-50 border border-gray-200 p-3 rounded">
<p className="text-xs font-bold text-gray-700">Prevention</p>
<p className="text-xs">{pest.prevention}</p>
</div>

</div>

)}

</Card>

))}

</div>

</div>

</div>

);

};

export default PestAdvisory;