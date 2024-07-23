'use client';

import React from 'react';
import SideButton from '../atoms/SideButton';
import { MainHeaderProps } from '@/types/main';
import SortButton from '../atoms/SortButton';

const Header: React.FC<MainHeaderProps> = ({ toggleSidebar }) => {
  const handleSort = () => {
    // 정렬 로직을 여기에 추가합니다
    console.log('Sort button clicked');
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <SideButton onClick={toggleSidebar}>Menu</SideButton>
      <div className="flex-grow flex justify-center">
        <h1 className="text-2xl font-bold">Logo</h1>
      </div>
      <SortButton onClick={handleSort}>Sort</SortButton>
    </header>
  );
};

export default Header;
