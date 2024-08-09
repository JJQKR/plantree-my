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
  id: string; // UUID 또는 고유 식별자
  content: string; // 다이어리 카드의 내용
  name: string; // 다이어리 카드의 이름
  created_at: string; // 다이어리 생성 날짜 및 시간 (ISO 8601 형식 문자열)
  user_id: string; // 다이어리를 생성한 사용자 ID
  bookshelf_order?: number; // 책장에 있는 순서 (옵션)
};

export type CreateDiaryButtonProps = {
  onClick?: () => void; // 클릭 이벤트 핸들러
};

export type GridToggleButtonProps = {
  onClick: () => void; // 클릭 이벤트 핸들러
  gridView: boolean; // 그리드 뷰 상태
};

export type AddDiaryType = {
  id: string;
  user_id: string;
  name: string;
  bookshelf_order: number;
};

export type DiaryCover = {
  id: string;
  cover_bg_color: string | null;
  cover_image: string | null;
  cover_image_position: any | null; // JSON 타입으로 변경 가능
  cover_image_rotation: number | null;
  cover_image_size: any | null; // JSON 타입으로 변경 가능
  cover_scale: number | null;
  cover_title: string | null;
};
