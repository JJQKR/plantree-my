'use client';

import { useStore } from '@/stores/sidebar.store';
import React, { useState } from 'react';
import Sidebar from '../molecules/Sidebar';
import Link from 'next/link';
import Image from 'next/image';
import SideButton from '../atoms/SideButton';
import { FaInfoCircle } from 'react-icons/fa';
import useInfoModalStore from '@/stores/info.madal.store';
import InfoModal from '../molecules/InfoModal';

const MyPageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sidebarOpen, toggleSidebar } = useStore(); // 상태와 상태 변경 함수 가져오기
  const { toggleInfoModal } = useInfoModalStore((state) => state);

  const showInfo = () => {
    toggleInfoModal();
  };

  const [sideView, setSideView] = useState(false); // 상태 관리

  const handleSideButtonClick = () => {
    setSideView(!sideView); // 상태 토글
    toggleSidebar(); // 사이드바 토글
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed flex justify-between items-center w-full h-[8rem] sm:h-[5rem] p-4 sm:p-1 bg-white shadow-md z-30">
        <SideButton onClick={handleSideButtonClick} sideView={sideView}>
          Menu
        </SideButton>
        <div className="flex-grow flex justify-center items-center text-center">
          <Link href="/member/hub">
            <div className="flex justify-center items-center sm:w-[10rem] sm:h-[0.8rem] w-[25rem] h-[2rem]">
              <Image src="/images/Plantree.png" alt="Logo" width={250} height={20} />
            </div>
          </Link>
        </div>
        <div onClick={showInfo} className="text-[4rem] sm:text-[2.4rem] text-[#008A02]">
          <FaInfoCircle className="text-[4rem] sm:text-[2.4rem] text-[#008A02]" />
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
        {sidebarOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10" onClick={toggleSidebar} />
        )}
        <InfoModal />
      </div>
    </div>
  );
};

export default MyPageLayout;
