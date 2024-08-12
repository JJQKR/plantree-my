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
  coverTitleFontFamily: string; // 글꼴 상태 추가
  setCoverTitleFontFamily: (fontFamily: string) => void; // 글꼴 설정 함수 추가
  coverTitleFontStyle: string; // 폰트 스타일 상태 추가
  setCoverTitleFontStyle: (style: string) => void; // 폰트 스타일 설정 함수 추가
  coverTitleColor: string; // 텍스트 색상 상태 추가
  setCoverTitleColor: (color: string) => void; // 텍스트 색상 설정 함수 추가
  isUnderlined: boolean; // 밑줄 상태 추가
  setIsUnderlined: (isUnderlined: boolean) => void; // 밑줄 설정 함수 추가
  isStrikethrough: boolean; // 취소선 상태 추가
  setIsStrikethrough: (isStrikethrough: boolean) => void; // 취소선 설정 함수 추가
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
  resetTextProperties: () => void; // 텍스트 속성을 초기화하는 함수 추가
  availableFontWeights: number[];
  setAvailableFontWeights: (weights: number[]) => void;
  coverTitleFontWeight: number; // 추가: 현재 선택된 글씨 두께 상태
  setCoverTitleFontWeight: (weight: number) => void; // 추가: 글씨 두께 설정 함수

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
  coverTitle: null,
  setCoverTitle: (title) => set({ coverTitle: title }),
  coverTitlePosition: { x: 120, y: 150 },
  setCoverTitlePosition: (position) => set({ coverTitlePosition: position }),
  coverTitleFontSize: 30,
  setCoverTitleFontSize: (size) => set({ coverTitleFontSize: size }),
  coverTitleWidth: 260,
  setCoverTitleWidth: (width) => set({ coverTitleWidth: width }),
  coverTitleRotation: 0,
  setCoverTitleRotation: (rotation) => set({ coverTitleRotation: rotation }),
  coverTitleFontFamily: 'Arial',
  setCoverTitleFontFamily: (fontFamily) => set({ coverTitleFontFamily: fontFamily }),
  coverTitleFontStyle: 'normal',
  setCoverTitleFontStyle: (style) => set({ coverTitleFontStyle: style }),
  coverTitleColor: '#000000',
  setCoverTitleColor: (color) => set({ coverTitleColor: color }),
  isUnderlined: false,
  setIsUnderlined: (isUnderlined) => set({ isUnderlined }),
  isStrikethrough: false,
  setIsStrikethrough: (isStrikethrough) => set({ isStrikethrough }),
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
  availableFontWeights: [400], // 초기 상태 설정
  setAvailableFontWeights: (weights) => set({ availableFontWeights: weights }),
  coverTitleFontWeight: 400, // 초기 두께 설정
  setCoverTitleFontWeight: (weight) => set({ coverTitleFontWeight: weight }),

  // 리셋 텍스트
  resetTextProperties: () =>
    set({
      coverTitle: null,
      coverTitlePosition: { x: 120, y: 150 },
      coverTitleFontSize: 30,
      coverTitleWidth: 260,
      coverTitleRotation: 0,
      coverTitleFontFamily: 'Arial',
      coverTitleFontStyle: 'normal',
      coverTitleColor: '#000000',
      coverTitleFontWeight: 400,
      isUnderlined: false,
      isStrikethrough: false
    }),

  // 언스플레쉬
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
