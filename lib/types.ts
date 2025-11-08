export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
        };
        Insert: {
          id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      food_items: {
        Row: {
          id: number;
          source: string;
          name: string;
          brand: string | null;
          barcode: string | null;
          nutrients_per_100g: Json;
          default_serving_g: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          source: string;
          name: string;
          brand?: string | null;
          barcode?: string | null;
          nutrients_per_100g: Json;
          default_serving_g?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          source?: string;
          name?: string;
          brand?: string | null;
          barcode?: string | null;
          nutrients_per_100g?: Json;
          default_serving_g?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      recipes: {
        Row: {
          id: number;
          user_id: string;
          name: string;
          method_md: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          name: string;
          method_md?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          name?: string;
          method_md?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      recipe_items: {
        Row: {
          id: number;
          recipe_id: number;
          food_item_id: number;
          grams: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          recipe_id: number;
          food_item_id: number;
          grams: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          recipe_id?: number;
          food_item_id?: number;
          grams?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      diary_entries: {
        Row: {
          id: number;
          user_id: string;
          occurred_at: string;
          food_item_id: number | null;
          recipe_id: number | null;
          grams: number;
          nutrients_cache: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          occurred_at: string;
          food_item_id?: number | null;
          recipe_id?: number | null;
          grams: number;
          nutrients_cache?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          occurred_at?: string;
          food_item_id?: number | null;
          recipe_id?: number | null;
          grams?: number;
          nutrients_cache?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      targets: {
        Row: {
          user_id: string;
          kcal: number | null;
          protein_g: number | null;
          carbs_g: number | null;
          fat_g: number | null;
          fibre_g: number | null;
          sodium_mg: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          kcal?: number | null;
          protein_g?: number | null;
          carbs_g?: number | null;
          fat_g?: number | null;
          fibre_g?: number | null;
          sodium_mg?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          kcal?: number | null;
          protein_g?: number | null;
          carbs_g?: number | null;
          fat_g?: number | null;
          fibre_g?: number | null;
          sodium_mg?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      weekly_settings: {
        Row: {
          user_id: string;
          weekly_kcal: number;
          start_of_week: string;
          carryover_enabled: boolean;
          carryover_cap_kcal: number;
          protein_floor_g: number;
          fibre_floor_g: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          weekly_kcal?: number;
          start_of_week?: string;
          carryover_enabled?: boolean;
          carryover_cap_kcal?: number;
          protein_floor_g?: number;
          fibre_floor_g?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          weekly_kcal?: number;
          start_of_week?: string;
          carryover_enabled?: boolean;
          carryover_cap_kcal?: number;
          protein_floor_g?: number;
          fibre_floor_g?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      weight_logs: {
        Row: {
          id: number;
          user_id: string;
          measured_on: string;
          weight_kg: number;
          note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          measured_on: string;
          weight_kg: number;
          note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          measured_on?: string;
          weight_kg?: number;
          note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      v_weekly_intake: {
        Row: {
          user_id: string;
          week_start: string;
          kcal_total: number;
          protein_g_total: number;
          fibre_g_total: number;
        };
      };
      v_daily_floors: {
        Row: {
          user_id: string;
          day: string;
          protein_g: number;
          fibre_g: number;
        };
      };
      v_rolling7_intake: {
        Row: {
          user_id: string;
          anchor_day: string;
          kcal_rolling7: number;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}
