import { create } from 'zustand';

export interface ActiveCellsObject {
  [key: string]: { active: boolean; color: string; todoId: string };
}

interface TimeTableStore {
  activeCells: ActiveCellsObject;
  addActiveCell: (cell: ActiveCellsObject) => void;
  removeActiveCell: (id: string) => void;
  setActiveCells: (cells: ActiveCellsObject) => void;
  // updateCell: (id: string, color: string, todoId: string) => void;
}

const useTimetableStore = create<TimeTableStore>((set) => ({
  activeCells: {},
  addActiveCell: (cell) => set((state) => ({ activeCells: { ...state.activeCells, ...cell } })),
  removeActiveCell: (id) =>
    set((state) => {
      const { [id]: _, ...newActiveCells } = state.activeCells;
      return { activeCells: newActiveCells };
    }),
  setActiveCells: (cells: ActiveCellsObject) => set(() => ({ activeCells: cells }))

  // updateCell: (id, color, todoId) =>
  //   set((state) => ({
  //     activeCells: {
  //       ...state.activeCells,
  //       [id]: { ...state.activeCells[id], color, todoId }
  //     }
  //   }))
}));
export default useTimetableStore;
