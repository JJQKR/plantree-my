import { create } from 'zustand';
import { UpdatePageType } from '@/api/pages.api';

interface PageStore {
  pages: UpdatePageType[];
  addPage: (newPage: UpdatePageType) => void;
  removePage: (id: string) => void;
  setPages: (newPages: UpdatePageType[]) => void;
}

const usePageStore = create<PageStore>((set) => ({
  pages: [],
  addPage: (newPage) =>
    set((state) => ({
      pages: [...state.pages, newPage]
    })),
  removePage: (id: string) =>
    set((state) => ({
      pages: state.pages.filter((page) => page.content_id !== id)
    })),
  setPages: (newPages) =>
    set((state) => ({
      pages: newPages
    }))
}));

export default usePageStore;
