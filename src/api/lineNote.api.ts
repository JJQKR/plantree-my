import { Tables } from '@/types/supabase';
import { supabase } from '@/supabase/client';

type LineType = {
  text: string;
  fontSize: number;
  textColor: string;
};

export type UpdateLineNoteType = {
  id: string;
  user_id: string;
  diary_id: string;
  line_color: string;
  line_thickness: number;
  bg_color: string;
  global_text_color: string;
  lines: LineType[];
};

class lineNoteAPI {
  private supabase;

  constructor() {
    this.supabase = supabase;
  }

  /**
   *
   * @returns line_note 테이블 데이터 전부
   */
  async selectLineNotes() {
    const { data } = await this.supabase.from('line_note').select().returns<Tables<'line_note'>[]>();
    return data;
  }

  /**
   *
   * @param id {string}  diary 데이터 id
   * @returns line_note 테이블 데이터 중 같은 다이어리 데이터 전부
   */
  async selectLineNotesOfDiaryId(diaryId: string) {
    const { data, error } = await this.supabase
      .from('line_note')
      .select()
      .eq('diary_id', diaryId)
      .returns<Tables<'line_note'>[]>();
    if (error) {
      throw new Error(`Fetching diary failed: ${error.message}`);
    }
    return data;
  }

  /**
   *
   *  @param id {string}  line_note 데이터 id
   * @returns line_note 테이블 데이터 중 1개
   */
  async selectLineNoteOfLineNoteId(id: string) {
    if (id) {
      const { data } = await this.supabase.from('line_note').select('*').eq('id', id).maybeSingle();
      return data;
    }
    return null;
  }

  /**
   *
   * @param insertData  {
   * id: string;
   * user_id: string;
   * diary_id: string;
   * line_color: string;
   * line_thickness: number;
   * bg_color: string;
   * global_text: string;
   * lines: LineType[];
   * };
   * @returns ten_min_planner에 추가된 data
   */
  async insertLineNote(insertData: UpdateLineNoteType) {
    const { id, user_id, diary_id, line_color, line_thickness, bg_color, global_text_color, lines } = insertData;
    const { data } = await this.supabase.from('line_note').insert({
      id,
      user_id,
      diary_id,
      line_color,
      line_thickness,
      bg_color,
      global_text_color,
      lines
    });

    return data;
  }

  /**
   *
   * @param id {string} line_note 아이디
   * @returns 삭제된 data
   */
  async deleteLineNote(id: string) {
    const { data } = await this.supabase.from('line_note').delete().eq('id', id).select();
    return data;
  }

  /**
   *
   * @param id {string} diary 아이디
   * @returns 삭제된 data
   */
  async deleteLineNoteOfDiaryId(id: string) {
    const { data } = await this.supabase.from('line_note').delete().eq('diary_id', id).select();
    return data;
  }

  /**
   *
   * @param id  {string} 스케쥴 게시물 아이디
   * @param updateData {
    * id: string;
   * user_id: string;
   * diary_id: string;
   * line_color: string;
   * line_thickness: number;
   * bg_color: string;
   * global_text: string;
   * lines: LineType[];
   * };
  };
   * @returns
   */
  async updateLineNote(id: string, updateData: UpdateLineNoteType) {
    const { user_id, diary_id, line_color, line_thickness, bg_color, global_text_color, lines } = updateData;
    const { data, error } = await this.supabase
      .from('line_note')
      .update({
        user_id,
        diary_id,
        line_color,
        line_thickness,
        bg_color,
        global_text_color,
        lines
      })
      .eq('id', id);

    return data;
  }
}

export default lineNoteAPI;
