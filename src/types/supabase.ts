export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      '10min_planer_contents': {
        Row: {
          current_date: string;
          d_day: string | null;
          d_day_date: string | null;
          goal: string | null;
          id: string;
          memo: string | null;
          user_id: string | null;
        };
        Insert: {
          current_date: string;
          d_day?: string | null;
          d_day_date?: string | null;
          goal?: string | null;
          id?: string;
          memo?: string | null;
          user_id?: string | null;
        };
        Update: {
          current_date?: string;
          d_day?: string | null;
          d_day_date?: string | null;
          goal?: string | null;
          id?: string;
          memo?: string | null;
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
      '10min_timetable': {
        Row: {
          end_time: string | null;
          id: string;
          start_time: string | null;
          todo_id: string | null;
        };
        Insert: {
          end_time?: string | null;
          id?: string;
          start_time?: string | null;
          todo_id?: string | null;
        };
        Update: {
          end_time?: string | null;
          id?: string;
          start_time?: string | null;
          todo_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: '10min_timetable_todo_id_fkey';
            columns: ['todo_id'];
            isOneToOne: false;
            referencedRelation: '10min_todos';
            referencedColumns: ['id'];
          }
        ];
      };
      '10min_todos': {
        Row: {
          '10min_planer_id': string | null;
          id: string;
          todo: string | null;
        };
        Insert: {
          '10min_planer_id'?: string | null;
          id?: string;
          todo?: string | null;
        };
        Update: {
          '10min_planer_id'?: string | null;
          id?: string;
          todo?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: '10min_todos_10min_planer_id_fkey';
            columns: ['10min_planer_id'];
            isOneToOne: false;
            referencedRelation: '10min_planer_contents';
            referencedColumns: ['id'];
          }
        ];
      };
      contents: {
        Row: {
          content_id: string | null;
          id: string;
          parchment_id: string | null;
        };
        Insert: {
          content_id?: string | null;
          id?: string;
          parchment_id?: string | null;
        };
        Update: {
          content_id?: string | null;
          id?: string;
          parchment_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'contents_content_id_fkey';
            columns: ['content_id'];
            isOneToOne: false;
            referencedRelation: '10min_planer_contents';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'contents_parchment_id_fkey';
            columns: ['parchment_id'];
            isOneToOne: false;
            referencedRelation: 'parchment';
            referencedColumns: ['id'];
          }
        ];
      };
      diaries: {
        Row: {
          bookshelf_order: number;
          contents: string[] | null;
          created_at: string;
          id: string;
          user_id: string;
        };
        Insert: {
          bookshelf_order?: number;
          contents?: string[] | null;
          created_at?: string;
          id?: string;
          user_id: string;
        };
        Update: {
          bookshelf_order?: number;
          contents?: string[] | null;
          created_at?: string;
          id?: string;
          user_id?: string;
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
          cover_color: string | null;
          cover_font: string | null;
          cover_image: string | null;
          diary_id: string | null;
          diary_title: string | null;
          diary_title_color: string | null;
          diary_title_position: string | null;
          diary_title_size: string | null;
          id: string;
          image_position: string | null;
          image_size: string | null;
        };
        Insert: {
          cover_color?: string | null;
          cover_font?: string | null;
          cover_image?: string | null;
          diary_id?: string | null;
          diary_title?: string | null;
          diary_title_color?: string | null;
          diary_title_position?: string | null;
          diary_title_size?: string | null;
          id?: string;
          image_position?: string | null;
          image_size?: string | null;
        };
        Update: {
          cover_color?: string | null;
          cover_font?: string | null;
          cover_image?: string | null;
          diary_id?: string | null;
          diary_title?: string | null;
          diary_title_color?: string | null;
          diary_title_position?: string | null;
          diary_title_size?: string | null;
          id?: string;
          image_position?: string | null;
          image_size?: string | null;
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
          attendance_count: number | null;
          id: string;
          name: string | null;
        };
        Insert: {
          attendance_count?: number | null;
          id?: string;
          name?: string | null;
        };
        Update: {
          attendance_count?: number | null;
          id?: string;
          name?: string | null;
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
          attendence: number;
          created_at: string;
          diary_count: number;
          email: string;
          id: string;
          level_id: string | null;
          nickname: string | null;
        };
        Insert: {
          attendence?: number;
          created_at?: string;
          diary_count?: number;
          email: string;
          id: string;
          level_id?: string | null;
          nickname?: string | null;
        };
        Update: {
          attendence?: number;
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
      [_ in never]: never;
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
