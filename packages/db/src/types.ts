// Regenerate with: pnpm --filter @skwash/db gen:types
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      organisations: {
        Row: { id: string; name: string; slug: string; created_at: string };
        Insert: { id?: string; name: string; slug: string; created_at?: string };
        Update: { id?: string; name?: string; slug?: string; created_at?: string };
        Relationships: [];
      };
      users: {
        Row: {
          id: string;
          org_id: string | null;
          display_name: string;
          avatar_url: string | null;
          role: 'owner' | 'admin' | 'member' | 'viewer';
          created_at: string;
        };
        Insert: {
          id: string;
          org_id?: string | null;
          display_name: string;
          avatar_url?: string | null;
          role?: 'owner' | 'admin' | 'member' | 'viewer';
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string | null;
          display_name?: string;
          avatar_url?: string | null;
          role?: 'owner' | 'admin' | 'member' | 'viewer';
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
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
