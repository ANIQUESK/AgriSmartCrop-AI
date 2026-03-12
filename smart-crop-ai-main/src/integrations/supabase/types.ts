export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      crop_recommendations: {
        Row: {
          created_at: string
          id: string
          location: string | null
          nitrogen: number
          phosphorus: number
          potassium: number
          rainfall: number
          results: Json | null
          soil_ph: number
          temperature: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          location?: string | null
          nitrogen: number
          phosphorus: number
          potassium: number
          rainfall: number
          results?: Json | null
          soil_ph: number
          temperature: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string | null
          nitrogen?: number
          phosphorus?: number
          potassium?: number
          rainfall?: number
          results?: Json | null
          soil_ph?: number
          temperature?: number
          user_id?: string
        }
        Relationships: []
      }
      disease_reports: {
        Row: {
          confidence: number | null
          created_at: string
          crop_type: string | null
          disease_name: string | null
          id: string
          image_url: string | null
          prevention: string | null
          severity: string | null
          treatment: string | null
          user_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          crop_type?: string | null
          disease_name?: string | null
          id?: string
          image_url?: string | null
          prevention?: string | null
          severity?: string | null
          treatment?: string | null
          user_id: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          crop_type?: string | null
          disease_name?: string | null
          id?: string
          image_url?: string | null
          prevention?: string | null
          severity?: string | null
          treatment?: string | null
          user_id?: string
        }
        Relationships: []
      }
      market_prices: {
        Row: {
          created_at: string
          crop_type: string
          forecast_data: Json | null
          id: string
          market_location: string | null
          optimal_sell_date: string | null
          price_per_kg: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          crop_type: string
          forecast_data?: Json | null
          id?: string
          market_location?: string | null
          optimal_sell_date?: string | null
          price_per_kg: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          crop_type?: string
          forecast_data?: Json | null
          id?: string
          market_location?: string | null
          optimal_sell_date?: string | null
          price_per_kg?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          farm_name: string | null
          full_name: string | null
          id: string
          location: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          farm_name?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          farm_name?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      weather_records: {
        Row: {
          alerts: Json | null
          condition: string | null
          forecast_data: Json | null
          humidity: number | null
          id: string
          location: string
          rainfall_probability: number | null
          recorded_at: string
          temperature: number | null
          user_id: string
          wind_speed: number | null
        }
        Insert: {
          alerts?: Json | null
          condition?: string | null
          forecast_data?: Json | null
          humidity?: number | null
          id?: string
          location: string
          rainfall_probability?: number | null
          recorded_at?: string
          temperature?: number | null
          user_id: string
          wind_speed?: number | null
        }
        Update: {
          alerts?: Json | null
          condition?: string | null
          forecast_data?: Json | null
          humidity?: number | null
          id?: string
          location?: string
          rainfall_probability?: number | null
          recorded_at?: string
          temperature?: number | null
          user_id?: string
          wind_speed?: number | null
        }
        Relationships: []
      }
      yield_predictions: {
        Row: {
          created_at: string
          crop_type: string
          fertilizer_usage: number | null
          id: string
          nitrogen: number | null
          phosphorus: number | null
          potassium: number | null
          predicted_yield: number | null
          rainfall: number | null
          temperature: number | null
          unit: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          crop_type: string
          fertilizer_usage?: number | null
          id?: string
          nitrogen?: number | null
          phosphorus?: number | null
          potassium?: number | null
          predicted_yield?: number | null
          rainfall?: number | null
          temperature?: number | null
          unit?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          crop_type?: string
          fertilizer_usage?: number | null
          id?: string
          nitrogen?: number | null
          phosphorus?: number | null
          potassium?: number | null
          predicted_yield?: number | null
          rainfall?: number | null
          temperature?: number | null
          unit?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
