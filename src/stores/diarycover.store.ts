import { create } from 'zustand';
import Konva from 'konva';

type CoverPosition = {
  x: number;
  y: number;
};

type CoverSize = {
  width: number;
  height: number;
};

type Page = {
  id: string;
  url: string;
};

type DiaryCoverState = {
  coverTitle: string | null;
  setCoverTitle: (text: string | null) => void;
  coverTitlePosition: CoverPosition;
  setCoverTitlePosition: (position: CoverPosition) => void;
  coverTitleFontSize: number;
  setCoverTitleFontSize: (size: number) => void;
  coverTitleWidth: number;
  setCoverTitleWidth: (width: number) => void;
  coverTitleRotation: number;
  setCoverTitleRotation: (rotation: number) => void;
  coverImage: HTMLImageElement | null;
  setCoverImage: (image: HTMLImageElement | null) => void;
  coverImagePosition: CoverPosition;
  setCoverImagePosition: (position: CoverPosition) => void;
  coverImageSize: CoverSize;
  setCoverImageSize: (size: CoverSize) => void;
  coverImageRotation: number;
  setCoverImageRotation: (rotation: number) => void;
  coverBackgroundColor: string;
  setCoverBackgroundColor: (color: string) => void;
  coverSelectedElement: Konva.Node | null;
  setCoverSelectedElement: (element: Konva.Node | null) => void;
  coverScale: number;
  setCoverScale: (scale: number) => void;
  coverStageSize: CoverSize;
  setCoverStageSize: (size: CoverSize) => void;
  tempImageUrl: string | null;
  setTempImageUrl: (url: string | null) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  coverData: object | null;
  setCoverData: (data: object | null) => void;
  pages: Page[];
  currentPage: number;
  setCurrentPage: (pageIndex: number) => void;
  showPageOptions: boolean;
  togglePageOptions: () => void;
  addPage: (newPageUrl: string) => number;
  deletePage: (pageId: string) => void;
  setPages: (newPages: Page[]) => void;
};

export const useDiaryCoverStore = create<DiaryCoverState>((set, get) => ({
  coverTitle: '표지 제목 작성',
  setCoverTitle: (title) => set({ coverTitle: title }),
  coverTitlePosition: { x: 150, y: 150 },
  setCoverTitlePosition: (position) => set({ coverTitlePosition: position }),
  coverTitleFontSize: 30,
  setCoverTitleFontSize: (size) => set({ coverTitleFontSize: size }),
  coverTitleWidth: 220,
  setCoverTitleWidth: (width) => set({ coverTitleWidth: width }),
  coverTitleRotation: 0,
  setCoverTitleRotation: (rotation) => set({ coverTitleRotation: rotation }),
  coverImage: null,
  setCoverImage: (image) => set({ coverImage: image }),
  coverImagePosition: { x: 50, y: 50 },
  setCoverImagePosition: (position) => set({ coverImagePosition: position }),
  coverImageSize: { width: 0, height: 0 },
  setCoverImageSize: (size) => set({ coverImageSize: size }),
  coverImageRotation: 0,
  setCoverImageRotation: (rotation) => set({ coverImageRotation: rotation }),
  coverBackgroundColor: '#eeeeee',
  setCoverBackgroundColor: (color) => set({ coverBackgroundColor: color }),
  coverSelectedElement: null,
  setCoverSelectedElement: (element) => set({ coverSelectedElement: element }),
  coverScale: 1,
  setCoverScale: (scale) => set({ coverScale: scale }),
  coverStageSize: { width: 512, height: 800 },
  setCoverStageSize: (size) => set({ coverStageSize: size }),
  tempImageUrl: null,
  setTempImageUrl: (url) => set({ tempImageUrl: url }),
  imageFile: null,
  setImageFile: (file) => set({ imageFile: file }),
  coverData: null,
  setCoverData: (data) => set({ coverData: data }),
  pages: [],
  currentPage: 0,
  setCurrentPage: (pageIndex: number) => set({ currentPage: pageIndex }),
  showPageOptions: false,
  togglePageOptions: () => set((state) => ({ showPageOptions: !state.showPageOptions })),
  addPage: (newPageUrl: string) => {
    const newPage: Page = { id: String(Date.now() + Math.random()), url: newPageUrl };
    set((state) => ({
      pages: [...state.pages, newPage]
    }));
    return get().pages.length - 1;
  },
  deletePage: (pageId: string) => {
    set((state) => ({
      pages: state.pages.filter((page) => page.id !== pageId)
    }));
  },
  setPages: (newPages: Page[]) => set({ pages: newPages })
}));
