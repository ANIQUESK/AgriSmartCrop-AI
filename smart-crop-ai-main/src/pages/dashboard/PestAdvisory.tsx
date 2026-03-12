import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Bug, Search, ChevronDown, ChevronUp } from "lucide-react";

const PESTS = [
  { name: "Aphids", crops: ["Wheat", "Mustard", "Vegetables"], severity: "Medium", emoji: "🐛",
    symptoms: "Yellowing leaves, sticky residue, curled foliage, reduced plant vigour",
    treatment: "Spray Imidacloprid (0.3 ml/L) or Thiamethoxam (0.2 g/L). Use neem oil (5 ml/L) as organic alternative.",
    prevention: "Introduce ladybirds, plant marigold borders, avoid excessive nitrogen fertilization",
    season: "Year-round (peak: spring)",
  },
  { name: "Brown Planthopper", crops: ["Rice"], severity: "High", emoji: "🦗",
    symptoms: "Circular patches of dead plants (hopper burn), brown withered stems at base",
    treatment: "Drain water for 3-4 days. Apply Buprofezin (0.75 ml/L) or Chlorpyrifos (2 ml/L).",
    prevention: "Avoid dense planting, use resistant varieties, balanced fertilization",
    season: "Kharif (Jul–Oct)",
  },
  { name: "Fall Armyworm", crops: ["Maize", "Sorghum"], severity: "High", emoji: "🐌",
    symptoms: "Ragged holes in leaves, sawdust-like frass in whorl, skeletonized leaves",
    treatment: "Apply Emamectin Benzoate (0.4 g/L) at early infestation. For severe attack use Spinetoram.",
    prevention: "Early sowing, pheromone traps (1/acre), intercropping with legumes",
    season: "Kharif (Jun–Sep)",
  },
  { name: "Whitefly", crops: ["Cotton", "Tomato", "Chilli"], severity: "High", emoji: "🦋",
    symptoms: "Yellowing & silvering of leaves, sooty mold, virus transmission (CLCuV in cotton)",
    treatment: "Spray Pyriproxyfen (1 ml/L) or Spiromesifen (1 ml/L). Rotate insecticides to prevent resistance.",
    prevention: "Yellow sticky traps, reflective mulch, avoid late sowing, destroy volunteer plants",
    season: "Kharif (Jul–Oct)",
  },
  { name: "Stem Borer", crops: ["Rice", "Maize", "Sugarcane"], severity: "High", emoji: "🐛",
    symptoms: "Dead hearts in vegetative stage, white ears/empty panicles at flowering",
    treatment: "Apply Carbofuran granules (33 kg/ha) in standing water or Fipronil (1.5 ml/L).",
    prevention: "Remove and destroy stubble after harvest, use pheromone traps, timely transplanting",
    season: "Kharif (Jun–Sep)",
  },
  { name: "Thrips", crops: ["Cotton", "Onion", "Chilli"], severity: "Medium", emoji: "🦟",
    symptoms: "Silver/bronze streaks on leaves, curled leaf margins, distorted growth",
    treatment: "Spray Fipronil (1.5 ml/L) or Spinosad (0.4 ml/L). Two sprays at 10-day intervals.",
    prevention: "Reflective mulches, sticky traps, intercropping with coriander, avoid water stress",
    season: "Year-round (peak: dry season)",
  },
  { name: "Locusts", crops: ["All Field Crops"], severity: "Critical", emoji: "🦗",
    symptoms: "Complete defoliation, loss of entire crop in hours, crop stands completely bare",
    treatment: "Immediate aerial or ground spraying with Malathion (96% ULV). Alert agricultural authorities.",
    prevention: "Monitor weather forecasts, early warning systems, community coordination",
    season: "Sporadic (post-monsoon)",
  },
  { name: "Mealybugs", crops: ["Cotton", "Grapes", "Papaya"], severity: "Medium", emoji: "🐝",
    symptoms: "White cottony masses on stems, yellowing, wilting, honeydew secretion",
    treatment: "Apply Profenofos (2 ml/L) or release Cryptolaemus montrouzieri (biological control).",
    prevention: "Remove weeds, avoid ant movement using sticky bands, quarantine new plant material",
    season: "Mar–Jun (dry months)",
  },
];

const SEVERITY_COLORS: Record<string, string> = {
  Critical: "bg-destructive/10 text-danger border-destructive/30",
  High: "bg-warning/10 text-warning border-warning/30",
  Medium: "bg-accent/10 text-accent border-accent/30",
  Low: "bg-success/10 text-success border-success/20",
};

const PestAdvisory = () => {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = PESTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.crops.some(c => c.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-destructive/80 rounded-xl flex items-center justify-center">
          <Bug className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">Pest Advisory</h2>
          <p className="text-muted-foreground text-sm">Expert knowledge base · Identification, treatment & prevention</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search pests or crops (e.g. Rice, Aphids...)"
          className="pl-10 h-11"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((pest) => (
          <Card key={pest.name} className="shadow-card border-border/50 overflow-hidden">
            <button
              className="w-full text-left"
              onClick={() => setExpanded(expanded === pest.name ? null : pest.name)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{pest.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display font-bold text-foreground">{pest.name}</h3>
                        <Badge className={`text-[10px] px-2 py-0.5 border ${SEVERITY_COLORS[pest.severity]}`}>
                          {pest.severity} Risk
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">{pest.season}</Badge>
                      </div>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {pest.crops.map(c => (
                          <span key={c} className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{c}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {expanded === pest.name ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </CardContent>
            </button>

            {expanded === pest.name && (
              <div className="px-4 pb-4 border-t border-border/50 pt-3 space-y-3 animate-fade-in">
                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3">
                  <p className="text-xs font-bold text-danger mb-1">⚠️ Symptoms</p>
                  <p className="text-xs text-foreground">{pest.symptoms}</p>
                </div>
                <div className="bg-info/5 border border-info/20 rounded-lg p-3">
                  <p className="text-xs font-bold text-info mb-1">💊 Treatment</p>
                  <p className="text-xs text-foreground">{pest.treatment}</p>
                </div>
                <div className="bg-success/5 border border-success/20 rounded-lg p-3">
                  <p className="text-xs font-bold text-success mb-1">🛡️ Prevention</p>
                  <p className="text-xs text-foreground">{pest.prevention}</p>
                </div>
              </div>
            )}
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Bug className="w-12 h-12 mx-auto mb-3 opacity-25" />
            <p className="font-medium">No pests found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PestAdvisory;
