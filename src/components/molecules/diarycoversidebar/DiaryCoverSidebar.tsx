import React, { useEffect } from 'react';
import { FaTextHeight, FaImage, FaShapes, FaPalette, FaLayerGroup, FaEdit, FaTrash } from 'react-icons/fa';

type DiaryCoverSidebarProps = {
  handleSelectMenu: (menu: string) => void;
  handleDeleteElement: () => void;
};

const DiaryCoverSidebar: React.FC<DiaryCoverSidebarProps> = ({ handleSelectMenu, handleDeleteElement }) => {
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleSelectMenu(''); // ESC
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [handleSelectMenu]);

  return (
    <div className="w-[7rem] h-full bg-gray-50 text-black border-r-[.1rem] flex flex-col">
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
      <div
        className="cursor-pointer p-4 hover:bg-gray-200 flex flex-col items-center"
        onClick={() => handleSelectMenu('Elements')}
      >
        <FaShapes className="mb-1" />
        <span>요소</span>
      </div>

      <div
        className="cursor-pointer p-4 hover:bg-gray-200 flex flex-col items-center"
        onClick={() => handleSelectMenu('Layers')}
      >
        <FaLayerGroup className="mb-1" />
        <span>레이어</span>
      </div>
      <div className="flex-grow"></div>
      <div
        className="cursor-pointer p-4 hover:bg-gray-200 flex flex-col items-center"
        onClick={() => handleDeleteElement()}
      >
        <FaTrash className="mb-1" />
        <span className="text-[1.2rem] text-center leading-tight">선택요소 삭제</span>
      </div>

      <div
        className="cursor-pointer p-4 hover:bg-gray-200 flex flex-col items-center"
        onClick={() => handleSelectMenu('Edit')}
      >
        <FaEdit className="mb-1" />
        <span>저장</span>
      </div>
    </div>
  );
};

export default DiaryCoverSidebar;
