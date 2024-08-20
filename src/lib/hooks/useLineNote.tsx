import lineNoteAPI, { UpdateLineNoteType } from '@/api/lineNote.api';
import TenMinplannerAPI, { UpdateTenMinPlannerType } from '@/api/tenMinPlanner.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const lineNoteApi = new lineNoteAPI();

// lineNotes, 여러개 불러오기
export const useLineNotes = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['lineNote'],
    queryFn: () => lineNoteApi.selectLineNotes()
  });
  return { data, isLoading, error };
};

// lineNotes, 같은 diaryId만 불러오기
export const useLineNotesToDiaryId = (diaryId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['lineNote', diaryId],
    queryFn: () => lineNoteApi.selectLineNotesOfDiaryId(diaryId)
  });
  return { data, isLoading, error };
};

// lineNote, 한개 불러오기
export const useLineNote = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['lineNote', id],
    queryFn: () => lineNoteApi.selectLineNoteOfLineNoteId(id)
  });
  return { data, isLoading, error };
};

// lineNote, 생성하기
export const useCreateLineNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newLineNote: UpdateLineNoteType) => await lineNoteApi.insertLineNote(newLineNote),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lineNote']
      });
    }
  });
};

// lineNote, 삭제하기
export const useDeleteLineNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => lineNoteApi.deleteLineNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lineNote']
      });
    }
  });
};

// lineNotes, 같은 diaryId 삭제하기
export const useDeleteLineNotes = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => lineNoteApi.deleteLineNoteOfDiaryId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lineNote']
      });
    }
  });
};

// lineNote, 수정하기
export const useUpdateLineNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updateLineNote }: { id: string; updateLineNote: UpdateLineNoteType }) =>
      lineNoteApi.updateLineNote(id, updateLineNote),
    onSuccess: (data, variables) => {
      // 'variables'를 통해 mutationFn에 전달된 'id'에 접근
      queryClient.invalidateQueries({
        queryKey: ['lineNote']
      });
      queryClient.invalidateQueries({
        queryKey: ['lineNote', variables.id]
      });
    }
  });
};
