import { create } from 'zustand';

interface DiaryStore {
  diaryId: string;
  setDiaryId: (id: string) => void;
}

const useDiaryStore = create<DiaryStore>((set) => ({
  diaryId: 'ff4f3ee6-9612-4949-8f3c-14dc134097b1',
  setDiaryId: (id: string) => set({ diaryId: id })
}));

export default useDiaryStore;
