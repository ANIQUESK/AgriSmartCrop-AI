import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Leaf, Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Tilt from "react-parallax-tilt";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [farmName, setFarmName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Email and password are required.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "Successfully signed in.",
        });

        navigate("/dashboard");
      } else {
        if (!fullName) {
          toast({
            title: "Validation Error",
            description: "Full name is required.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              farm_name: farmName,
            },
          },
        });

        if (error) throw error;

        toast({
          title: "Account created!",
          description: "Check your email for verification.",
        });

        setIsLogin(true);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An error occurred";

      toast({
        title: "Authentication Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative bg-[#DBCEA5] overflow-hidden">

      {/* Animated Background */}

      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute w-96 h-96 bg-[#B7410E] rounded-full blur-3xl opacity-30 animate-pulse top-20 left-10"></div>

        <div className="absolute w-96 h-96 bg-[#5C3A21] rounded-full blur-3xl opacity-30 animate-pulse bottom-20 right-10"></div>

        <div className="absolute w-72 h-72 bg-[#DBCEA5] rounded-full blur-3xl opacity-20 animate-pulse top-1/2 left-1/3"></div>

      </div>

      {/* Left Panel */}

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2E2E2E] via-[#5C3A21] to-[#B7410E] flex-col justify-between p-12 text-white relative z-10">

        <div>

          <div className="flex items-center gap-4 mb-12 group">

          {/* Logo Container */}

            <div className="relative flex items-center justify-center">

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-[#B7410E] blur-xl opacity-40 rounded-2xl group-hover:opacity-60 transition"></div>

              {/* Logo Box */}
              <div className="relative w-20 h-20 rounded-2xl bg-white/10 border border-white/20 shadow-xl flex items-center justify-center overflow-hidden">

                <img
                  src="/a.png"
                  alt="SmartCrop AI Logo"
                  className="w-15 h-15 object-contain"
                  draggable={false}
                />

              </div>

            </div>

          {/* Title */}

          <div>

            <h1 className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-white to-[#DBCEA5] bg-clip-text text-transparent">
              Krushi Mitra
            </h1>

            <p className="text-white/70 text-sm tracking-wide">
              Agricultural Intelligence Platform
            </p>

          </div>

        </div>

          <h2 className="text-4xl font-bold leading-tight mb-6">
            Farm Smarter.<br />
            Grow Better.<br />
            <span className="text-[#DBCEA5]">Profit More.</span>
          </h2>

          <p className="text-white/80 text-lg">
            AI-powered insights for modern farmers. Detect plant diseases,
            predict yield, track markets, and get crop recommendations.
          </p>

        </div>

        {/* Feature Cards */}

        <div className="grid grid-cols-2 gap-4">

          {[
            { icon: "🌾", label: "Crop Advisor" },
            { icon: "🔬", label: "Disease Detection" },
            { icon: "📈", label: "Yield Prediction" },
            { icon: "💹", label: "Market Forecast" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/20 transform transition-all duration-300 hover:scale-110 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="font-semibold text-sm">{item.label}</div>
            </div>
          ))}

        </div>

      </div>

      {/* Right Auth Section */}

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">

        <Tilt
          tiltMaxAngleX={10}
          tiltMaxAngleY={10}
          perspective={1200}
          glareEnable={true}
          glareMaxOpacity={0.25}
          scale={1.03}
        >

          <div className="w-full max-w-md bg-white/20 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/30">

            <div className="flex items-center gap-2 mb-6">

              <div className="w-10 h-10 bg-[#B7410E] rounded-xl flex items-center justify-center">
                <Leaf className="text-white" />
              </div>

              <span className="text-xl font-bold text-[#2E2E2E]">
                Krushi Mitra
              </span>

            </div>

            <h2 className="text-3xl font-bold text-[#2E2E2E] mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>

            <p className="text-[#5C3A21] mb-6">
              {isLogin
                ? "Sign in to your dashboard"
                : "Start your AI farming journey"}
            </p>

            <form onSubmit={handleAuth} className="space-y-4">

              {!isLogin && (
                <>
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Farm Name</Label>
                    <Input
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative">

                <Label>Password</Label>

                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="absolute right-3 top-9"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>

              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#B7410E] hover:bg-[#8B2F0B] transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-2xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />
                    {isLogin ? "Signing In..." : "Creating..."}
                  </>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>

            </form>

            <div className="mt-6 text-center">

              <span className="text-[#5C3A21]">
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
              </span>

              <button
                className="text-[#B7410E] font-semibold hover:underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>

            </div>

          </div>

        </Tilt>

      </div>

    </div>
  );
};

export default Auth;