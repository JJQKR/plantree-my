import { create } from 'zustand';

interface TenMinPlanerStore {
  tenMinPlanerId: string;
  setTenMinPlanerId: (id: string) => void;
}

const useTenMinPlanerStore = create<TenMinPlanerStore>((set) => ({
  tenMinPlanerId: '4557f456-6cb5-4de4-af4d-34135d6a0f6f',
  setTenMinPlanerId: (id) => set(() => ({ tenMinPlanerId: id }))
}));

export default useTenMinPlanerStore;
