import TenMinplannerAPI, { UpdateTenMinPlannerType } from '@/api/tenMinPlanner.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const tenMinplannerApi = new TenMinplannerAPI();

// tenMinPlanner 여러개 불러오기
export const useTenMinPlanners = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tenMinPlanner'],
    queryFn: () => tenMinplannerApi.selectTenMinPlanners()
  });
  return { data, isLoading, error };
};

// tenMinPlanner 같은 diaryId만 불러오기
export const useTenMinPlannerToDiaryId = (diaryId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tenMinPlanner', diaryId],
    queryFn: () => tenMinplannerApi.selectTenMinPlannersOfDiaryId(diaryId)
  });
  return { data, isLoading, error };
};

// tenMinplanner 한개 불러오기
export const useTenMinPlanner = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tenMinPlanner', id],
    queryFn: () => tenMinplannerApi.selectTenMinPlannerOfPlannerId(id)
  });
  console.log({ data, error });
  return { data, isLoading, error };
};

// tenMinPlanner 생성하기
export const useCreateTenMinPlanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newTenMinplanner: UpdateTenMinPlannerType) =>
      await tenMinplannerApi.insertTenMinPlanner(newTenMinplanner),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tenMinPlanner']
      });
    }
  });
};

// tenMinPlanner 삭제하기
export const useDeleteTenMinPlanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tenMinplannerApi.deleteTenMinPlanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tenMinPlanner']
      });
    }
  });
};

// tenMinPlanner 수정하기
export const useUpdateTenMinPlanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updateTenMinPlanner }: { id: string; updateTenMinPlanner: UpdateTenMinPlannerType }) =>
      tenMinplannerApi.updateTenMinPlanner(id, updateTenMinPlanner),
    onSuccess: (data, variables) => {
      // 'variables'를 통해 mutationFn에 전달된 'id'에 접근
      queryClient.invalidateQueries({
        queryKey: ['tenMinPlanner']
      });
      queryClient.invalidateQueries({
        queryKey: ['tenMinPlanner', variables.id]
      });
    }
  });
};
