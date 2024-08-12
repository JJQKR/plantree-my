import React from 'react';
import { FaThLarge, FaTextHeight, FaImage, FaShapes, FaUpload, FaPalette, FaLayerGroup, FaEdit } from 'react-icons/fa';

type DiaryCoverSidebarProps = {
  handleSelectMenu: (menu: string) => void;
};

const DiaryCoverSidebar: React.FC<DiaryCoverSidebarProps> = ({ handleSelectMenu }) => {
  return (
    <div className="w-[6.3rem] h-full bg-gray-50 text-black border-r-[.1rem] flex flex-col">
      {/* <div
        className="cursor-pointer p-4 hover:bg-gray-200 flex flex-col items-center"
        onClick={() => onSelectMenu('Templates')}
      >
        <FaThLarge className="mb-1" />
        <span>템플릿</span>
      </div> */}
      <div
        className="cursor-pointer p-4 hover:bg-gray-200 flex flex-col items-center"
        onClick={() => handleSelectMenu('Text')}
      >
        <FaTextHeight className="mb-1" />
        <span>텍스트</span>
      </div>
      <div
        className="cursor-pointer p-4 hover:bg-gray-200 flex flex-col items-center"
        onClick={() => handleSelectMenu('Photos')}
      >
        <FaImage className="mb-1" />
        <span>사진</span>
      </div>
      <div
        className="cursor-pointer p-4 hover:bg-gray-200 flex flex-col items-center"
        onClick={() => handleSelectMenu('Elements')}
      >
        <FaShapes className="mb-1" />
        <span>요소</span>
      </div>
      {/* <div
        className="cursor-pointer p-4 hover:bg-gray-200 flex flex-col items-center"
        onClick={() => onSelectMenu('Upload')}
      >
        <FaUpload className="mb-1" />
        <span>업로드</span>
      </div> */}
      <div
        className="cursor-pointer p-4 hover:bg-gray-200 flex flex-col items-center"
        onClick={() => handleSelectMenu('Background')}
      >
        <FaPalette className="mb-1" />
        <span>배경</span>
      </div>
      <div
        className="cursor-pointer p-4 hover:bg-gray-200 flex flex-col items-center"
        onClick={() => handleSelectMenu('Layers')}
      >
        <FaLayerGroup className="mb-1" />
        <span>레이어</span>
      </div>
      <div
        className="cursor-pointer p-4 hover:bg-gray-200 flex flex-col items-center"
        onClick={() => handleSelectMenu('Edit')}
      >
        <FaEdit className="mb-1" />
        <span>수정</span>
      </div>
    </div>
  );
};

export default DiaryCoverSidebar;
