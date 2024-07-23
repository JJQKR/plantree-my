export type MainHeaderProps = {
  toggleSidebar: () => void; // 사이드바 토글 함수
};

export type MainSidebarProps = {
  onClose: () => void; // 사이드바 닫기 함수
};

export type SideButtonProps = {
  onClick: () => void; // 클릭 이벤트 핸들러
  children: React.ReactNode; // 버튼 내용
};

export type MainDiaryCaseProps = {
  sidebarOpen: boolean; // 사이드바 열림 상태
};
