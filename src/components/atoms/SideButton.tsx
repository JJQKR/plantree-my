import { SideButtonProps } from '@/types/main';
import React from 'react';
import { AiOutlineMenu } from 'react-icons/ai';

const SideButton: React.FC<SideButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-2 bg-transparent border-none outline-none hover:bg-gray-600 rounded transition duration-300"
    >
      <AiOutlineMenu className="text-[4rem] text-green-400 sm:text-[2.5rem]" />
    </button>
  );
};

export default SideButton;
