import { create } from 'zustand';

type StoreState = {
  sidebarOpen: boolean; // 사이드바 열림 상태
  toggleSidebar: () => void; // 사이드바 토글 함수
};

// 사이드 바 상태관리하기 위해
export const useStore = create<StoreState>((set) => ({
  sidebarOpen: true, // 기본 상태: 사이드바 열림
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })) // 사이드바 열림 상태 토글 함수
}));
