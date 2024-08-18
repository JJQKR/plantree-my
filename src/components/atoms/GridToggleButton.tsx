import { GridToggleButtonProps } from '@/types/main';
import React from 'react';
import { TiThLarge, TiThLargeOutline } from 'react-icons/ti';

const GridToggleButton: React.FC<GridToggleButtonProps> = ({ onClick, gridView }) => {
  return (
    <button
      onClick={onClick}
      className="p-2 mr-4 bg-transparent border-none outline-none hover:bg-gray-200 rounded transition duration-300"
    >
      {gridView ? (
        <TiThLarge className="text-[4rem] text-green-400 sm:text-[2.5rem]" /> // gridView가 true일 때 AiFillBook 아이콘 렌더링
      ) : (
        <TiThLargeOutline className="text-[4rem] text-green-400 sm:text-[2.5rem]" /> // gridView가 false일 때 AiFillAppstore 아이콘 렌더링
      )}
    </button>
  );
};

export default GridToggleButton;
