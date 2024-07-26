import { create } from 'zustand';

//인자 set은 전역상태로 관리할 state들을 제어하는 내장 기능

interface MyModalStore {
  isBadgeModalOpen: boolean;
  isNicknameModalOpen: boolean;
  isWithdrawalModalOpen: boolean;
  isTenMinPlanerColorModalOpen: boolean;
  toggleBadgeModal: () => void;
  toggleNicknameModal: () => void;
  toggleWithdrawalModal: () => void;
  toggleTenMinPlanerColorModal: () => void;
}

const useMyModalStore = create<MyModalStore>((set) => ({
  isBadgeModalOpen: false,
  isNicknameModalOpen: false,
  isWithdrawalModalOpen: false,
  isTenMinPlanerColorModalOpen: false,
  toggleBadgeModal: () => set((state) => ({ isBadgeModalOpen: !state.isBadgeModalOpen })),
  toggleNicknameModal: () => set((state) => ({ isNicknameModalOpen: !state.isNicknameModalOpen })),
  toggleWithdrawalModal: () => set((state) => ({ isWithdrawalModalOpen: !state.isWithdrawalModalOpen })),
  toggleTenMinPlanerColorModal: () =>
    set((state) => ({ isTenMinPlanerColorModalOpen: !state.isTenMinPlanerColorModalOpen }))
}));

export default useMyModalStore;
