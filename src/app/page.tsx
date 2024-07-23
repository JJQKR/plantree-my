'use client';

import React from 'react';
import { useStore } from '@/stores/sidebar.store';
import DiaryCase from '@/components/templates/DiaryCase';

const HomePage = () => {
  const { sidebarOpen } = useStore(); // 사이드바 열림 상태를 가져옵니다.

  return (
    <div
      className={`bg-gray-400 ${
        sidebarOpen ? 'w-[764px]' : 'w-full'
      } h-[930px] flex items-center justify-center transition-all duration-300`} // 사이드바 상태에 따라 넓이가 달라집니다.
    >
      <DiaryCase sidebarOpen={sidebarOpen} />
    </div>
  );
};

export default HomePage;
