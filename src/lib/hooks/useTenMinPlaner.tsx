import TenMinPlanerAPI, { UpdateTenMinPlanerType } from '@/api/tenMinPlaner.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const tenMinPlanerApi = new TenMinPlanerAPI();

// tenMinPlaner 여러개 불러오기
export const useTenMinPlaners = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tenMinPlaner'],
    queryFn: () => tenMinPlanerApi.selectTenMinPlaners()
  });
  return { data, isLoading, error };
};

// tenMinPlaner 같은 diaryId만 불러오기
export const useTenMinPlanerToDiaryId = (diaryId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tenMinPlaner', diaryId],
    queryFn: () => tenMinPlanerApi.selectTenMinPlanersOfDiaryId(diaryId)
  });
  return { data, isLoading, error };
};

// tenMinPlaner 한개 불러오기
export const useTenMinPlaner = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tenMinPlaner', id],
    queryFn: () => tenMinPlanerApi.selectTenMinPlanerOfPlanerId(id)
  });
  return { data, isLoading, error };
};

// tenMinPlaner 생성하기
export const useCreateTenMinPlaner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newTenMinPlaner: UpdateTenMinPlanerType) =>
      await tenMinPlanerApi.insertTenMinPlaner(newTenMinPlaner),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tenMinPlaner']
      });
    }
  });
};

// tenMinPlaner 삭제하기
export const useDeleteTenMinPlaner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tenMinPlanerApi.deleteTenMinPlaner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tenMinPlaner']
      });
    }
  });
};

// tenMinPlaner 수정하기
export const useUpdateTenMinPlaner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updateTenMinPlaner }: { id: string; updateTenMinPlaner: UpdateTenMinPlanerType }) =>
      tenMinPlanerApi.updateTenMinPlaner(id, updateTenMinPlaner),
    onSuccess: (data, variables) => {
      // 'variables'를 통해 mutationFn에 전달된 'id'에 접근
      queryClient.invalidateQueries({
        queryKey: ['tenMinPlaner']
      });
      queryClient.invalidateQueries({
        queryKey: ['tenMinPlaner', variables.id]
      });
    }
  });
};
