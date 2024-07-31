import { create } from 'zustand';

type BottomSheetState = {
  bottomSheetList: { id: string; title: string; content: string }[];
  isSheetOpen: boolean;
  toggleSheet: () => void;
  setBottomSheetList: (newList: { id: string; title: string; content: string }[]) => void;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  addPageToBottomSheet: (id: string, title: string, content: string) => void;
};

const useBottomSheetStore = create<BottomSheetState>((set) => ({
  bottomSheetList: [],
  isSheetOpen: false,
  toggleSheet: () => set((state) => ({ isSheetOpen: !state.isSheetOpen })),
  setBottomSheetList: (newList) => set({ bottomSheetList: newList }),
  moveCard: (dragIndex, hoverIndex) =>
    set((state) => {
      const newItems = [...state.bottomSheetList];
      const draggedItem = newItems[dragIndex];
      newItems.splice(dragIndex, 1);
      newItems.splice(hoverIndex, 0, draggedItem);
      return { bottomSheetList: newItems };
    }),
  addPageToBottomSheet: (id, title, content) =>
    set((state) => ({
      bottomSheetList: [...state.bottomSheetList, { id, title, content }]
    }))
}));

export default useBottomSheetStore;
