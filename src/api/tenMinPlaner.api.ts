import { Tables } from '@/types/supabase';
import { supabase } from '@/supabase/client';

export type UpdateTenMinPlanerType = {
  date: string;
  d_day_date: string;
  d_day: string;
  goal: string;
  memo: string;
  timetable: { [key: string]: { active: boolean; color: string; todoId: string } };
  diary_id: string;
  user_id: string;
};

class TenMinPlanerAPI {
  private supabase;

  constructor() {
    this.supabase = supabase;
  }

  /**
   *
   * @returns ten_min_planer 테이블 데이터 전부
   */
  async selectTenMinPlaners() {
    const { data } = await this.supabase.from('ten_min_planer').select().returns<Tables<'ten_min_planer'>[]>();
    return data;
  }

  /**
   *
   * @param id {string}  diary 데이터 id
   * @returns ten_min_planer 테이블 데이터 중 같은 다이어리 데이터 전부
   */
  async selectTenMinPlanersOfDiaryId(diaryId: string) {
    const { data, error } = await this.supabase
      .from('ten_min_planer')
      .select()
      .eq('diaryId', diaryId)
      .returns<Tables<'ten_min_planer'>[]>();
    if (error) {
      throw new Error(`Fetching diary failed: ${error.message}`);
    }
    return data;
  }

  /**
   *
   *  @param id {string}  ten_min_planer 데이터 id
   * @returns ten_min_planer 테이블 데이터 중 1개
   */
  async selectTenMinPlanerOfPlanerId(id: string) {
    const { data } = await this.supabase.from('ten_min_planer').select('*').eq('id', id).single();
    return data;
  }

  /**
   *
   * @param insertData  {
   * date : string,
   * d_day_date : string,
   * d_day : string,
   * goal : string,
   * memo : string,
   * timetable: { [key: string]: { active: boolean; color: string; id: string } },
   * user_id:string
   * };
   * @returns ten_min_planer에 추가된 data
   */
  async insertTenMinPlaner(insertData: UpdateTenMinPlanerType) {
    const { date, d_day_date, d_day, goal, memo, timetable, diary_id, user_id } = insertData;
    const { data } = await this.supabase
      .from('ten_min_planer')
      .insert({ date, d_day_date, d_day, goal, memo, timetable, diary_id, user_id });

    return data;
  }

  /**
   *
   * @param id {string} 스케쥴 게시물 아이디
   * @returns 삭제된 data
   */
  async deleteTenMinPlaner(id: string) {
    const { data } = await this.supabase.from('ten_min_planer').delete().eq('id', id).select();
    return data;
  }

  /**
   *
   * @param id  {string} 스케쥴 게시물 아이디
   * @param updateData {
    date : string,
   * d_day_date : string,
   * d_day : string,
   * goal : string,
   * memo : string,
   * timetable: { [key: string]: { active: boolean; color: string; id: string } },
   * user_id:string
   * };
  };
   * @returns
   */
  async updateTenMinPlaner(id: string, updateData: UpdateTenMinPlanerType) {
    const { date, d_day_date, d_day, goal, memo, timetable, diary_id, user_id } = updateData;
    const { data, error } = await this.supabase
      .from('ten_min_planer')
      .update({ date, d_day_date, d_day, goal, memo, timetable, diary_id, user_id })
      .eq('id', id)
      .select('*');

    return data;
  }
}

export default TenMinPlanerAPI;
