import { create } from 'zustand';

interface ColorStore {
  color: string;
  saveColor: (newColor: any) => void;
}

const useColorStore = create<ColorStore>((set) => ({
  color: '',
  saveColor: (newColor) => set({ color: newColor })
}));

export default useColorStore;
