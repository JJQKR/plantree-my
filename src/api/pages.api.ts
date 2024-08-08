import { Tables } from '@/types/supabase';
import { supabase } from '@/supabase/client';

export type AddPageType = {
  id: string;
  content_id: string;
  parchment_style: string;
  index: number;
  diary_id: string | null;
};

export type UpdatePageType = {
  content_id: string;
  parchment_style: string;
  index: number;
  diary_id: string | null;
};

class PagesAPI {
  private supabase;

  constructor() {
    this.supabase = supabase;
  }

  /**
   *
   * @returns pages 테이블 데이터 전부
   */
  async selectPages() {
    const { data } = await this.supabase.from('pages').select().returns<Tables<'pages'>[]>();
    return data;
  }

  /**
   *
   * @param id {string}  diary 데이터 id
   * @returns pages 테이블 데이터 중 같은 다이어리 데이터 전부
   */
  async selectPagesOfDiaryId(diaryId: string) {
    const { data, error } = await this.supabase
      .from('pages')
      .select()
      .eq('diary_id', diaryId)
      .returns<Tables<'pages'>[]>();
    return data;
  }

  /**
   *
   *  @param id {string}  page 데이터 id
   * @returns pages 테이블 데이터 중 1개
   */
  async selectPageOfPageId(id: string) {
    if (id) {
      const { data } = await this.supabase.from('pages').select('*').eq('id', id).maybeSingle();
      return data;
    }
    return null;
  }

  /**
   *
   * @param insertData  {
   * content_id: string;
   * parchment_style: string;
   * index: number;
   * diary_id: string;
   * };
   * @returns pages에 추가된 data
   */
  async insertPage(insertData: AddPageType) {
    const { id, content_id, parchment_style, index, diary_id } = insertData;
    const { data } = await this.supabase.from('pages').insert({
      id,
      content_id,
      parchment_style,
      index,
      diary_id
    });

    return data;
  }

  /**
   *
   * @param id {string} page 아이디
   * @returns 삭제된 data
   */
  async deletePageOfPageId(id: string) {
    const { data } = await this.supabase.from('pages').delete().eq('id', id).select();
    return data;
  }

  /**
   *
   * @param id {string} diary 아이디
   * @returns 삭제된 data
   */
  async deletePageOfDiaryId(id: string) {
    const { data } = await this.supabase.from('pages').delete().eq('diary_id', id).select();
    return data;
  }

  /**
   *
   * @param id  {string} page 아이디
   * @param updateData {
   * content_id: string;
   * parchment_style: string;
   * index: number;
   * diary_id: string;
   * };
  };
   * @returns
   */
  async updatePage(id: string, updateData: UpdatePageType) {
    const { content_id, parchment_style, index, diary_id } = updateData;
    const { data } = await this.supabase
      .from('pages')
      .update({
        content_id,
        parchment_style,
        index,
        diary_id
      })
      .eq('id', id);
    return data;
  }
}

export default PagesAPI;
