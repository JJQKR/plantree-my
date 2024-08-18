import { SideButtonProps } from '@/types/main';
import React from 'react';
import { TiThMenuOutline } from 'react-icons/ti';

const SideButton: React.FC<SideButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-2 bg-transparent border-none outline-none hover:bg-gray-200 rounded transition duration-300"
    >
      <TiThMenuOutline className="text-[4rem] text-green-400 sm:text-[2.5rem]" />
    </button>
  );
};

export default SideButton;
