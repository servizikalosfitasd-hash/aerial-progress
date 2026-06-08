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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      custom_exercises: {
        Row: {
          category: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_global: boolean
          load_band: string | null
          load_kg: number | null
          name: string
          notes: string | null
          recovery: number | null
          reps: number | null
          seconds: number | null
          sets: number | null
          skill_id: string | null
          target_user_id: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_global?: boolean
          load_band?: string | null
          load_kg?: number | null
          name: string
          notes?: string | null
          recovery?: number | null
          reps?: number | null
          seconds?: number | null
          sets?: number | null
          skill_id?: string | null
          target_user_id?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_global?: boolean
          load_band?: string | null
          load_kg?: number | null
          name?: string
          notes?: string | null
          recovery?: number | null
          reps?: number | null
          seconds?: number | null
          sets?: number | null
          skill_id?: string | null
          target_user_id?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          body: string
          created_at: string
          id: string
          read_at: string | null
          sender_id: string
          sender_is_admin: boolean
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id: string
          sender_is_admin?: boolean
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id?: string
          sender_is_admin?: boolean
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          nickname: string | null
          preferences: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          nickname?: string | null
          preferences?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          nickname?: string | null
          preferences?: Json
          updated_at?: string
        }
        Relationships: []
      }
      user_app_state: {
        Row: {
          created_at: string
          key: string
          updated_at: string
          user_id: string
          value: Json
        }
        Insert: {
          created_at?: string
          key: string
          updated_at?: string
          user_id: string
          value?: Json
        }
        Update: {
          created_at?: string
          key?: string
          updated_at?: string
          user_id?: string
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_skills: {
        Row: {
          created_at: string
          done: Json
          group_id: string
          id: string
          max_kg: number | null
          max_note: string | null
          max_reps: number | null
          max_seconds: number | null
          note: string | null
          progression_index: number
          skill_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          done?: Json
          group_id: string
          id?: string
          max_kg?: number | null
          max_note?: string | null
          max_reps?: number | null
          max_seconds?: number | null
          note?: string | null
          progression_index?: number
          skill_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          done?: Json
          group_id?: string
          id?: string
          max_kg?: number | null
          max_note?: string | null
          max_reps?: number | null
          max_seconds?: number | null
          note?: string | null
          progression_index?: number
          skill_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_workouts: {
        Row: {
          created_at: string
          exercise_name: string
          group_id: string
          id: string
          load_band: string | null
          load_kg: number | null
          load_type: string | null
          progression_index: number
          recovery: number | null
          reps: number | null
          seconds: number | null
          sets: number | null
          skill_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          exercise_name: string
          group_id: string
          id?: string
          load_band?: string | null
          load_kg?: number | null
          load_type?: string | null
          progression_index: number
          recovery?: number | null
          reps?: number | null
          seconds?: number | null
          sets?: number | null
          skill_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          exercise_name?: string
          group_id?: string
          id?: string
          load_band?: string | null
          load_kg?: number | null
          load_type?: string | null
          progression_index?: number
          recovery?: number | null
          reps?: number | null
          seconds?: number | null
          sets?: number | null
          skill_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_workouts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_sessions: {
        Row: {
          completed_at: string
          created_at: string
          entries: Json
          id: string
          iso_week: number
          phase: string
          skill_id: string
          updated_at: string
          user_id: string
          year: number
        }
        Insert: {
          completed_at?: string
          created_at?: string
          entries?: Json
          id?: string
          iso_week: number
          phase: string
          skill_id: string
          updated_at?: string
          user_id: string
          year: number
        }
        Update: {
          completed_at?: string
          created_at?: string
          entries?: Json
          id?: string
          iso_week?: number
          phase?: string
          skill_id?: string
          updated_at?: string
          user_id?: string
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_delete_user: { Args: { _user_id: string }; Returns: undefined }
      admin_get_user_overview: {
        Args: { _user_id: string }
        Returns: {
          created_at: string
          custom_exercises_count: number
          email: string
          email_confirmed_at: string
          is_admin: boolean
          last_sign_in_at: string
          sessions_count: number
          skills_count: number
        }[]
      }
      admin_list_message_threads: {
        Args: never
        Returns: {
          email: string
          first_name: string
          last_message: string
          last_message_at: string
          last_name: string
          last_sender_is_admin: boolean
          nickname: string
          unread_from_user: number
          user_id: string
        }[]
      }
      admin_list_users: {
        Args: never
        Returns: {
          email: string
          first_name: string
          id: string
          last_name: string
          nickname: string
        }[]
      }
      admin_reset_user_data: { Args: { _user_id: string }; Returns: undefined }
      admin_set_role: {
        Args: {
          _grant: boolean
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: undefined
      }
      admin_update_profile: {
        Args: {
          _first_name: string
          _last_name: string
          _nickname: string
          _user_id: string
        }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      leaderboard: {
        Args: { _group: string; _idx: number; _skill: string }
        Returns: {
          kg: number
          nickname: string
          reps: number
          updated_at: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
