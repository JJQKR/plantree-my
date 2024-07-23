export type MainHeaderProps = {
  toggleSidebar: () => void;
  handleSort: () => void;
};

export type MainSidebarProps = {
  onClose: () => void;
};

export type SideButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
};

export type MainDiaryCaseProps = {
  sidebarOpen: boolean;
  handleSort?: () => void;
  isSorted?: boolean;
};
