// 헤더 컴포넌트에 전달되는 props 타입
export type MainHeaderProps = {
  toggleSidebar: () => void;
};

// 사이드바 컴포넌트에 전달되는 props 타입
export type MainSidebarProps = {
  onClose: () => void;
};

// 사이드 버튼 컴포넌트에 전달되는 props 타입
export type SideButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
};

// DiaryCase 템플릿 컴포넌트에 전달되는 props 타입
export type MainDiaryCaseProps = {
  sidebarOpen: boolean;
  handleSort: () => void;
  isSorted: boolean;
};
