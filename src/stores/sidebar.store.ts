import { create } from 'zustand';

type StoreState = {
  sidebarOpen: boolean; // 사이드바 열림 상태
  toggleSidebar: () => void; // 사이드바 토글 함수
};

// 사이드 바 상태관리하기 위해
export const useStore = create<StoreState>((set) => ({
  sidebarOpen: true, // 초기 상태를 열려 있는 상태로 설정
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })) // 토글 함수 정의
}));
