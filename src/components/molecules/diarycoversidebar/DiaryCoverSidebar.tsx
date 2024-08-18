import React from 'react';
import { FaTextHeight, FaImage, FaPalette, FaEdit, FaTrash } from 'react-icons/fa';

type DiaryCoverSidebarProps = {
  handleSelectMenu: (menu: string) => void;
  handleDeleteElement: () => void;
};

const DiaryCoverSidebar: React.FC<DiaryCoverSidebarProps> = ({ handleSelectMenu, handleDeleteElement }) => {
  return (
    <div className="w-full h-[5rem] bg-gray-50 text-black border-b-[.1rem] flex flex-row justify-between">
      <div className="flex flex-row space-x-4">
        <div
          className="cursor-pointer p-4 hover:bg-gray-200 flex flex-col items-center"
          onClick={() => handleSelectMenu('Text')}
        >
          <FaTextHeight className="mb-1" />
          <span>텍스트</span>
        </div>
        <div
          className="cursor-pointer p-4 hover:bg-gray-200 flex flex-col items-center"
          onClick={() => handleSelectMenu('Background')}
        >
          <FaPalette className="mb-1" />
          <span>배경</span>
        </div>
        <div
          className="cursor-pointer p-4 hover:bg-gray-200 flex flex-col items-center"
          onClick={() => handleSelectMenu('Photos')}
        >
          <FaImage className="mb-1" />
          <span>이미지</span>
        </div>
      </div>
      <div className="flex flex-row space-x-4">
        <div
          className="cursor-pointer p-4 hover:bg-gray-200 flex flex-col items-center"
          onClick={() => handleDeleteElement()}
        >
          <FaTrash className="mb-1" />
          <span className="text-[1.2rem] text-center leading-tight">요소 삭제</span>
        </div>
        <div
          className="cursor-pointer p-4 hover:bg-gray-200 flex flex-col items-center"
          onClick={() => handleSelectMenu('Edit')}
        >
          <FaEdit className="mb-1" />
          <span>저장</span>
        </div>
      </div>
    </div>
  );
};

export default DiaryCoverSidebar;
