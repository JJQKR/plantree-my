import { create } from 'zustand';

interface DiaryStore {
  diaryId: string;
  diaries: any[]; // 다이어리 목록 상태 추가
  setDiaryId: (id: string) => void;
  addDiary: (diary: any) => void; // 다이어리 추가 메서드
  setDiaries: (diaries: any[]) => void; // 다이어리 목록 설정 메서드
}

const useDiaryStore = create<DiaryStore>((set) => ({
  diaryId: '',
  diaries: [],
  setDiaryId: (id: string) => set({ diaryId: id }),
  addDiary: (diary: any) => set((state) => ({ diaries: [...state.diaries, diary] })),
  setDiaries: (diaries: any[]) => set({ diaries })
}));

export default useDiaryStore;
