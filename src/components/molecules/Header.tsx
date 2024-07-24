'use client';

import React from 'react';
import SideButton from '../atoms/SideButton';
import { MainHeaderProps } from '@/types/main';

const Header: React.FC<MainHeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <SideButton onClick={toggleSidebar}>Menu</SideButton>
      <div className="flex-grow flex justify-center">
        <h1 className="text-2xl font-bold">Logo</h1>
      </div>
    </header>
  );
};

export default Header;
