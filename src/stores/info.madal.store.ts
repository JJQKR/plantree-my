import { create } from 'zustand';

interface InfoModalStore {
  // parchment 옵션 고르기 모달
  isInfoModalOpen: boolean;
  toggleInfoModal: () => void;
}

const useInfoModalStore = create<InfoModalStore>((set) => ({
  // info 모달
  isInfoModalOpen: false,
  toggleInfoModal: () => set((state) => ({ isInfoModalOpen: !state.isInfoModalOpen }))
}));

export default useInfoModalStore;
