import { create } from 'zustand';

interface activeCellsObjet {
  [key: string]: { active: boolean; color: string; todoId: string };
}

interface TimeTableStore {
  activeCells: activeCellsObjet;
  addActiveCell: (cell: activeCellsObjet) => void;
  removeActiveCell: (id: string) => void;
  // updateCell: (id: string, color: string, todoId: string) => void;
}

const useTimetableStore = create<TimeTableStore>((set) => ({
  activeCells: {},
  addActiveCell: (cell) => set((state) => ({ activeCells: { ...state.activeCells, ...cell } })),
  removeActiveCell: (id) =>
    set((state) => {
      const { [id]: _, ...newActiveCells } = state.activeCells;
      return { activeCells: newActiveCells };
    })
  // updateCell: (id, color, todoId) =>
  //   set((state) => ({
  //     activeCells: {
  //       ...state.activeCells,
  //       [id]: { ...state.activeCells[id], color, todoId }
  //     }
  //   }))
}));
export default useTimetableStore;
