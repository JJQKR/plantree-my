'use client';

import React, { useState } from 'react';
import { useStore } from '@/stores/sidebar.store';
import DiaryCase from '@/components/templates/DiaryCase';

const HomePage = () => {
  const { sidebarOpen } = useStore(); // 사이드바의 열림 상태를 가져옵니다.
  const [isSorted, setIsSorted] = useState(false); // 카드 정렬 상태를 관리하는 상태

  // 카드 정렬 상태를 토글하는 함수
  const handleSort = () => {
    setIsSorted(!isSorted);
  };

  return (
    <div
      className={`bg-gray-400 ${
        sidebarOpen ? 'w-[764px]' : 'w-full'
      } h-[930px] flex items-center justify-center transition-all duration-300`} // 사이드바 상태에 따라 너비 조정
    >
      <DiaryCase sidebarOpen={sidebarOpen} handleSort={handleSort} isSorted={isSorted} />
    </div>
  );
};

export default HomePage;
