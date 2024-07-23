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

// DiaryCard 타입 정의
export type DiaryCard = {
  id: number;
  content: string;
};
