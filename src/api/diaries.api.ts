import { supabase } from '@/supabase/client';
import { Tables } from '@/types/supabase';

export type AddDiaryType = {
  id: string;
  user_id: string | null;
  bookshelf_order: number;
  name: string | null;
};

export type UpdateDiaryType = {
  user_id: string | null;
  bookshelf_order: number;
  name: string | null;
};

class DiariesAPI {
  private supabase;

  constructor() {
    this.supabase = supabase;
  }

  /**
   * @param userId {string} 사용자 ID
   * @returns 사용자 ID에 대한 다이어리 데이터
   */
  async selectPagesOfUserId(userId: string) {
    const { data, error } = await this.supabase
      .from('diaries')
      .select()
      .eq('user_id', userId)
      .order('bookshelf_order', { ascending: true })
      .returns<Tables<'diaries'>[]>();
    if (error) {
      console.error('Error fetching diaries:', error);
    }
    return data;
  }

  /**
   * @param id {string} 다이어리 ID
   * @returns 단일 다이어리 데이터
   */
  async selectDiaryOfDiaryId(id: string) {
    if (id) {
      const { data, error } = await this.supabase.from('diaries').select('*').eq('id', id).maybeSingle();
      if (error) {
        console.error('Error fetching diary:', error);
      }
      return data;
    }
    return null;
  }

  /**
   * @param insertData { AddDiaryType }
   * @returns 새로 추가된 다이어리 데이터
   */
  async insertDiary(insertData: AddDiaryType) {
    const { id, user_id, bookshelf_order, name } = insertData;
    const { data, error } = await this.supabase.from('diaries').insert({
      id,
      user_id,
      bookshelf_order,
      name
    });
    if (error) {
      console.error('Error inserting diary:', error);
    }
    return data;
  }

  /**
   * @param id {string} 다이어리 ID
   * @returns 삭제된 다이어리 데이터
   */
  async deletePage(id: string) {
    const { data, error } = await this.supabase.from('diaries').delete().eq('id', id).select();
    if (error) {
      console.error('Error deleting diary:', error);
    }
    return data;
  }

  /**
   * @param id {string} 다이어리 ID
   * @param updateData { UpdateDiaryType }
   * @returns 업데이트된 다이어리 데이터
   */
  async updatePage(id: string, updateData: UpdateDiaryType) {
    const { user_id, bookshelf_order, name } = updateData;
    const { data, error } = await this.supabase
      .from('diaries')
      .update({
        user_id,
        bookshelf_order,
        name
      })
      .eq('id', id);
    if (error) {
      console.error('Error updating diary:', error);
    }
    return data;
  }
}

export default DiariesAPI;
