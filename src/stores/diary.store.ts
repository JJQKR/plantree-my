import { create } from 'zustand';
import { supabase } from '@/supabase/client';

interface DiaryStore {
  diaryId: string; // 현재 선택된 다이어리 ID
  diaries: any[]; // 다이어리 목록
  // pages: Page[];
  setDiaryId: (id: string) => void; // 다이어리 ID 설정 함수
  addDiary: (diary: any) => void; // 다이어리 추가 함수
  setDiaries: (diaries: any[]) => void; // 다이어리 목록 설정 함수
  fetchDiaries: () => Promise<void>; // 다이어리 목록을 가져오는 함수
}

const useDiaryStore = create<DiaryStore>((set) => ({
  diaryId: '',
  diaries: [],
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
  }
}));

export default useDiaryStore;
