import { create } from 'zustand';

interface TenMinPlanerStore {
  tenMinPlanerId: string;
  setTenMinPlanerId: (id: string) => void;
}

const useTenMinPlanerStore = create<TenMinPlanerStore>((set) => ({
  tenMinPlanerId: '6a17e2da-0d05-47bb-ad3d-2155da7e43b7',
  setTenMinPlanerId: (id) => set(() => ({ tenMinPlanerId: id }))
}));

export default useTenMinPlanerStore;
