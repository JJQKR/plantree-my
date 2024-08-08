import PagesAPI, { AddPageType, UpdatePageType } from '@/api/pages.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const pagesApi = new PagesAPI();

// page 여러개 불러오기
export const usePages = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ['pages'],
    queryFn: () => pagesApi.selectPages()
  });
  return { data, isPending, isError };
};

// diaryId가 같은 page 여러개 불러오기
export const usePageToDiaryId = (diaryId: string) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ['pages', diaryId],
    queryFn: () => pagesApi.selectPagesOfDiaryId(diaryId)
  });
  return { data, isPending, isError };
};

// page 한개 불러오기
export const usePage = (id: string) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ['pages', id],
    queryFn: () => pagesApi.selectPageOfPageId(id)
  });
  return { data, isPending, isError };
};

// 새로운 page 생성하기
export const useCreatePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newPage: AddPageType) => await pagesApi.insertPage(newPage),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pages']
      });
    }
  });
};

// page 삭제하기
export const useDeletePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pagesApi.deletePageOfPageId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pages']
      });
    }
  });
};

// diaryId가 같은 pages 삭제하기
export const useDeletePages = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pagesApi.deletePageOfDiaryId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pages']
      });
    }
  });
};

// page 수정하기
export const useUpdatePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updatePage }: { id: string; updatePage: UpdatePageType }) => pagesApi.updatePage(id, updatePage),
    onSuccess: (data, variables) => {
      // 'variables'를 통해 mutationFn에 전달된 'id'에 접근
      queryClient.invalidateQueries({
        queryKey: ['pages']
      });
      queryClient.invalidateQueries({
        queryKey: ['pages', variables.id]
      });
    }
  });
};
