'use client';

import React from 'react';
import SideButton from '../atoms/SideButton';
import GridToggleButton from '../atoms/GridToggleButton';
import { MainHeaderProps } from '@/types/main';
import { useStore } from '@/stores/sidebar.store';
import Link from 'next/link';
import Image from 'next/image';

const Header: React.FC<MainHeaderProps> = ({ toggleSidebar, toggleGrid }) => {
  // 상태 가져오기
  const { gridView } = useStore();

  return (
    <header className="flex justify-between items-center p-4 bg-white">
      <SideButton onClick={toggleSidebar}>Menu</SideButton>
      <div className="flex-grow flex justify-center">
        <Link href="/">
          <Image
            src="/images/Plantree.png"
            alt="Logo"
            width={200} // 원하는 너비
            height={50} // 원하는 높이
          />
        </Link>
      </div>
      <GridToggleButton onClick={toggleGrid} gridView={gridView} />
    </header>
  );
};

export default Header;
