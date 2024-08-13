'use client';

import { useStore } from '@/stores/sidebar.store';
import React from 'react';
import Sidebar from '../molecules/Sidebar';
import Link from 'next/link';
import Image from 'next/image';
import SideButton from '../atoms/SideButton';

const MyPageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sidebarOpen, toggleSidebar } = useStore(); // 상태와 상태 변경 함수 가져오기

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center h-[8rem] p-4 bg-white">
        <SideButton onClick={toggleSidebar}>Menu</SideButton>
        <div className="flex-grow flex justify-center">
          <Link href="/member/hub">
            <Image
              src="/images/Plantree.png"
              alt="Logo"
              width={250} // 원하는 너비
              height={50} // 원하는 높이
            />
          </Link>
        </div>
      </header>
      <div className="flex flex-grow">
        {sidebarOpen && <Sidebar onClose={toggleSidebar} />}
        <main
          className={`${
            sidebarOpen ? 'w-[192rem]' : 'w-full'
          } h-auto flex items-center justify-center transition-all duration-300 mt-0`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default MyPageLayout;
