'use client';

import React, { useState } from 'react';
import SideButton from '../atoms/SideButton';
import GridToggleButton from '../atoms/GridToggleButton';
import { MainHeaderProps } from '@/types/main';
import { useStore } from '@/stores/sidebar.store';
import Link from 'next/link';
import Image from 'next/image';
import { FaInfoCircle } from 'react-icons/fa';
import useInfoModalStore from '@/stores/info.madal.store';
import InfoModal from './InfoModal';

const Header: React.FC<MainHeaderProps> = ({ toggleSidebar, toggleGrid }) => {
  const [sideView, setSideView] = useState(false); // 상태 관리

  const handleSideButtonClick = () => {
    setSideView(!sideView); // 상태 토글
    toggleSidebar(); // 사이드바 토글
  };

  const { gridView } = useStore();
  const { toggleInfoModal } = useInfoModalStore((state) => state);

  const showInfo = () => {
    toggleInfoModal();
  };

  return (
    <div>
      <header className="fixed flex justify-between items-center w-full h-[8rem] sm:h-[5rem] p-4 bg-white shadow-md z-50">
        <SideButton onClick={handleSideButtonClick} sideView={sideView}>
          Menu
        </SideButton>
        <div className="flex-grow flex justify-center">
          <Link href="/member/hub">
            <Image
              src="/images/Plantree.png"
              alt="Logo"
              width={250} // 너비를 rem으로 변환
              height={20} // 높이를 rem으로 변환
              className="sm:w-[15rem] sm:w-[10rem]"
            />
          </Link>
        </div>
        <GridToggleButton onClick={toggleGrid} gridView={gridView} />
        <div onClick={showInfo} className="text-[4rem] sm:text-[2.4rem] text-[#008A02] ">
          <FaInfoCircle />
        </div>
      </header>
      <InfoModal />
    </div>
  );
};

export default Header;
