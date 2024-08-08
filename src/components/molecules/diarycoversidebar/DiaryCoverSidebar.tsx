import React from 'react';

type DiaryCoverSidebar = {
  onSelectMenu: (menu: string) => void;
};

const DiaryCoverSidebar: React.FC<DiaryCoverSidebar> = ({ onSelectMenu }) => {
  return (
    <div className="w-32 h-full bg-gray-700 text-white flex flex-col p-4">
      <div className="cursor-pointer p-2 hover:bg-gray-600" onClick={() => onSelectMenu('Templates')}>
        템플릿
      </div>
      <div className="cursor-pointer p-2 hover:bg-gray-600" onClick={() => onSelectMenu('Text')}>
        텍스트
      </div>
      <div className="cursor-pointer p-2 hover:bg-gray-600" onClick={() => onSelectMenu('Photos')}>
        사진
      </div>
      <div className="cursor-pointer p-2 hover:bg-gray-600" onClick={() => onSelectMenu('Elements')}>
        요소
      </div>
      <div className="cursor-pointer p-2 hover:bg-gray-600" onClick={() => onSelectMenu('Upload')}>
        업로드
      </div>
      <div className="cursor-pointer p-2 hover:bg-gray-600" onClick={() => onSelectMenu('Background')}>
        배경
      </div>
      <div className="cursor-pointer p-2 hover:bg-gray-600" onClick={() => onSelectMenu('Layers')}>
        레이어
      </div>
      <div className="cursor-pointer p-2 hover:bg-gray-600" onClick={() => onSelectMenu('Resize')}>
        크기 조정
      </div>
    </div>
  );
};

export default DiaryCoverSidebar;
