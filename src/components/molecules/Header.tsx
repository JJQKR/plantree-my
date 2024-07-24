'use client';

import React from 'react';
import SideButton from '../atoms/SideButton';
import GridToggleButton from '../atoms/GridToggleButton';
import { MainHeaderProps } from '@/types/main';
import { useStore } from '@/stores/sidebar.store'; // 상태 가져오기

const Header: React.FC<MainHeaderProps> = ({ toggleSidebar, toggleGrid }) => {
  const { gridView } = useStore(); // gridView 상태 가져오기

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <SideButton onClick={toggleSidebar}>Menu</SideButton>
      <div className="flex-grow flex justify-center">
        <h1 className="text-2xl font-bold">Logo</h1>
      </div>
      <GridToggleButton onClick={toggleGrid} gridView={gridView} />
    </header>
  );
};

export default Header;
