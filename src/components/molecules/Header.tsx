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
    <header className="fixed flex justify-between items-center w-full h-[8rem] p-4 bg-white shadow-lg z-50">
      <SideButton onClick={toggleSidebar}>Menu</SideButton>
      <div className="flex-grow flex justify-center">
        <Link href="/member/hub">
          <Image
            src="/images/Plantree.png"
            alt="Logo"
            width={250} // 너비를 rem으로 변환
            height={20} // 높이를 rem으로 변환
          />
        </Link>
      </div>
      <GridToggleButton onClick={toggleGrid} gridView={gridView} />
    </header>
  );
};

export default Header;
