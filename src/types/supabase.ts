export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      diaries: {
        Row: {
          bookshelf_order: number;
          content: string | null;
          created_at: string;
          id: string;
          name: string | null;
          user_id: string | null;
        };
        Insert: {
          bookshelf_order?: number;
          content?: string | null;
          created_at?: string;
          id?: string;
          name?: string | null;
          user_id?: string | null;
        };
        Update: {
          bookshelf_order?: number;
          content?: string | null;
          created_at?: string;
          id?: string;
          name?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'diaries_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      diary_covers: {
        Row: {
          cover_bg_color: string | null;
          cover_image: string | null;
          cover_image_position: Json | null;
          cover_image_rotation: number | null;
          cover_image_size: Json | null;
          cover_scale: number | null;
          cover_stage_size: Json | null;
          cover_title: string | null;
          cover_title_fontsize: number | null;
          cover_title_position: Json | null;
          cover_title_rotation: number | null;
          cover_title_width: number | null;
          diary_id: string | null;
          id: string;
        };
        Insert: {
          cover_bg_color?: string | null;
          cover_image?: string | null;
          cover_image_position?: Json | null;
          cover_image_rotation?: number | null;
          cover_image_size?: Json | null;
          cover_scale?: number | null;
          cover_stage_size?: Json | null;
          cover_title?: string | null;
          cover_title_fontsize?: number | null;
          cover_title_position?: Json | null;
          cover_title_rotation?: number | null;
          cover_title_width?: number | null;
          diary_id?: string | null;
          id?: string;
        };
        Update: {
          cover_bg_color?: string | null;
          cover_image?: string | null;
          cover_image_position?: Json | null;
          cover_image_rotation?: number | null;
          cover_image_size?: Json | null;
          cover_scale?: number | null;
          cover_stage_size?: Json | null;
          cover_title?: string | null;
          cover_title_fontsize?: number | null;
          cover_title_position?: Json | null;
          cover_title_rotation?: number | null;
          cover_title_width?: number | null;
          diary_id?: string | null;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'diary_covers_diary_id_fkey';
            columns: ['diary_id'];
            isOneToOne: false;
            referencedRelation: 'diaries';
            referencedColumns: ['id'];
          }
        ];
      };
      level: {
        Row: {
          attendance_requirement: number | null;
          id: string;
          name: string | null;
        };
        Insert: {
          attendance_requirement?: number | null;
          id?: string;
          name?: string | null;
        };
        Update: {
          attendance_requirement?: number | null;
          id?: string;
          name?: string | null;
        };
        Relationships: [];
      };
      line_note: {
        Row: {
          bg_color: string | null;
          created_at: string;
          global_text_color: string | null;
          id: string;
          line_color: string | null;
          line_thickness: number | null;
          lines: Json | null;
          user_id: string | null;
        };
        Insert: {
          bg_color?: string | null;
          created_at?: string;
          global_text_color?: string | null;
          id?: string;
          line_color?: string | null;
          line_thickness?: number | null;
          lines?: Json | null;
          user_id?: string | null;
        };
        Update: {
          bg_color?: string | null;
          created_at?: string;
          global_text_color?: string | null;
          id?: string;
          line_color?: string | null;
          line_thickness?: number | null;
          lines?: Json | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'line_note_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      pages: {
        Row: {
          content_id: string | null;
          diary_id: string | null;
          id: string;
          page_index: number | null;
        };
        Insert: {
          content_id?: string | null;
          diary_id?: string | null;
          id?: string;
          page_index?: number | null;
        };
        Update: {
          content_id?: string | null;
          diary_id?: string | null;
          id?: string;
          page_index?: number | null;
        };
        Relationships: [];
      };
      parchment: {
        Row: {
          id: string;
          name: string | null;
        };
        Insert: {
          id?: string;
          name?: string | null;
        };
        Update: {
          id?: string;
          name?: string | null;
        };
        Relationships: [];
      };
      ten_min_planner: {
        Row: {
          d_day: string | null;
          d_day_date: string | null;
          date: string;
          diary_id: string | null;
          goal: string | null;
          id: string;
          memo: string | null;
          timetable: Json | null;
          todo_list: Json | null;
          user_id: string | null;
        };
        Insert: {
          d_day?: string | null;
          d_day_date?: string | null;
          date: string;
          diary_id?: string | null;
          goal?: string | null;
          id?: string;
          memo?: string | null;
          timetable?: Json | null;
          todo_list?: Json | null;
          user_id?: string | null;
        };
        Update: {
          d_day?: string | null;
          d_day_date?: string | null;
          date?: string;
          diary_id?: string | null;
          goal?: string | null;
          id?: string;
          memo?: string | null;
          timetable?: Json | null;
          todo_list?: Json | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: '10min_planer_contents_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      user_badge: {
        Row: {
          badge_id: string | null;
          id: string;
          user_id: string | null;
        };
        Insert: {
          badge_id?: string | null;
          id?: string;
          user_id?: string | null;
        };
        Update: {
          badge_id?: string | null;
          id?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'user_badge_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      users: {
        Row: {
          attendance: number;
          created_at: string;
          diary_count: number;
          email: string;
          id: string;
          level_id: string | null;
          nickname: string | null;
        };
        Insert: {
          attendance?: number;
          created_at?: string;
          diary_count?: number;
          email: string;
          id: string;
          level_id?: string | null;
          nickname?: string | null;
        };
        Update: {
          attendance?: number;
          created_at?: string;
          diary_count?: number;
          email?: string;
          id?: string;
          level_id?: string | null;
          nickname?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'users_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'users_level_id_fkey';
            columns: ['level_id'];
            isOneToOne: false;
            referencedRelation: 'level';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      delete_user_account: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views']) | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
  ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never;
