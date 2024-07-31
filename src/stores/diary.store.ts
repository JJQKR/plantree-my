import { create } from 'zustand';
import { supabase } from '@/supabase/client';

interface DiaryStore {
  diaryId: string;
  diaries: any[];
  setDiaryId: (id: string) => void;
  addDiary: (diary: any) => void;
  setDiaries: (diaries: any[]) => void;
  fetchDiaries: () => Promise<void>; // 다이어리 목록을 가져오는 함수 추가
}

const useDiaryStore = create<DiaryStore>((set) => ({
  diaryId: '',
  diaries: [],
  setDiaryId: (id: string) => set({ diaryId: id }),
  addDiary: (diary: any) => set((state) => ({ diaries: [...state.diaries, diary] })),
  setDiaries: (diaries: any[]) => set({ diaries }),
  fetchDiaries: async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (user) {
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
