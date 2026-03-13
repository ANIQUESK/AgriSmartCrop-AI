import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  CloudSun,
  AlertTriangle,
  RefreshCw,
  MapPin
} from "lucide-react";

/* ================= TYPES ================= */

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
}

/* ================= API KEY ================= */

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
console.log(import.meta.env.VITE_OPENWEATHER_API_KEY);

/* ================= WEATHER FETCH ================= */

const fetchWeatherData = async (city: string): Promise<WeatherData | null> => {

  try {

    const API_KEY = import.meta.env.VITE_TOMORROW_API_KEY;

    const res = await fetch(
      `https://api.tomorrow.io/v4/weather/realtime?location=${encodeURIComponent(city)}&apikey=${API_KEY}`
    );

    if (!res.ok) return null;

    const data = await res.json();

    const values = data.data.values;

    const temp = values.temperature;
    const humidity = values.humidity;
    const wind = values.windSpeed;
    const visibility = values.visibility;
    const rainProb = values.precipitationProbability;
    const uv = values.uvIndex;

    const alerts: string[] = [];

    if (temp > 38)
      alerts.push("⚠️ Heat Wave Alert: Extreme temperatures may stress crops.");

    if (wind > 25)
      alerts.push("🌪️ Strong Wind Advisory: Protect farm structures.");

    if (humidity > 85)
      alerts.push("🌧️ High Humidity: Risk of fungal crop diseases.");

    if (rainProb > 70)
      alerts.push("🌧️ Heavy rain likely: Delay pesticide spraying.");

    return {

      location: city,

      temperature: Math.round(temp),

      feels_like: Math.round(temp),

      humidity: Math.round(humidity),

      wind_speed: Math.round(wind),

      rainfall_prob: Math.round(rainProb),

      condition: "Realtime Weather",

      uv_index: Math.round(uv),

      visibility: Math.round(visibility),

      alerts

    };

  } catch (error) {

    console.error("Weather API error:", error);

    return null;

  }

};

/* ================= COLOR GRADIENT ================= */

const getTemperatureGradient = (temp: number) => {

  if (temp < 15) return "from-blue-500 to-blue-700";

  if (temp < 25) return "from-[#6B8E23] to-[#556B2F]";

  if (temp < 35) return "from-[#B7410E] to-[#5C3A21]";

  return "from-[#FF8C00] to-[#FF5E00]";

};

/* ================= COMPONENT ================= */

const WeatherIntelligence = () => {

  const [location, setLocation] = useState("Delhi");
  const [searchInput, setSearchInput] = useState("Delhi");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const hasLoaded = useRef(false);

  const { toast } = useToast();

  const fetchWeather = async (loc: string) => {

    try {

      setLoading(true);

      const data = await fetchWeatherData(loc);

      if (!data) {

        toast({
          title: "Location not found",
          description: "Please check spelling",
          variant: "destructive"
        });

        return;

      }

      setWeather(data);

    } catch {

      toast({
        title: "Weather service error",
        description: "Unable to fetch weather data",
        variant: "destructive"
      });

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    if (!hasLoaded.current) {

      hasLoaded.current = true;

      fetchWeather(location);

    }

  }, []);

  const handleSearch = () => {

    if (!searchInput.trim()) {

      toast({
        title: "Enter a location",
        variant: "destructive"
      });

      return;

    }

    setLocation(searchInput);

    fetchWeather(searchInput);

  };

  const getWeatherIcon = () => {

    if (!weather) return "☀️";

    switch (weather.condition) {

      case "Clear":
        return "☀️";

      case "Clouds":
        return "☁️";

      case "Rain":
        return "🌧️";

      case "Drizzle":
        return "🌦️";

      case "Thunderstorm":
        return "⛈️";

      case "Snow":
        return "❄️";

      default:
        return "🌤️";

    }

  };

  return (

    <div className="min-h-screen bg-[#DBCEA5] p-8">

      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 bg-[#B7410E] rounded-xl flex items-center justify-center shadow-lg">

            <CloudSun className="text-white w-5 h-5" />

          </div>

          <div>

            <h2 className="text-xl font-bold text-[#2E2E2E]">
              Weather Intelligence
            </h2>

            <p className="text-sm text-[#5C3A21]">
              Real-time weather alerts for farmers
            </p>

          </div>

        </div>

        {/* SEARCH */}

        <Card className="bg-white/60 backdrop-blur-xl border border-white/30 shadow-xl">

          <CardContent className="p-4">

            <div className="flex gap-3">

              <div className="flex-1 relative">

                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C3A21]" />

                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Enter city or region"
                  className="pl-9"
                />

              </div>

              <Button
                onClick={handleSearch}
                disabled={loading}
                className="bg-[#B7410E] hover:bg-[#8B2F0B] text-white"
              >

                {loading
                  ? <RefreshCw className="animate-spin w-4 h-4" />
                  : "Search"}

              </Button>

            </div>

          </CardContent>

        </Card>

        {/* ALERTS */}

        {weather?.alerts.map((alert, i) => (

          <div
            key={i}
            className="flex items-start gap-3 bg-[#B7410E]/10 border border-[#B7410E]/30 rounded-xl px-4 py-3"
          >

            <AlertTriangle className="text-[#B7410E] w-4 h-4 mt-0.5" />

            <p className="text-sm text-[#2E2E2E]">{alert}</p>

          </div>

        ))}

        {/* WEATHER CARD */}

        {weather && !loading && (

          <Card className="bg-white/60 backdrop-blur-xl border border-white/30 shadow-xl overflow-hidden">

            <div
              className={`bg-gradient-to-r ${getTemperatureGradient(weather.temperature)} text-white p-6`}
            >

              <div className="flex justify-between">

                <div>

                  <div className="flex items-center gap-2 mb-1">

                    <MapPin className="w-4 h-4" />

                    {weather.location}

                  </div>

                  <div className="text-6xl font-bold">

                    {weather.temperature}°

                  </div>

                  <div className="text-sm opacity-80">

                    Feels like {weather.feels_like}°C

                  </div>

                </div>

                <div className="text-6xl">

                  {getWeatherIcon()}

                </div>

              </div>

            </div>

            <CardContent className="p-5">

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

                <div className="bg-[#DBCEA5]/60 p-3 rounded-lg">

                  <div className="text-sm font-semibold">

                    {weather.humidity}%

                  </div>

                  <div className="text-xs text-[#5C3A21]">

                    Humidity

                  </div>

                </div>

                <div className="bg-[#DBCEA5]/60 p-3 rounded-lg">

                  <div className="text-sm font-semibold">

                    {weather.wind_speed} km/h

                  </div>

                  <div className="text-xs text-[#5C3A21]">

                    Wind

                  </div>

                </div>

                <div className="bg-[#DBCEA5]/60 p-3 rounded-lg">

                  <div className="text-sm font-semibold">

                    {weather.rainfall_prob}%

                  </div>

                  <div className="text-xs text-[#5C3A21]">

                    Rain Chance

                  </div>

                </div>

                <div className="bg-[#DBCEA5]/60 p-3 rounded-lg">

                  <div className="text-sm font-semibold">

                    {weather.visibility} km

                  </div>

                  <div className="text-xs text-[#5C3A21]">

                    Visibility

                  </div>

                </div>

              </div>

            </CardContent>

          </Card>

        )}

      </div>

    </div>

  );

};

export default WeatherIntelligence;