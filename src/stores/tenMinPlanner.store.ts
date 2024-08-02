import { create } from 'zustand';

interface TenMinPlannerStore {
  tenMinPlannerId: string;
  setTenMinPlannerId: (id: string) => void;
}

const useTenMinPlannerStore = create<TenMinPlannerStore>((set) => ({
  tenMinPlannerId: '',
  setTenMinPlannerId: (id) => set(() => ({ tenMinPlannerId: id }))
}));

export default useTenMinPlannerStore;
