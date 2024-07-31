// import TenMinTodosAPI, { UpdateTodoType } from '@/api/tenMinTodos.api';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// const tenMinTodosApi = new TenMinTodosAPI();

// // tenMinTodos 여러개 불러오기
// export const useTenMinTodos = () => {
//   const { data, isLoading, error } = useQuery({
//     queryKey: ['tenMinTodos'],
//     queryFn: () => tenMinTodosApi.selectTenMinTodos()
//   });
//   return { data, isLoading, error };
// };

// // tenMinTodos 한개 불러오기
// export const useTenMinTodo = (planerId: string) => {
//   const { data, isLoading, error } = useQuery({
//     queryKey: ['tenMinTodos', planerId],
//     queryFn: () => tenMinTodosApi.selectTenMinTodoOfPlanerId(planerId)
//   });
//   return { data, isLoading, error };
// };

// // tenMinTodos 생성하기
// export const useCreateTenMinPlaner = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (newTodo: UpdateTodoType) =>
//       await tenMinTodosApi.insertTenMinTodo(newTodo),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ['tenMinTodos']
//       });
//     }
//   });
// };

// // tenMinTodo 삭제하기
// export const useDeleteTodo = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (id: string) => tenMinTodosApi.deleteTenMinTodo(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ['tenMinTodos']
//       });
//     }
//   });
// };

// // tenMinTodo 수정하기
// export const useUpdateTenMinTodo = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, updateTenMinPlaner }: { id: string; updateTenMinPlaner: UpdateTenMinPlanerType }) =>
//       tenMinTodosApi.updateTenMinPlaner(id, updateTenMinPlaner),
//     onSuccess: (data, variables) => {
//       // 'variables'를 통해 mutationFn에 전달된 'id'에 접근
//       queryClient.invalidateQueries({
//         queryKey: ['tenMinPlaner']
//       });
//       queryClient.invalidateQueries({
//         queryKey: ['tenMinPlaner', variables.id]
//       });
//     }
//   });
// };
