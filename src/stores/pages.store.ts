import { create } from 'zustand';
import { AddPageType, UpdatePageType } from '@/api/pages.api';

interface PageStore {
  temporaryPages: AddPageType[];
  addPage: (newPage: AddPageType) => void;
  removePage: (id: string) => void;
  setPages: (newPages: AddPageType[]) => void;
}

const usePageStore = create<PageStore>((set) => ({
  temporaryPages: [],
  addPage: (newPage) =>
    set((state) => ({
      temporaryPages: [...state.temporaryPages, newPage]
    })),
  removePage: (id: string) =>
    set((state) => ({
      temporaryPages: state.temporaryPages.filter((page) => page.content_id !== id)
    })),
  setPages: (newPages) =>
    set((state) => ({
      temporaryPages: newPages
    }))
}));

export default usePageStore;
