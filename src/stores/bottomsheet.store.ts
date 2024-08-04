import { UpdatePageType } from '@/api/pages.api';
import { create } from 'zustand';

type BottomSheetState = {
  bottomSheetList: UpdatePageType[];
  isSheetOpen: boolean;
  toggleSheet: () => void;
  // setBottomSheetList: (newList: UpdatePageType[]) => void;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  addPageToBottomSheet: (newPage: UpdatePageType) => void;
};

const useBottomSheetStore = create<BottomSheetState>((set) => ({
  bottomSheetList: [],
  isSheetOpen: false,
  toggleSheet: () => set((state) => ({ isSheetOpen: !state.isSheetOpen })),
  // setBottomSheetList: (newList) => set({ bottomSheetList: newList }),
  moveCard: (dragIndex, hoverIndex) =>
    set((state) => {
      const newItems = [...state.bottomSheetList];
      const draggedItem = newItems[dragIndex];
      newItems.splice(dragIndex, 1);
      newItems.splice(hoverIndex, 0, draggedItem);
      return { bottomSheetList: newItems };
    }),
  addPageToBottomSheet: (newPage) =>
    set((state) => ({
      bottomSheetList: [...state.bottomSheetList, newPage]
    }))
}));

export default useBottomSheetStore;
