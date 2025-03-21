export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      badges: {
        Row: {
          id: string;
          requisite: number | null;
        };
        Insert: {
          id: string;
          requisite?: number | null;
        };
        Update: {
          id?: string;
          requisite?: number | null;
        };
        Relationships: [];
      };
      blank_note: {
        Row: {
          bgColor: string | null;
          content: string | null;
          created_at: string;
          date: string | null;
          diary_id: string | null;
          globalTextColor: string | null;
          id: string;
          title: string | null;
          user_id: string | null;
        };
        Insert: {
          bgColor?: string | null;
          content?: string | null;
          created_at?: string;
          date?: string | null;
          diary_id?: string | null;
          globalTextColor?: string | null;
          id?: string;
          title?: string | null;
          user_id?: string | null;
        };
        Update: {
          bgColor?: string | null;
          content?: string | null;
          created_at?: string;
          date?: string | null;
          diary_id?: string | null;
          globalTextColor?: string | null;
          id?: string;
          title?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'blank_note_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      diaries: {
        Row: {
          bookshelf_order: number;
          created_at: string;
          id: string;
          name: string | null;
          user_id: string | null;
        };
        Insert: {
          bookshelf_order?: number;
          created_at?: string;
          id?: string;
          name?: string | null;
          user_id?: string | null;
        };
        Update: {
          bookshelf_order?: number;
          created_at?: string;
          id?: string;
          name?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
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
          unsplash_image: string | null;
          unsplash_image_position: Json | null;
          unsplash_image_rotation: number | null;
          unsplash_image_size: Json | null;
          unsplash_scale: number | null;
          user_id: string | null;
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
          unsplash_image?: string | null;
          unsplash_image_position?: Json | null;
          unsplash_image_rotation?: number | null;
          unsplash_image_size?: Json | null;
          unsplash_scale?: number | null;
          user_id?: string | null;
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
          unsplash_image?: string | null;
          unsplash_image_position?: Json | null;
          unsplash_image_rotation?: number | null;
          unsplash_image_size?: Json | null;
          unsplash_scale?: number | null;
          user_id?: string | null;
        };
        Relationships: [];
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
          diary_id: string | null;
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
          diary_id?: string | null;
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
          diary_id?: string | null;
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
          content_id: string;
          diary_id: string | null;
          id: string;
          index: number;
          parchment_style: string;
        };
        Insert: {
          content_id: string;
          diary_id?: string | null;
          id?: string;
          index: number;
          parchment_style: string;
        };
        Update: {
          content_id?: string;
          diary_id?: string | null;
          id?: string;
          index?: number;
          parchment_style?: string;
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
          date: string | null;
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
          date?: string | null;
          diary_id?: string | null;
          goal?: string | null;
          id: string;
          memo?: string | null;
          timetable?: Json | null;
          todo_list?: Json | null;
          user_id?: string | null;
        };
        Update: {
          d_day?: string | null;
          d_day_date?: string | null;
          date?: string | null;
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
      users: {
        Row: {
          attendance: number;
          created_at: string | null;
          diary_count: number;
          email: string;
          id: string;
          lastCheckInDate: string | null;
          level_id: string | null;
          nickname: string | null;
        };
        Insert: {
          attendance?: number;
          created_at?: string | null;
          diary_count?: number;
          email: string;
          id: string;
          lastCheckInDate?: string | null;
          level_id?: string | null;
          nickname?: string | null;
        };
        Update: {
          attendance?: number;
          created_at?: string | null;
          diary_count?: number;
          email?: string;
          id?: string;
          lastCheckInDate?: string | null;
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
      users_badges: {
        Row: {
          badges: string;
          id: string;
        };
        Insert: {
          badges: string;
          id: string;
        };
        Update: {
          badges?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'users_badges_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
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
