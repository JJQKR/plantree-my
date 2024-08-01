import TenMinplannerAPI, { UpdateTenMinplannerType } from '@/api/tenMinPlanner.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const tenMinplannerApi = new TenMinplannerAPI();

// tenMinplanner 여러개 불러오기
export const useTenMinplanners = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tenMinplanner'],
    queryFn: () => tenMinplannerApi.selectTenMinplanners()
  });
  return { data, isLoading, error };
};

// tenMinplanner 같은 diaryId만 불러오기
export const useTenMinplannerToDiaryId = (diaryId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tenMinplanner', diaryId],
    queryFn: () => tenMinplannerApi.selectTenMinplannersOfDiaryId(diaryId)
  });
  return { data, isLoading, error };
};

// tenMinplanner 한개 불러오기
export const useTenMinplanner = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tenMinplanner', id],
    queryFn: () => tenMinplannerApi.selectTenMinplannerOfplannerId(id)
  });
  return { data, isLoading, error };
};

// tenMinplanner 생성하기
export const useCreateTenMinplanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newTenMinplanner: UpdateTenMinplannerType) =>
      await tenMinplannerApi.insertTenMinplanner(newTenMinplanner),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tenMinplanner']
      });
    }
  });
};

// tenMinplanner 삭제하기
export const useDeleteTenMinplanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tenMinplannerApi.deleteTenMinplanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tenMinplanner']
      });
    }
  });
};

// tenMinplanner 수정하기
export const useUpdateTenMinplanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updateTenMinplanner }: { id: string; updateTenMinplanner: UpdateTenMinplannerType }) =>
      tenMinplannerApi.updateTenMinplanner(id, updateTenMinplanner),
    onSuccess: (data, variables) => {
      // 'variables'를 통해 mutationFn에 전달된 'id'에 접근
      queryClient.invalidateQueries({
        queryKey: ['tenMinplanner']
      });
      queryClient.invalidateQueries({
        queryKey: ['tenMinplanner', variables.id]
      });
    }
  });
};
