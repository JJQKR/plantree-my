export type MainHeaderProps = {
  toggleSidebar: () => void; // 사이드바 토글 함수
  toggleGrid: () => void; // 그리드 뷰 토글 함수
};

export type MainSidebarProps = {
  onClose: () => void; // 사이드바 닫기 함수
};

export type SideButtonProps = {
  onClick: () => void; // 버튼 클릭 함수
  children: React.ReactNode; // 버튼 내부의 텍스트 또는 컴포넌트
};

export type DiaryCard = {
  id: number;
  content: string; // 다이어리 카드의 내용
};

export type CreateDiaryButtonProps = {
  onClick?: () => void; // 클릭 이벤트 핸들러
};
