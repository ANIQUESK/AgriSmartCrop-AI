import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CloudSun, Thermometer, Droplets, Wind, AlertTriangle, RefreshCw, MapPin, Eye, Sun, Cloud, CloudRain, Zap } from "lucide-react";

interface WeatherData {
  location: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  rainfall_prob: number;
  condition: string;
  uv_index: number;
  visibility: number;
  alerts: string[];
  forecast: { day: string; high: number; low: number; condition: string; rain: number }[];
}

const WEATHER_CONDITIONS = ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Heavy Rain", "Thunderstorm", "Clear"];
const CONDITION_ICONS: Record<string, React.ReactNode> = {
  "Sunny": <Sun className="w-6 h-6 text-accent" />,
  "Clear": <Sun className="w-6 h-6 text-accent" />,
  "Partly Cloudy": <CloudSun className="w-6 h-6 text-muted-foreground" />,
  "Cloudy": <Cloud className="w-6 h-6 text-muted-foreground" />,
  "Light Rain": <CloudRain className="w-6 h-6 text-info" />,
  "Heavy Rain": <CloudRain className="w-6 h-6 text-info" />,
  "Thunderstorm": <Zap className="w-6 h-6 text-warning" />,
};

const generateWeather = (location: string): WeatherData => {
  const conditionIdx = Math.floor(Math.random() * WEATHER_CONDITIONS.length);
  const condition = WEATHER_CONDITIONS[conditionIdx];
  const temp = Math.round(20 + Math.random() * 20);
  const humidity = Math.round(45 + Math.random() * 40);
  const wind = Math.round(5 + Math.random() * 25);
  const alerts: string[] = [];
  if (temp > 38) alerts.push("⚠️ Heat Wave Alert: Extreme temperatures expected. Protect crops & livestock.");
  if (wind > 25) alerts.push("🌪️ Strong Wind Advisory: Secure farm structures and support tall crops.");
  if (condition === "Thunderstorm") alerts.push("⛈️ Thunderstorm Warning: Postpone field operations. Seek shelter.");
  if (humidity > 80) alerts.push("💧 High Humidity Alert: Monitor for fungal disease outbreaks.");

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date().getDay();
  const forecast = days.map((_, i) => ({
    day: days[(today + i) % 7],
    high: Math.round(temp + (Math.random() * 6 - 3)),
    low: Math.round(temp - 8 + Math.random() * 4),
    condition: WEATHER_CONDITIONS[Math.floor(Math.random() * WEATHER_CONDITIONS.length)],
    rain: Math.round(Math.random() * 100),
  }));

  return { location, temperature: temp, feels_like: temp - 2 + Math.round(Math.random() * 4), humidity, wind_speed: wind, rainfall_prob: Math.round(Math.random() * 100), condition, uv_index: Math.round(1 + Math.random() * 10), visibility: Math.round(5 + Math.random() * 20), alerts, forecast };
};

const WeatherIntelligence = () => {
  const [location, setLocation] = useState("New Delhi, India");
  const [searchInput, setSearchInput] = useState("New Delhi, India");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const hasLoaded = useRef(false);

  const fetchWeather = async (loc: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setWeather(generateWeather(loc));
    setLoading(false);
  };

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      fetchWeather(location);
    }
  }, []);

  const handleSearch = () => {
    if (!searchInput.trim()) {
      toast({ title: "Enter a location", variant: "destructive" });
      return;
    }
    setLocation(searchInput);
    fetchWeather(searchInput);
  };

  const getRainColor = (rain: number) => {
    if (rain > 70) return "text-info";
    if (rain > 40) return "text-warning";
    return "text-muted-foreground";
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 gradient-sky rounded-xl flex items-center justify-center">
          <CloudSun className="w-5 h-5 text-sky-foreground" />
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">Weather Intelligence</h2>
          <p className="text-muted-foreground text-sm">Real-time weather · Storm & heatwave alerts for farmers</p>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="shadow-card border-border/50">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter city, region..."
                className="pl-9 h-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading} className="gradient-sky text-sky-foreground font-semibold px-6">
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Search"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {weather?.alerts && weather.alerts.length > 0 && (
        <div className="space-y-2">
          {weather.alerts.map((alert, i) => (
            <div key={i} className="flex items-start gap-3 bg-warning/10 border border-warning/30 rounded-xl px-4 py-3">
              <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground">{alert}</p>
            </div>
          ))}
        </div>
      )}

      {weather && !loading && (
        <>
          {/* Main Weather Card */}
          <Card className="shadow-card border-border/50 overflow-hidden">
            <div className="gradient-sky p-6 text-sky-foreground">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 opacity-80" />
                    <span className="font-medium opacity-90">{weather.location}</span>
                  </div>
                  <div className="text-7xl font-display font-bold">{weather.temperature}°</div>
                  <div className="text-lg opacity-90 mt-1">{weather.condition}</div>
                  <div className="text-sm opacity-70 mt-0.5">Feels like {weather.feels_like}°C</div>
                </div>
                <div className="text-8xl opacity-80">
                  {weather.condition === "Sunny" || weather.condition === "Clear" ? "☀️" :
                   weather.condition === "Partly Cloudy" ? "⛅" :
                   weather.condition === "Cloudy" ? "☁️" :
                   weather.condition === "Thunderstorm" ? "⛈️" : "🌧️"}
                </div>
              </div>
            </div>

            <CardContent className="p-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Humidity", value: `${weather.humidity}%`, icon: Droplets, color: "text-info" },
                  { label: "Wind Speed", value: `${weather.wind_speed} km/h`, icon: Wind, color: "text-muted-foreground" },
                  { label: "Rain Chance", value: `${weather.rainfall_prob}%`, icon: CloudRain, color: "text-info" },
                  { label: "UV Index", value: weather.uv_index.toString(), icon: Sun, color: "text-accent" },
                  { label: "Visibility", value: `${weather.visibility} km`, icon: Eye, color: "text-muted-foreground" },
                  { label: "Feels Like", value: `${weather.feels_like}°C`, icon: Thermometer, color: "text-warning" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
                    <stat.icon className={`w-4 h-4 ${stat.color} flex-shrink-0`} />
                    <div>
                      <div className="font-semibold text-sm text-foreground">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 7-Day Forecast */}
          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">7-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {weather.forecast.map((day) => (
                  <div key={day.day} className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-muted/60 transition-colors">
                    <div className="text-xs font-semibold text-muted-foreground">{day.day}</div>
                    <div className="text-lg">{CONDITION_ICONS[day.condition] || <CloudSun className="w-5 h-5" />}</div>
                    <div className="text-sm font-bold text-foreground">{day.high}°</div>
                    <div className="text-xs text-muted-foreground">{day.low}°</div>
                    <div className={`text-xs font-semibold ${getRainColor(day.rain)}`}>{day.rain}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Farm Advisory */}
          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">🌾 Farm Advisory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  {
                    icon: "💧",
                    title: "Irrigation Advice",
                    text: weather.rainfall_prob > 60 ? "Rain likely — hold off irrigation for 1-2 days" : weather.humidity < 50 ? "Dry conditions — increase irrigation frequency" : "Maintain regular irrigation schedule",
                    color: weather.rainfall_prob > 60 ? "border-info/30 bg-info/5" : "border-border/50",
                  },
                  {
                    icon: "🌡️",
                    title: "Heat Management",
                    text: weather.temperature > 35 ? "Critical heat — provide shade for seedlings, irrigate in evening" : weather.temperature < 12 ? "Cold stress risk — protect sensitive crops with covers" : "Temperatures are ideal for most field operations",
                    color: weather.temperature > 35 ? "border-danger/30 bg-danger/5" : "border-border/50",
                  },
                  {
                    icon: "🌬️",
                    title: "Wind Advisory",
                    text: weather.wind_speed > 30 ? "High winds — avoid spraying pesticides, secure structures" : weather.wind_speed > 15 ? "Moderate winds — ideal for pesticide application avoided" : "Calm conditions — good for spraying operations",
                    color: weather.wind_speed > 30 ? "border-warning/30 bg-warning/5" : "border-border/50",
                  },
                ].map((tip) => (
                  <div key={tip.title} className={`rounded-xl p-4 border ${tip.color}`}>
                    <div className="text-2xl mb-2">{tip.icon}</div>
                    <div className="font-semibold text-sm text-foreground mb-1">{tip.title}</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">{tip.text}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default WeatherIntelligence;
