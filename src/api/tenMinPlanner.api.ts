import { Tables } from '@/types/supabase';
import { supabase } from '@/supabase/client';

export type TodoType = {
  id: string;
  text: string;
  isDone: boolean;
  color: string;
  planner_id: string;
};

export type UpdateTenMinPlannerType = {
  id: string;
  date: string;
  d_day_date: string;
  d_day: string;
  goal: string;
  memo: string;
  timetable: { [key: string]: { active: boolean; color: string; todoId: string } };
  diary_id: string;
  user_id: string;
  todo_list: TodoType[];
};

class TenMinPlannerAPI {
  private supabase;

  constructor() {
    this.supabase = supabase;
  }

  /**
   *
   * @returns ten_min_planner 테이블 데이터 전부
   */
  async selectTenMinPlanners() {
    const { data } = await this.supabase.from('ten_min_planner').select().returns<Tables<'ten_min_planner'>[]>();
    return data;
  }

  /**
   *
   * @param id {string}  diary 데이터 id
   * @returns ten_min_planner 테이블 데이터 중 같은 다이어리 데이터 전부
   */
  async selectTenMinPlannersOfDiaryId(diaryId: string) {
    const { data, error } = await this.supabase
      .from('ten_min_planner')
      .select()
      .eq('diary_id', diaryId)
      .returns<Tables<'ten_min_planner'>[]>();
    if (error) {
      throw new Error(`Fetching diary failed: ${error.message}`);
    }
    return data;
  }

  /**
   *
   *  @param id {string}  ten_min_planner 데이터 id
   * @returns ten_min_planner 테이블 데이터 중 1개
   */
  async selectTenMinPlannerOfPlannerId(id: string) {
    if (id) {
      const { data } = await this.supabase.from('ten_min_planner').select('*').eq('id', id).maybeSingle();
      return data;
    }
    return null;
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
   * @returns ten_min_planner에 추가된 data
   */
  async insertTenMinPlanner(insertData: UpdateTenMinPlannerType) {
    const { id, date, d_day_date, d_day, goal, memo, timetable, diary_id, user_id, todo_list } = insertData;
    const { data } = await this.supabase.from('ten_min_planner').insert({
      id,
      date,
      d_day_date: d_day_date ? d_day_date : null,
      d_day,
      goal,
      memo,
      timetable,
      diary_id,
      user_id,
      todo_list
    });

    return data;
  }

  /**
   *
   * @param id {string} ten_min_planner 아이디
   * @returns 삭제된 data
   */
  async deleteTenMinPlanner(id: string) {
    const { data } = await this.supabase.from('ten_min_planner').delete().eq('id', id).select();
    return data;
  }

  /**
   *
   * @param id {string} diary 아이디
   * @returns 삭제된 data
   */
  async deleteTenMinPlannerOfDiaryId(id: string) {
    const { data } = await this.supabase.from('ten_min_planner').delete().eq('diary_id', id).select();
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
  async updateTenMinPlanner(id: string, updateData: UpdateTenMinPlannerType) {
    const { date, d_day_date, d_day, goal, memo, timetable, diary_id, user_id, todo_list } = updateData;
    console.log({ date, d_day_date, d_day, goal, memo, timetable, diary_id, user_id, todo_list });
    const { data, error } = await this.supabase
      .from('ten_min_planner')
      .update({
        date,
        d_day_date: d_day_date ? d_day_date : null,
        d_day,
        goal,
        memo,
        timetable,
        diary_id,
        user_id,
        todo_list
      })
      .eq('id', id);
    // .select('*');
    console.log({ data, error });

    return data;
  }
}

export default TenMinPlannerAPI;
