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

// type Page = {
//   id: string;
//   url: string;
// };

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
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;

  //언스플레쉬
  unsplashImage: HTMLImageElement | null;
  setUnsplashImage: (image: HTMLImageElement | null) => void;
  unsplashImagePosition: CoverPosition;
  setUnsplashImagePosition: (position: CoverPosition) => void;
  unsplashImageSize: CoverSize;
  setUnsplashImageSize: (size: CoverSize) => void;
  unsplashScale: number;
  setUnsplashScale: (scale: number) => void;
  unsplashImageRotation: number;
  setUnsplashImageRotation: (rotation: number) => void;
};

export const useDiaryCoverStore = create<DiaryCoverState>((set, get) => ({
  coverTitle: '표지 제목 작성',
  setCoverTitle: (title) => set({ coverTitle: title }),
  coverTitlePosition: { x: 140, y: 150 },
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
  coverBackgroundColor: '#ffffff',
  setCoverBackgroundColor: (color) => set({ coverBackgroundColor: color }),
  coverSelectedElement: null,
  setCoverSelectedElement: (element) => set({ coverSelectedElement: element }),
  coverScale: 1,
  setCoverScale: (scale) => set({ coverScale: scale }),
  coverStageSize: { width: 480, height: 720 },
  setCoverStageSize: (size) => set({ coverStageSize: size }),
  tempImageUrl: null,
  setTempImageUrl: (url) => set({ tempImageUrl: url }),
  imageFile: null,
  setImageFile: (file) => set({ imageFile: file }),
  coverData: null,
  setCoverData: (data) => set({ coverData: data }),
  activeSection: null,
  setActiveSection: (section) => set({ activeSection: section }),

  //언스플레쉬
  unsplashImage: null,
  setUnsplashImage: (image) => set({ unsplashImage: image }),
  unsplashImagePosition: { x: 50, y: 60 },
  setUnsplashImagePosition: (position) => set({ unsplashImagePosition: position }),
  unsplashImageSize: { width: 0, height: 0 },
  setUnsplashImageSize: (size) => set({ unsplashImageSize: size }),
  unsplashScale: 1,
  setUnsplashScale: (scale) => set({ unsplashScale: scale }),
  unsplashImageRotation: 0,
  setUnsplashImageRotation: (rotation) => set({ unsplashImageRotation: rotation })
}));
