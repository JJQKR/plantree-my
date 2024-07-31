import { create } from 'zustand';

type BottomSheetState = {
  bottomSheetList: { id: string; title: string; content: string }[];
  isSheetOpen: boolean;
  toggleSheet: () => void;
  setBottomSheetList: (newList: { id: string; title: string; content: string }[]) => void;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
};

const useBottomSheetStore = create<BottomSheetState>((set) => ({
  bottomSheetList: [
    { id: '1', title: '임시 데이터 1', content: '임시 데이터 내용 1' },
    { id: '2', title: '임시 데이터 2', content: '임시 데이터 여기에 이미지 들어옴?2' },
    { id: '3', title: '임시 데이터 3', content: '미리보기로 조그맣게? 3' },
    { id: '4', title: '임시 데이터 4', content: '모름 어떻게 들어올지4' },
    { id: '5', title: '임시 데이터 5', content: '객채냐 배열이냐5' }
  ],
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
    })
}));

export default useBottomSheetStore;
