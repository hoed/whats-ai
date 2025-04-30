export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_profiles: {
        Row: {
          ai_model: string | null
          api_key_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          prompt_system: string
          user_id: string
        }
        Insert: {
          ai_model?: string | null
          api_key_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          prompt_system: string
          user_id: string
        }
        Update: {
          ai_model?: string | null
          api_key_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          prompt_system?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_ai_profiles_api_keys"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_ai_profiles_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          created_at: string | null
          id: string
          key_name: string
          key_value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          key_name: string
          key_value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          key_name?: string
          key_value?: string
        }
        Relationships: []
      }
      chat_sessions: {
        Row: {
          assigned_to: string | null
          contact_id: string | null
          id: string
          last_activity: string | null
          status: Database["public"]["Enums"]["session_status"] | null
        }
        Insert: {
          assigned_to?: string | null
          contact_id?: string | null
          id?: string
          last_activity?: string | null
          status?: Database["public"]["Enums"]["session_status"] | null
        }
        Update: {
          assigned_to?: string | null
          contact_id?: string | null
          id?: string
          last_activity?: string | null
          status?: Database["public"]["Enums"]["session_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          created_at: string | null
          id: string
          name: string
          phone_number: string
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          phone_number: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          phone_number?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          ai_profile_id: string | null
          contact_id: string | null
          content: string
          id: string
          role: string | null
          template_id: string | null
          timestamp: string | null
          training_data_id: string | null
          user_id: string
        }
        Insert: {
          ai_profile_id?: string | null
          contact_id?: string | null
          content: string
          id?: string
          role?: string | null
          template_id?: string | null
          timestamp?: string | null
          training_data_id?: string | null
          user_id: string
        }
        Update: {
          ai_profile_id?: string | null
          contact_id?: string | null
          content?: string
          id?: string
          role?: string | null
          template_id?: string | null
          timestamp?: string | null
          training_data_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_messages_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_ai_profile_id_fkey"
            columns: ["ai_profile_id"]
            isOneToOne: false
            referencedRelation: "ai_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_training_data_id_fkey"
            columns: ["training_data_id"]
            isOneToOne: false
            referencedRelation: "training_data"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          api_key_id: string | null
          content: string
          created_at: string | null
          id: string
          tags: string[] | null
          title: string
          user_id: string | null
        }
        Insert: {
          api_key_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          tags?: string[] | null
          title: string
          user_id?: string | null
        }
        Update: {
          api_key_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          tags?: string[] | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_templates_api_keys"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_templates_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      training_data: {
        Row: {
          api_key_id: string | null
          category: string | null
          content: string
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          api_key_id?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          id?: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          api_key_id?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_training_data_api_keys"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_training_data_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          dark_mode: boolean | null
          id: string
          language: string | null
          notifications: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          dark_mode?: boolean | null
          id?: string
          language?: string | null
          notifications?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          dark_mode?: boolean | null
          id?: string
          language?: string | null
          notifications?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          contact: string | null
          created_at: string | null
          email: string
          id: string
          role: string
          stripe_customer_id: string | null
        }
        Insert: {
          contact?: string | null
          created_at?: string | null
          email: string
          id?: string
          role?: string
          stripe_customer_id?: string | null
        }
        Update: {
          contact?: string | null
          created_at?: string | null
          email?: string
          id?: string
          role?: string
          stripe_customer_id?: string | null
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
      session_status: "open" | "pending" | "closed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      session_status: ["open", "pending", "closed"],
    },
  },
} as const
