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
      audit_logs: {
        Row: {
          action: string | null
          changed_by: string | null
          entity_id: string | null
          entity_type: string | null
          log_id: string
          new_data: Json | null
          old_data: Json | null
          timestamp: string
        }
        Insert: {
          action?: string | null
          changed_by?: string | null
          entity_id?: string | null
          entity_type?: string | null
          log_id?: string
          new_data?: Json | null
          old_data?: Json | null
          timestamp?: string
        }
        Update: {
          action?: string | null
          changed_by?: string | null
          entity_id?: string | null
          entity_type?: string | null
          log_id?: string
          new_data?: Json | null
          old_data?: Json | null
          timestamp?: string
        }
        Relationships: []
      }
      communities: {
        Row: {
          community_id: string
          community_name: string
          description: string | null
        }
        Insert: {
          community_id?: string
          community_name: string
          description?: string | null
        }
        Update: {
          community_id?: string
          community_name?: string
          description?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          document_id: string
          document_type: string | null
          file_url: string | null
          uploaded_at: string
          visit_id: string | null
        }
        Insert: {
          document_id?: string
          document_type?: string | null
          file_url?: string | null
          uploaded_at?: string
          visit_id?: string | null
        }
        Update: {
          document_id?: string
          document_type?: string | null
          file_url?: string | null
          uploaded_at?: string
          visit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "visits"
            referencedColumns: ["visit_id"]
          },
        ]
      }
      families: {
        Row: {
          created_at: string
          created_by_pandit: string | null
          current_location: string | null
          family_id: string
          gotra: string | null
          kuldevta: string | null
          region_id: string | null
          root_ancestor_name: string | null
          surname_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_pandit?: string | null
          current_location?: string | null
          family_id?: string
          gotra?: string | null
          kuldevta?: string | null
          region_id?: string | null
          root_ancestor_name?: string | null
          surname_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_pandit?: string | null
          current_location?: string | null
          family_id?: string
          gotra?: string | null
          kuldevta?: string | null
          region_id?: string | null
          root_ancestor_name?: string | null
          surname_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "families_created_by_pandit_fkey"
            columns: ["created_by_pandit"]
            isOneToOne: false
            referencedRelation: "pandits"
            referencedColumns: ["pandit_id"]
          },
          {
            foreignKeyName: "families_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["region_id"]
          },
          {
            foreignKeyName: "families_surname_id_fkey"
            columns: ["surname_id"]
            isOneToOne: false
            referencedRelation: "surnames"
            referencedColumns: ["surname_id"]
          },
        ]
      }
      pandits: {
        Row: {
          assigned_district: string | null
          assigned_state: string | null
          created_at: string
          email: string | null
          name: string
          pandit_id: string
          phone: string | null
          user_id: string | null
        }
        Insert: {
          assigned_district?: string | null
          assigned_state?: string | null
          created_at?: string
          email?: string | null
          name: string
          pandit_id?: string
          phone?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_district?: string | null
          assigned_state?: string | null
          created_at?: string
          email?: string | null
          name?: string
          pandit_id?: string
          phone?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      persons: {
        Row: {
          birth_year: number | null
          created_at: string
          current_location: string | null
          death_year: number | null
          extra_info: string | null
          family_id: string
          father_id: string | null
          father_name: string | null
          gender: string | null
          husband_surname: string | null
          is_root_ancestor: boolean | null
          mother_id: string | null
          mother_name: string | null
          name: string
          name_devanagari: string | null
          num_daughters: number | null
          num_sons: number | null
          person_id: string
          profession: string | null
          spouse_name: string | null
        }
        Insert: {
          birth_year?: number | null
          created_at?: string
          current_location?: string | null
          death_year?: number | null
          extra_info?: string | null
          family_id: string
          father_id?: string | null
          father_name?: string | null
          gender?: string | null
          husband_surname?: string | null
          is_root_ancestor?: boolean | null
          mother_id?: string | null
          mother_name?: string | null
          name: string
          name_devanagari?: string | null
          num_daughters?: number | null
          num_sons?: number | null
          person_id?: string
          profession?: string | null
          spouse_name?: string | null
        }
        Update: {
          birth_year?: number | null
          created_at?: string
          current_location?: string | null
          death_year?: number | null
          extra_info?: string | null
          family_id?: string
          father_id?: string | null
          father_name?: string | null
          gender?: string | null
          husband_surname?: string | null
          is_root_ancestor?: boolean | null
          mother_id?: string | null
          mother_name?: string | null
          name?: string
          name_devanagari?: string | null
          num_daughters?: number | null
          num_sons?: number | null
          person_id?: string
          profession?: string | null
          spouse_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "persons_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["family_id"]
          },
          {
            foreignKeyName: "persons_father_id_fkey"
            columns: ["father_id"]
            isOneToOne: false
            referencedRelation: "persons"
            referencedColumns: ["person_id"]
          },
          {
            foreignKeyName: "persons_mother_id_fkey"
            columns: ["mother_id"]
            isOneToOne: false
            referencedRelation: "persons"
            referencedColumns: ["person_id"]
          },
        ]
      }
      regions: {
        Row: {
          country: string | null
          district: string | null
          region_id: string
          state: string | null
          taluka: string | null
          village: string | null
        }
        Insert: {
          country?: string | null
          district?: string | null
          region_id?: string
          state?: string | null
          taluka?: string | null
          village?: string | null
        }
        Update: {
          country?: string | null
          district?: string | null
          region_id?: string
          state?: string | null
          taluka?: string | null
          village?: string | null
        }
        Relationships: []
      }
      surnames: {
        Row: {
          community_id: string | null
          surname: string
          surname_id: string
        }
        Insert: {
          community_id?: string | null
          surname: string
          surname_id?: string
        }
        Update: {
          community_id?: string | null
          surname?: string
          surname_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "surnames_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["community_id"]
          },
        ]
      }
      visits: {
        Row: {
          added_by_pandit: string | null
          created_at: string
          family_id: string
          notes: string | null
          person_id: string | null
          purpose: string | null
          visit_id: string
          visit_place: string | null
          visit_year: number | null
        }
        Insert: {
          added_by_pandit?: string | null
          created_at?: string
          family_id: string
          notes?: string | null
          person_id?: string | null
          purpose?: string | null
          visit_id?: string
          visit_place?: string | null
          visit_year?: number | null
        }
        Update: {
          added_by_pandit?: string | null
          created_at?: string
          family_id?: string
          notes?: string | null
          person_id?: string | null
          purpose?: string | null
          visit_id?: string
          visit_place?: string | null
          visit_year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "visits_added_by_pandit_fkey"
            columns: ["added_by_pandit"]
            isOneToOne: false
            referencedRelation: "pandits"
            referencedColumns: ["pandit_id"]
          },
          {
            foreignKeyName: "visits_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["family_id"]
          },
          {
            foreignKeyName: "visits_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "persons"
            referencedColumns: ["person_id"]
          },
        ]
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
