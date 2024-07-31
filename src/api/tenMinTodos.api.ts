// import { Tables } from '@/types/supabase';
// import { supabase } from '@/supabase/client';

// export type UpdateTodoType = {
//   id: string;
//   text: string;
//   isDone: boolean;
//   color: string;
//   planer_id: string;
// };

// class TenMinTodosAPI {
//   private supabase;

//   constructor() {
//     this.supabase = supabase;
//   }

//   /**
//    *
//    * @returns ten_min_todos 테이블 데이터 전부
//    */
//   async selectTenMinTodos() {
//     const { data } = await this.supabase.from('ten_min_todos').select().returns<Tables<'ten_min_todos'>[]>();
//     return data;
//   }

//   /**
//    *
//    *  @param id {string}  ten_min_planer 데이터 id
//    * @returns ten_min_planer 테이블 데이터 중 1개
//    */
//   async selectTenMinTodoOfPlanerId(planerId: string) {
//     const { data, error } = await this.supabase
//       .from('ten_min_todos')
//       .select('*')
//       .eq('10min_planer_id', planerId)
//       .single();
//     if (error) {
//       throw new Error(`Fetch failed: ${error.message}`);
//     }
//     return data;
//   }

//   /**
//    *
//    * @param insertData  {
//    * id : string,
//    * text: string,
//    * isDone: boolean,
//    * color: string,
//    * planer_id: string,
//    * };
//    * @returns ten_min_todos에 추가된 data
//    */
//   async insertTenMinTodo(insertData: UpdateTodoType) {
//     const { id, text, isDone, color, planer_id } = insertData;
//     const { data, error } = await this.supabase.from('ten_min_todos').insert({ id, text, isDone, color, planer_id });
//     if (error) {
//       throw new Error(`Insert failed: ${error.message}`);
//     }
//     return data;
//   }

//   /**
//    *
//    * @param id {string} todo 아이디
//    * @returns 삭제된 data
//    */
//   async deleteTenMinTodo(id: string) {
//     const { data } = await this.supabase.from('ten_min_todos').delete().eq('id', id).select();
//     return data;
//   }

//   /**
//    *
//    * @param id  {string} todo 아이디
//    * @param updateData {
//    * id : string,
//    * text: string,
//    * isDone: boolean,
//    * color: string,
//    * planer_id: string,
//    * };
//   };
//    * @returns
//    */
//   async updateTenMinTodo(id: string, updateData: UpdateTodoType) {
//     const { text, isDone, color, planer_id } = updateData;
//     const { data, error } = await this.supabase
//       .from('ten_min_todos')
//       .update({ id, text, isDone, color, planer_id })
//       .eq('id', id)
//       .select('*');

//     return data;
//   }
// }

// export default TenMinTodosAPI;
