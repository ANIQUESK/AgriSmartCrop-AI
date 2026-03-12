import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Microscope, Upload, Loader2, AlertTriangle, CheckCircle, Info, X } from "lucide-react";

interface DiseaseResult {
  disease_name: string;
  confidence: number;
  severity: string;
  crop_type: string;
  treatment: string;
  prevention: string;
  symptoms: string;
}

const diseaseDatabase: DiseaseResult[] = [
  {
    disease_name: "Leaf Blight (Bacterial)",
    confidence: 92.4,
    severity: "High",
    crop_type: "Rice",
    symptoms: "Water-soaked lesions that turn yellow-brown, wilting of leaves",
    treatment: "Apply copper-based bactericides (Copper Oxychloride @ 3g/L). Remove and destroy infected plant parts. Ensure proper field drainage.",
    prevention: "Use resistant varieties, maintain proper plant spacing, avoid overhead irrigation",
  },
  {
    disease_name: "Early Blight (Alternaria solani)",
    confidence: 88.7,
    severity: "Medium",
    crop_type: "Tomato",
    symptoms: "Dark brown spots with concentric rings, yellowing around lesions",
    treatment: "Apply Mancozeb (2g/L) or Chlorothalonil (2ml/L). Remove infected leaves. Improve air circulation.",
    prevention: "Crop rotation, avoid wetting foliage during irrigation, apply mulch",
  },
  {
    disease_name: "Powdery Mildew",
    confidence: 95.1,
    severity: "Medium",
    crop_type: "Wheat",
    symptoms: "White powdery coating on leaves and stems, stunted growth",
    treatment: "Apply Sulphur WDG (3g/L) or Propiconazole (0.1%). Spray in early morning or evening.",
    prevention: "Plant resistant varieties, avoid excessive nitrogen, ensure proper spacing",
  },
  {
    disease_name: "Brown Rust (Puccinia recondita)",
    confidence: 91.2,
    severity: "High",
    crop_type: "Wheat",
    symptoms: "Orange-brown pustules on leaves, eventual leaf senescence",
    treatment: "Apply Propiconazole (0.1%) or Tebuconazole (0.1%). Emergency spray within 24 hours.",
    prevention: "Use resistant varieties, monitor regularly, timely fungicide application",
  },
  {
    disease_name: "Downy Mildew",
    confidence: 84.5,
    severity: "Low",
    crop_type: "Pearl Millet",
    symptoms: "Yellowish chlorotic patches on upper leaf surface, downy growth below",
    treatment: "Seed treatment with Metalaxyl (6g/kg seed). Foliar spray of Mancozeb (2.5g/L).",
    prevention: "Use certified disease-free seed, crop rotation, avoid waterlogging",
  },
];

const DiseaseDetection = () => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image file (JPG, PNG, WebP).", variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please upload an image under 10MB.", variant: "destructive" });
      return;
    }
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2500)); // simulate CNN inference

    const randomResult = diseaseDatabase[Math.floor(Math.random() * diseaseDatabase.length)];
    setResult(randomResult);

    if (user) {
      let imageUrl = null;
      // Upload to storage
      const ext = selectedImage.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { data: uploadData } = await supabase.storage.from("disease-images").upload(path, selectedImage);
      if (uploadData) {
        const { data: urlData } = supabase.storage.from("disease-images").getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }

      await supabase.from("disease_reports").insert({
        user_id: user.id,
        image_url: imageUrl,
        disease_name: randomResult.disease_name,
        confidence: randomResult.confidence,
        treatment: randomResult.treatment,
        prevention: randomResult.prevention,
        severity: randomResult.severity,
        crop_type: randomResult.crop_type,
      });
    }
    setLoading(false);
    toast({ title: "Analysis complete!", description: `Disease detected with ${randomResult.confidence}% confidence.` });
  };

  const getSeverityColor = (severity: string) => {
    if (severity === "High") return "destructive";
    if (severity === "Medium") return "warning";
    return "secondary";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center">
          <Microscope className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">Plant Disease Detection</h2>
          <p className="text-muted-foreground text-sm">CNN image analysis · Upload leaf photo for instant diagnosis</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Panel */}
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Upload className="w-4 h-4 text-primary" />
              Upload Leaf Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => document.getElementById("fileInput")?.click()}
              className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"
              } ${imagePreview ? "h-48" : "h-40"}`}
            >
              {imagePreview ? (
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">Click to change</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedImage(null); setImagePreview(null); setResult(null); }}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
                  >
                    <X className="w-3 h-3 text-foreground" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="font-medium text-foreground text-sm">Drop image here or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP · Max 10MB</p>
                </>
              )}
            </div>
            <input id="fileInput" type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />

            <Button
              onClick={handleAnalyze}
              disabled={!selectedImage || loading}
              className="w-full gradient-green text-primary-foreground font-semibold"
            >
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Running CNN Analysis...</> : <><Microscope className="w-4 h-4 mr-2" />Analyze Disease</>}
            </Button>

            <div className="bg-muted/60 rounded-lg p-3">
              <p className="text-xs text-muted-foreground font-semibold mb-1">📸 Tips for best results:</p>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                <li>• Clear, focused image of the affected leaf</li>
                <li>• Natural daylight, avoid shadows</li>
                <li>• Single leaf fills most of the frame</li>
                <li>• Include both healthy and affected areas</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Result Panel */}
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Diagnosis Result</CardTitle>
          </CardHeader>
          <CardContent>
            {!result && !loading && (
              <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
                <Microscope className="w-12 h-12 mb-3 opacity-25" />
                <p className="font-medium">No analysis yet</p>
                <p className="text-sm mt-1">Upload a leaf image to detect diseases</p>
              </div>
            )}
            {loading && (
              <div className="h-64 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 mb-3 animate-spin text-primary" />
                <p className="font-semibold text-foreground">Scanning with CNN Model...</p>
                <p className="text-sm text-muted-foreground mt-1">Analyzing leaf morphology & symptoms</p>
                <div className="w-48 mt-4">
                  <Progress value={66} className="h-1.5" />
                </div>
              </div>
            )}
            {result && !loading && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display font-bold text-lg text-foreground">{result.disease_name}</h3>
                    <p className="text-muted-foreground text-sm">Detected in: <span className="font-medium text-foreground">{result.crop_type}</span></p>
                  </div>
                  <Badge variant={getSeverityColor(result.severity) as "destructive" | "secondary" | "outline"} className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> {result.severity} Risk
                  </Badge>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Confidence</span>
                    <span className="text-sm font-bold text-success">{result.confidence}%</span>
                  </div>
                  <Progress value={result.confidence} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3">
                    <p className="text-xs font-bold text-danger mb-1 flex items-center gap-1"><Info className="w-3 h-3" /> Symptoms</p>
                    <p className="text-xs text-foreground">{result.symptoms}</p>
                  </div>
                  <div className="bg-info/5 border border-info/20 rounded-lg p-3">
                    <p className="text-xs font-bold text-info mb-1 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Treatment</p>
                    <p className="text-xs text-foreground">{result.treatment}</p>
                  </div>
                  <div className="bg-success/5 border border-success/20 rounded-lg p-3">
                    <p className="text-xs font-bold text-success mb-1 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Prevention</p>
                    <p className="text-xs text-foreground">{result.prevention}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiseaseDetection;
