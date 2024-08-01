import { create } from 'zustand';

interface TenMinplannerStore {
  tenMinplannerId: string;
  setTenMinplannerId: (id: string) => void;
}

const useTenMinplannerStore = create<TenMinplannerStore>((set) => ({
  tenMinplannerId: '4557f456-6cb5-4de4-af4d-34135d6a0f6f',
  setTenMinplannerId: (id) => set(() => ({ tenMinplannerId: id }))
}));

export default useTenMinplannerStore;
