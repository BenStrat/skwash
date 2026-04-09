// Regenerate with: pnpm --filter @skwash/db gen:types
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      organisations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          id: string;
          org_id: string | null;
          display_name: string;
          avatar_url: string | null;
          role: Database['public']['Enums']['user_role'];
          created_at: string;
        };
        Insert: {
          id: string;
          org_id?: string | null;
          display_name: string;
          avatar_url?: string | null;
          role?: Database['public']['Enums']['user_role'];
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string | null;
          display_name?: string;
          avatar_url?: string | null;
          role?: Database['public']['Enums']['user_role'];
          created_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          base_url: string;
          status: Database['public']['Enums']['project_status'];
          review_status: Database['public']['Enums']['review_status'];
          linear_team_id: string | null;
          linear_api_key_encrypted: string | null;
          graphql_endpoint: string | null;
          graphql_headers_encrypted: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          name: string;
          base_url: string;
          status?: Database['public']['Enums']['project_status'];
          review_status?: Database['public']['Enums']['review_status'];
          linear_team_id?: string | null;
          linear_api_key_encrypted?: string | null;
          graphql_endpoint?: string | null;
          graphql_headers_encrypted?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          name?: string;
          base_url?: string;
          status?: Database['public']['Enums']['project_status'];
          review_status?: Database['public']['Enums']['review_status'];
          linear_team_id?: string | null;
          linear_api_key_encrypted?: string | null;
          graphql_endpoint?: string | null;
          graphql_headers_encrypted?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      review_items: {
        Row: {
          id: string;
          project_id: string;
          url: string;
          title: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          url: string;
          title: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          url?: string;
          title?: string;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      review_rounds: {
        Row: {
          id: string;
          review_item_id: string;
          label: string;
          description: string | null;
          is_active: boolean;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          review_item_id: string;
          label: string;
          description?: string | null;
          is_active?: boolean;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          review_item_id?: string;
          label?: string;
          description?: string | null;
          is_active?: boolean;
          created_by?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      annotations: {
        Row: {
          id: string;
          review_item_id: string;
          review_round_id: string | null;
          author_id: string;
          type: Database['public']['Enums']['annotation_type'];
          viewport: string;
          pin_number: number;
          x_percent: number;
          y_percent: number;
          width_percent: number | null;
          height_percent: number | null;
          status: Database['public']['Enums']['annotation_status'];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          review_item_id: string;
          review_round_id?: string | null;
          author_id: string;
          type: Database['public']['Enums']['annotation_type'];
          viewport: string;
          pin_number: number;
          x_percent: number;
          y_percent: number;
          width_percent?: number | null;
          height_percent?: number | null;
          status?: Database['public']['Enums']['annotation_status'];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          review_item_id?: string;
          review_round_id?: string | null;
          author_id?: string;
          type?: Database['public']['Enums']['annotation_type'];
          viewport?: string;
          pin_number?: number;
          x_percent?: number;
          y_percent?: number;
          width_percent?: number | null;
          height_percent?: number | null;
          status?: Database['public']['Enums']['annotation_status'];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      comments: {
        Row: {
          id: string;
          annotation_id: string;
          author_id: string;
          parent_id: string | null;
          body: string;
          edited_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          annotation_id: string;
          author_id: string;
          parent_id?: string | null;
          body: string;
          edited_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          annotation_id?: string;
          author_id?: string;
          parent_id?: string | null;
          body?: string;
          edited_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      reactions: {
        Row: {
          id: string;
          comment_id: string;
          user_id: string;
          emoji: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          comment_id: string;
          user_id: string;
          emoji: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          comment_id?: string;
          user_id?: string;
          emoji?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      review_sessions: {
        Row: {
          id: string;
          review_item_id: string;
          user_id: string;
          status: Database['public']['Enums']['review_session_status'];
          started_at: string;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          review_item_id: string;
          user_id: string;
          status: Database['public']['Enums']['review_session_status'];
          started_at?: string;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          review_item_id?: string;
          user_id?: string;
          status?: Database['public']['Enums']['review_session_status'];
          started_at?: string;
          completed_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      feedback_clusters: {
        Row: {
          id: string;
          review_item_id: string;
          title: string;
          summary: string;
          severity: Database['public']['Enums']['cluster_severity'];
          tags: string[];
          annotation_ids: string[];
          linear_issue_id: string | null;
          linear_issue_url: string | null;
          exported: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          review_item_id: string;
          title: string;
          summary: string;
          severity: Database['public']['Enums']['cluster_severity'];
          tags?: string[];
          annotation_ids: string[];
          linear_issue_id?: string | null;
          linear_issue_url?: string | null;
          exported?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          review_item_id?: string;
          title?: string;
          summary?: string;
          severity?: Database['public']['Enums']['cluster_severity'];
          tags?: string[];
          annotation_ids?: string[];
          linear_issue_id?: string | null;
          linear_issue_url?: string | null;
          exported?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      reviewer_notes: {
        Row: {
          id: string;
          review_item_id: string;
          content: string | null;
          updated_by: string;
          updated_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          review_item_id: string;
          content?: string | null;
          updated_by: string;
          updated_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          review_item_id?: string;
          content?: string | null;
          updated_by?: string;
          updated_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: 'owner' | 'admin' | 'member' | 'viewer';
      project_status: 'active' | 'archived';
      review_status: 'none' | 'in_progress' | 'ready_for_review' | 'approved' | 'changes_requested';
      annotation_type: 'pin' | 'area';
      annotation_status: 'active' | 'resolved';
      review_session_status: 'in_progress' | 'complete';
      cluster_severity: 'critical' | 'high' | 'medium' | 'low';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
