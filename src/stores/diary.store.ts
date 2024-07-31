import { create } from 'zustand';

interface DiaryStore {
  diaryId: string;
  setDiaryId: (id: string) => void;
}

const useDiaryStore = create<DiaryStore>((set) => ({
  diaryId: '',
  setDiaryId: (id: string) => set({ diaryId: id })
}));

export default useDiaryStore;
