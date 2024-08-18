import { GridToggleButtonProps } from '@/types/main';
import React from 'react';
import { TiThLarge, TiThLargeOutline } from 'react-icons/ti';

const GridToggleButton: React.FC<GridToggleButtonProps> = ({ onClick, gridView }) => {
  return (
    <button
      onClick={onClick}
      className="p-2 mr-4 bg-transparent border-none outline-none rounded transition duration-300 flex items-center justify-center"
    >
      {gridView ? (
        <TiThLarge className="text-[4rem] text-[#008a02] sm:text-[3rem] transition-colors duration-300 hover:text-[#006201]" />
      ) : (
        <TiThLargeOutline className="text-[4rem] text-[#008a02] sm:text-[3rem] transition-colors duration-300 hover:text-[#006201]" />
      )}
    </button>
  );
};

export default GridToggleButton;
