export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      company_details: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          id: string
          industry: string
          name: string
          onboarded: boolean
          onboarding_persona_prompt: string | null
          phone_number: string | null
          state: string | null
          street_address1: string | null
          street_address2: string | null
          updated_at: string
          user_id: string
          zip: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          industry: string
          name: string
          onboarded?: boolean
          onboarding_persona_prompt?: string | null
          phone_number?: string | null
          state?: string | null
          street_address1?: string | null
          street_address2?: string | null
          updated_at?: string
          user_id: string
          zip?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          industry?: string
          name?: string
          onboarded?: boolean
          onboarding_persona_prompt?: string | null
          phone_number?: string | null
          state?: string | null
          street_address1?: string | null
          street_address2?: string | null
          updated_at?: string
          user_id?: string
          zip?: string | null
        }
        Relationships: []
      }
      marketing_onboarding: {
        Row: {
          created_at: string
          customer_age_ranges: string[]
          customer_gender: string[]
          customer_income_ranges: string[]
          goals: string[]
          id: string
          industry: string
          name: string
          product_types: string[]
          store_type: string[]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_age_ranges?: string[]
          customer_gender?: string[]
          customer_income_ranges?: string[]
          goals?: string[]
          id?: string
          industry: string
          name: string
          product_types?: string[]
          store_type: string[]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          customer_age_ranges?: string[]
          customer_gender?: string[]
          customer_income_ranges?: string[]
          goals?: string[]
          id?: string
          industry?: string
          name?: string
          product_types?: string[]
          store_type?: string[]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      prompt_template_type: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      saved_personas: {
        Row: {
          age_ranges: string
          appeal_how_to: string
          cac_estimate: string | null
          created_at: string
          description: string
          genders: string
          id: string
          location: string
          ltv_estimate: string | null
          name: string
          psychographics: string
          social_media_top_1: string
          social_media_top_2: string | null
          social_media_top_3: string | null
          top_competitors: string
          updated_at: string
          user_id: string
        }
        Insert: {
          age_ranges?: string
          appeal_how_to?: string
          cac_estimate?: string | null
          created_at?: string
          description: string
          genders?: string
          id?: string
          location?: string
          ltv_estimate?: string | null
          name: string
          psychographics?: string
          social_media_top_1?: string
          social_media_top_2?: string | null
          social_media_top_3?: string | null
          top_competitors?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          age_ranges?: string
          appeal_how_to?: string
          cac_estimate?: string | null
          created_at?: string
          description?: string
          genders?: string
          id?: string
          location?: string
          ltv_estimate?: string | null
          name?: string
          psychographics?: string
          social_media_top_1?: string
          social_media_top_2?: string | null
          social_media_top_3?: string | null
          top_competitors?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scheduled_content: {
        Row: {
          content: string | null
          created_at: string
          engagement_data: Json | null
          goal: string | null
          id: string
          media_url: string | null
          persona_name: string | null
          platform: string
          published_at: string | null
          scheduled_at: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          engagement_data?: Json | null
          goal?: string | null
          id?: string
          media_url?: string | null
          persona_name?: string | null
          platform: string
          published_at?: string | null
          scheduled_at?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          engagement_data?: Json | null
          goal?: string | null
          id?: string
          media_url?: string | null
          persona_name?: string | null
          platform?: string
          published_at?: string | null
          scheduled_at?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      social_connections: {
        Row: {
          access_token: string
          account_name: string
          connected_at: string
          created_at: string
          followers_count: number | null
          id: string
          is_active: boolean
          last_sync_at: string | null
          platform: string
          platform_user_id: string
          refresh_token: string | null
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          account_name: string
          connected_at?: string
          created_at?: string
          followers_count?: number | null
          id?: string
          is_active?: boolean
          last_sync_at?: string | null
          platform: string
          platform_user_id: string
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          account_name?: string
          connected_at?: string
          created_at?: string
          followers_count?: number | null
          id?: string
          is_active?: boolean
          last_sync_at?: string | null
          platform?: string
          platform_user_id?: string
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      system_prompt_template: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          prompt_template_type_id: string | null
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          prompt_template_type_id?: string | null
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          prompt_template_type_id?: string | null
          updated_at?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_system_prompt_template_type"
            columns: ["prompt_template_type_id"]
            isOneToOne: false
            referencedRelation: "prompt_template_type"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "admin" | "super_admin"
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
    Enums: {
      app_role: ["user", "admin", "super_admin"],
    },
  },
} as const
