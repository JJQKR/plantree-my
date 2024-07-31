import { create } from 'zustand';
import { useDiaryCoverStore } from '@/stores/diarycover.store';

type BottomSheetState = {
  bottomSheetList: { id: string; title: string; content: string }[];
  isSheetOpen: boolean;
  toggleSheet: () => void;
  setBottomSheetList: (newList: { id: string; title: string; content: string }[]) => void;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  addPageToBottomSheet: (id: string, title: string, content: string) => void;
  deletePageFromBottomSheet: (id: string) => void;
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
    })),
  deletePageFromBottomSheet: (id) => {
    const deletePage = useDiaryCoverStore.getState().deletePage;
    deletePage(id); // delete page from the cover store as well
    set((state) => ({
      bottomSheetList: state.bottomSheetList.filter((page) => page.id !== id)
    }));
  }
}));

export default useBottomSheetStore;
