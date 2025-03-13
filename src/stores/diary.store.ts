import { create } from 'zustand';
import { supabase } from '@/supabase/client';
import { AddDiaryType, UpdateDiaryType } from '@/api/diaries.api';

interface DiaryStore {
  // diaryId 임시저장
  diaryId: string;
  setDiaryId: (id: string) => void;

  // diary 1개 임시저장
  diary: AddDiaryType | null;
  setDiary: (newDiary: AddDiaryType | null) => void;
  addDiary: (Diary: AddDiaryType) => void;

  // diary 여러개 임시저장
  diaries: AddDiaryType[]; // 다이어리 목록
  setDiaries: (Diaries: AddDiaryType[]) => void;
  fetchDiaries: () => Promise<void>; // 다이어리 목록을 가져오는 함수
}

const useDiaryStore = create<DiaryStore>((set) => ({
  // diaryId 임시저장
  diaryId: '',
  setDiaryId: (id: string) => set({ diaryId: id }),

  // diary 1개 임시저장
  diary: null,
  setDiary: (newDiary) => set({ diary: newDiary }),
  addDiary: (diary: any) => set((state) => ({ diaries: [...state.diaries, diary] })),

  // diary 여러개 임시저장
  diaries: [],
  setDiaries: (diaries: any[]) => set({ diaries }), // 다이어리 목록 설정
  fetchDiaries: async () => {
    // 현재 사용자 정보 가져오기
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (user) {
      // 사용자의 다이어리 목록 가져오기
      const { data: diaries, error } = await supabase
        .from('diaries')
        .select('*')
        .eq('user_id', user.id)
        .order('bookshelf_order', { ascending: true });
      if (error) {
        console.error('다이어리 목록 가져오기 실패:', error);
      } else {
        set({ diaries: diaries || [] });
      }
    }
  }
}));

export default useDiaryStore;
