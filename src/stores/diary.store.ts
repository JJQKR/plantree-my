import { create } from 'zustand';
import { supabase } from '@/supabase/client';
import { AddDiaryType, UpdateDiaryType } from '@/api/diaries.api';

interface DiaryStore {
  diaryId: string; // 현재 선택된 다이어리 ID
  diaries: AddDiaryType[]; // 다이어리 목록
  diary: AddDiaryType | null; // 하나의 다이어리
  // pages: Page[];
  setDiaryId: (id: string) => void; // 다이어리 ID 설정 함수
  addDiary: (Diary: AddDiaryType) => void; // 다이어리 추가 함수
  setDiaries: (Diaries: AddDiaryType[]) => void; // 다이어리 목록 설정 함수
  fetchDiaries: () => Promise<void>; // 다이어리 목록을 가져오는 함수
  setDiary: (newDiary: AddDiaryType) => void;
}

const useDiaryStore = create<DiaryStore>((set) => ({
  diaryId: '',
  diaries: [],
  diary: null,
  setDiaryId: (id: string) => set({ diaryId: id }), // 다이어리 ID 설정
  addDiary: (diary: any) => set((state) => ({ diaries: [...state.diaries, diary] })), // 다이어리 목록에 추가
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
  },
  setDiary: (newDiary) => set({ diary: newDiary })
}));

export default useDiaryStore;
