'use client';

import React, { useState } from 'react';
import { useStore } from '@/stores/sidebar.store';
import DiaryCase from '@/components/templates/DiaryCase';

const HomePage = () => {
  const { sidebarOpen } = useStore();
  const [isSorted, setIsSorted] = useState(false);

  const handleSort = () => {
    setIsSorted(!isSorted);
  };

  return (
    <div
      className={`bg-gray-400 ${
        sidebarOpen ? 'w-[764px]' : 'w-full'
      } h-[930px] flex items-center justify-center transition-all duration-300`}
    >
      <DiaryCase sidebarOpen={sidebarOpen} handleSort={handleSort} isSorted={isSorted} />
    </div>
  );
};

export default HomePage;
