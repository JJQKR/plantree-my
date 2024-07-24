import { create } from 'zustand';

type StoreState = {
  sidebarOpen: boolean; // 사이드바가 열려 있는지 여부를 나타내는 상태
  gridView: boolean; // 그리드 뷰가 활성화되어 있는지 여부를 나타내는 상태
  toggleSidebar: () => void; // 사이드바 열림 상태를 토글하는 함수
  toggleGrid: () => void; // 그리드 뷰 상태를 토글하는 함수
};

export const useStore = create<StoreState>((set) => ({
  sidebarOpen: true, // 초기 사이드바 열림 상태를 true로 설정
  gridView: false, // 초기 그리드 뷰 상태를 false로 설정
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })), // 사이드바 열림 상태를 토글하는 함수 정의
  toggleGrid: () => set((state) => ({ gridView: !state.gridView })) // 그리드 뷰 상태를 토글하는 함수 정의
}));
