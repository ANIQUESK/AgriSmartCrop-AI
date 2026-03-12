
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT,
  farm_name TEXT,
  location TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by owner" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Create crop_recommendations table
CREATE TABLE public.crop_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nitrogen NUMERIC NOT NULL,
  phosphorus NUMERIC NOT NULL,
  potassium NUMERIC NOT NULL,
  soil_ph NUMERIC NOT NULL,
  rainfall NUMERIC NOT NULL,
  temperature NUMERIC NOT NULL,
  location TEXT,
  results JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.crop_recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own crop recommendations" ON public.crop_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own crop recommendations" ON public.crop_recommendations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create disease_reports table
CREATE TABLE public.disease_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  image_url TEXT,
  disease_name TEXT,
  confidence NUMERIC,
  treatment TEXT,
  prevention TEXT,
  severity TEXT,
  crop_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.disease_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own disease reports" ON public.disease_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own disease reports" ON public.disease_reports FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create yield_predictions table
CREATE TABLE public.yield_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  crop_type TEXT NOT NULL,
  nitrogen NUMERIC,
  phosphorus NUMERIC,
  potassium NUMERIC,
  rainfall NUMERIC,
  temperature NUMERIC,
  fertilizer_usage NUMERIC,
  predicted_yield NUMERIC,
  unit TEXT DEFAULT 'kg/hectare',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.yield_predictions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own yield predictions" ON public.yield_predictions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own yield predictions" ON public.yield_predictions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create market_prices table
CREATE TABLE public.market_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crop_type TEXT NOT NULL,
  price_per_kg NUMERIC NOT NULL,
  market_location TEXT,
  forecast_data JSONB,
  optimal_sell_date TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Market prices are publicly readable" ON public.market_prices FOR SELECT USING (true);

-- Create weather_records table
CREATE TABLE public.weather_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  location TEXT NOT NULL,
  temperature NUMERIC,
  rainfall_probability NUMERIC,
  humidity NUMERIC,
  wind_speed NUMERIC,
  condition TEXT,
  alerts JSONB,
  forecast_data JSONB,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.weather_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own weather records" ON public.weather_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own weather records" ON public.weather_records FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for disease images
INSERT INTO storage.buckets (id, name, public) VALUES ('disease-images', 'disease-images', true);
CREATE POLICY "Disease images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'disease-images');
CREATE POLICY "Authenticated users can upload disease images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'disease-images' AND auth.uid() IS NOT NULL);

-- Timestamps trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_market_prices_updated_at BEFORE UPDATE ON public.market_prices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
