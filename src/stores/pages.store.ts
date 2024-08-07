import { create } from 'zustand';
import { AddPageType, UpdatePageType } from '@/api/pages.api';

export type PageType = {
  id: string;
  content_id: string;
  parchment_style: string;
  diary_id: string | null;
};

interface PageStore {
  // pageId 임시저장
  pageId: string;
  setPageId: (newPageId: string) => void;

  // page index 임시저장
  pageIndex: number;
  setPageIndex: (newPageIndex: number) => void;

  // page 1개 임시저장
  page: PageType | null;
  setPage: (newPage: PageType) => void;

  // page 여러개 임시저장
  pages: PageType[];
  setPages: (newPages: PageType[]) => void;
  addPage: (newPage: PageType) => void;
  removePage: (id: string) => void;
}

const usePageStore = create<PageStore>((set) => ({
  // pageId 임시저장
  pageId: '',
  setPageId: (newPageId) => set(() => ({ pageId: newPageId })),

  // page index 임시저장
  pageIndex: 0,
  setPageIndex: (newPageIndex) => set(() => ({ pageIndex: newPageIndex })),

  // page 1개 임시저장
  page: null,
  setPage: (newPage) => set(() => ({ page: newPage })),

  // page 여러개 임시저장
  pages: [],
  setPages: (newPages) => set(() => ({ pages: newPages })),
  addPage: (newPage) => set((state) => ({ pages: [...state.pages, newPage] })),
  removePage: (id: string) => set((state) => ({ pages: state.pages.filter((page) => page.id !== id) }))
}));

export default usePageStore;
