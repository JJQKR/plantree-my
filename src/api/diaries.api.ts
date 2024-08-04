import { Tables } from '@/types/supabase';
import { supabase } from '@/supabase/client';

export type AddDiaryType = {
  id: string;
  user_id: string;
  bookshelf_order: number;
  name: string | null;
};

export type UpdateDiaryType = {
  user_id: string;
  bookshelf_order: number;
  name: string | null;
};

export type Diary = {
  id: string;
  user_id: string;
  bookshelf_order: number;
  name: string | null;
};

class DiariesAPI {
  private supabase;

  constructor() {
    this.supabase = supabase;
  }

  /**
   *
   * @param id {string}  user 데이터 id
   * @returns diaries 테이블 데이터 중 같은 user 데이터 전부
   */
  async selectPagesOfDiaryId(userId: string) {
    const { data, error } = await this.supabase
      .from('diaries')
      .select()
      .eq('user_id', userId)
      .returns<Tables<'diaries'>[]>();
    return data;
  }

  /**
   *
   *  @param id {string}  diary id
   * @returns diaries 테이블 데이터 중 1개
   */
  async selectDiaryOfDiaryId(id: string) {
    if (id) {
      const { data } = await this.supabase.from('diaries').select('*').eq('id', id).maybeSingle();
      return data;
    }
    return null;
  }
  /**
   *
   * @param insertData  {
   *   id: string;
   *   user_id: string;
   *   bookshelf_order: number;
   *   name: string | null;
   * };
   * @returns pages에 추가된 data
   */
  async insertDiary(insertData: AddDiaryType) {
    const { id, user_id, bookshelf_order, name } = insertData;
    const { data } = await this.supabase.from('diaries').insert({
      id,
      user_id,
      bookshelf_order,
      name
    });

    return data;
  }

  /**
   *
   * @param id {string} diary 아이디
   * @returns 삭제된 data
   */
  async deletePage(id: string) {
    const { data } = await this.supabase.from('diaries').delete().eq('id', id).select();
    return data;
  }

  /**
   *
   * @param id  {string} diary 아이디
   * @param updateData {
   *   id: string;
   *   user_id: string;
   *   bookshelf_order: number;
   *   name: string | null;
   * };
   * @returns
   */
  async updatePage(id: string, updateData: UpdateDiaryType) {
    const { user_id, bookshelf_order, name } = updateData;
    const { data } = await this.supabase
      .from('diaries')
      .update({
        user_id,
        bookshelf_order,
        name
      })
      .eq('id', id);
    return data;
  }
}

export default DiariesAPI;
