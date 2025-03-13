import React from 'react';
import { FaTextHeight, FaImage, FaPalette, FaEdit, FaTrash } from 'react-icons/fa';

type DiaryCoverSidebarProps = {
  handleSelectMenu: (menu: string) => void;
  handleDeleteElement: () => void;
};

const DiaryCoverSidebar: React.FC<DiaryCoverSidebarProps> = ({ handleSelectMenu, handleDeleteElement }) => {
  return (
    <div className="w-full h-[5.6rem] sm:h-[4rem] bg-[#EDF1E6] text-black border-b-[.1rem] flex flex-row justify-between">
      <div className="flex flex-row justify-between w-full h-full p-[1.08rem] sm:p-[0.5rem]">
        <div className="flex flex-row">
          <div
            className="cursor-pointer pr-[1.8rem] sm:pr-[1rem] flex flex-col items-center justify-between h-full"
            onClick={() => handleSelectMenu('Text')}
          >
            <FaTextHeight className="text-[1.4rem] sm:text-[1rem] text-[#426400]" />
            <span className="text-[1.26rem] sm:text-[0.9rem] font-bold leading-none p-0 m-0 text-[#426400]">
              텍스트
            </span>
          </div>
          <div
            className="cursor-pointer pr-[1.8rem] sm:pr-[1rem] flex flex-col items-center justify-between h-full"
            onClick={() => handleSelectMenu('Background')}
          >
            <FaPalette className="text-[1.4rem] sm:text-[1rem] text-[#426400]" />
            <span className="text-[1.26rem] sm:text-[0.9rem] font-bold leading-none p-0 m-0 text-[#426400]">배경</span>
          </div>
          <div
            className="cursor-pointer flex flex-col items-center justify-between h-full"
            onClick={() => handleSelectMenu('Photos')}
          >
            <FaImage className="text-[1.4rem] sm:text-[1rem] text-[#426400]" />
            <span className="text-[1.26rem] sm:text-[0.9rem] font-bold leading-none p-0 m-0 text-[#426400]">
              이미지
            </span>
          </div>
        </div>
        <div className="flex flex-row">
          <div
            className="cursor-pointer pr-[1.8rem] sm:pr-[1rem] flex flex-col items-center justify-between h-full"
            onClick={() => handleDeleteElement()}
          >
            <FaTrash className="text-[1.4rem] sm:text-[1rem] text-[#426400]" />
            <span className="text-[1.26rem] sm:text-[0.9rem] font-bold leading-none p-0 m-0 text-[#426400]">
              요소삭제
            </span>
          </div>
          <div
            className="cursor-pointer flex flex-col items-center justify-between h-full"
            onClick={() => handleSelectMenu('Edit')}
          >
            <FaEdit className="text-[1.4rem] sm:text-[1rem] text-[#426400]" />
            <span className="text-[1.26rem] sm:text-[0.9rem] font-bold leading-none p-0 m-0 text-[#426400]">저장</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryCoverSidebar;
