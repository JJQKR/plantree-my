import { MainDiaryCaseProps } from '@/types/main';
import React from 'react';

const DiaryCase: React.FC<MainDiaryCaseProps> = ({ sidebarOpen }) => {
  return (
    <div
      className={`bg-gray-400 ${
        sidebarOpen ? 'w-[764px]' : 'w-full'
      } h-[930px] flex items-center justify-center transition-all duration-300`} // 사이드바 상태에 따라 넓이가 달라집니다.
    >
      MainDiaryCase
    </div>
  );
};

export default DiaryCase;
