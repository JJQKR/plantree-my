import { SideButtonProps } from '@/types/main';
import React from 'react';

const SortButton: React.FC<SideButtonProps> = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition duration-300"
    >
      {children}
    </button>
  );
};

export default SortButton;
