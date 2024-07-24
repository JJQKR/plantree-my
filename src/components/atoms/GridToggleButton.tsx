import { GridToggleButtonProps } from '@/types/main';
import React from 'react';
import { AiFillAppstore } from 'react-icons/ai';

const GridToggleButton: React.FC<GridToggleButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-2 bg-transparent border-none outline-none hover:bg-gray-700 rounded transition duration-300"
    >
      <AiFillAppstore className="text-2xl" />
    </button>
  );
};

export default GridToggleButton;
