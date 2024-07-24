import { GridToggleButtonProps } from '@/types/main';
import React from 'react';
import { AiFillAppstore, AiFillBook } from 'react-icons/ai';

const GridToggleButton: React.FC<GridToggleButtonProps> = ({ onClick, gridView }) => {
  return (
    <button
      onClick={onClick}
      className="p-2 bg-transparent border-none outline-none hover:bg-gray-700 rounded transition duration-300"
    >
      {gridView ? (
        <AiFillBook className="text-2xl" /> // gridView가 true일 때 AiFillBook 아이콘 렌더링
      ) : (
        <AiFillAppstore className="text-2xl" /> // gridView가 false일 때 AiFillAppstore 아이콘 렌더링
      )}
    </button>
  );
};

export default GridToggleButton;
