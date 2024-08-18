import { SideButtonProps } from '@/types/main';
import React from 'react';
import { TiThMenu, TiThMenuOutline } from 'react-icons/ti';

const SideButton: React.FC<SideButtonProps> = ({ onClick, sideView }) => {
  return (
    <button
      onClick={onClick}
      className="p-2 bg-transparent border-none outline-none rounded transition duration-300 flex items-center justify-center"
    >
      {sideView ? (
        <TiThMenu className="text-[4rem] text-[#008a02] sm:text-[3rem] transition-colors duration-300 hover:text-[#006201] " />
      ) : (
        <TiThMenuOutline className="text-[4rem] text-[#008a02] sm:text-[3rem] transition-colors duration-300 hover:text-[#006201]" />
      )}
    </button>
  );
};

export default SideButton;
