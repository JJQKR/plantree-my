import { create } from 'zustand';

interface EditModeStore {
  // 수정모드 on/off
  isEditMode: boolean;
  onEditMode: () => void;
  offEditMode: () => void;
}

const useEditModeStore = create<EditModeStore>((set) => ({
  // 수정모드 on/off
  isEditMode: false,
  onEditMode: () => set((state) => ({ isEditMode: true })),
  offEditMode: () => set((state) => ({ isEditMode: false }))
}));

export default useEditModeStore;
