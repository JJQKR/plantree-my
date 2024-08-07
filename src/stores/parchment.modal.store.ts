import { create } from 'zustand';

interface ParchmentModalStore {
  // parchment 옵션 고르기 모달
  isParchmentOptionModalOpen: boolean;
  toggleParchmentOptionModal: () => void;
  // 10분 플래너 색고르기 모달
  isTenMinplannerColorModalOpen: boolean;
  toggleTenMinplannerColorModal: () => void;
}

const useParchmentModalStore = create<ParchmentModalStore>((set) => ({
  // parchment 옵션 고르기 모달
  isParchmentOptionModalOpen: false,
  toggleParchmentOptionModal: () => set((state) => ({ isParchmentOptionModalOpen: !state.isParchmentOptionModalOpen })),
  // 10분 플래너 색고르기 모달
  isTenMinplannerColorModalOpen: false,
  toggleTenMinplannerColorModal: () =>
    set((state) => ({ isTenMinplannerColorModalOpen: !state.isTenMinplannerColorModalOpen }))
}));

export default useParchmentModalStore;
