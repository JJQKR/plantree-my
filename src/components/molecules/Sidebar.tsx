'use client';

import { MainSidebarProps } from '@/types/main';
import React from 'react';
import { cards } from '../templates/DiaryCase';
import Link from 'next/link';
import { DiAptana } from 'react-icons/di';
import useUserStore from '@/stores/user.store';
import AttendanceCheck from '@/lib/utils/AttendanceCheck';
import FetchUserData from '@/lib/utils/FetchUserData';

const Sidebar: React.FC<MainSidebarProps> = ({ onClose }) => {
  const { nickname, levelName, attendance } = useUserStore((state) => state);

  return (
    <div className="w-[320px] h-[930px] bg-gray-700 text-white flex-shrink-0">
      <FetchUserData />
      <AttendanceCheck />
      <div className="p-4">
        <button onClick={onClose} className="mb-4 text-[20px]">
          Close
        </button>
        <nav>
          <ul className="flex flex-col items-center justify-center">
            <li className="w-[240px] h-[300px] bg-black mb-4 flex justify-end items-start relative">
              <Link href="/member/mypage">
                <DiAptana size={30} className="text-white absolute top-3 right-3" />
              </Link>
              <div className="flex flex-col items-center mb-10">
                <div className="w-[120px] h-[120px] bg-white rounded-full mb-2"></div> {/* 프로필 이미지 영역 */}
                <span className="text-white text-lg font-bold">{nickname || 'Guest'}</span>
                <div className="text-white text-sm">{levelName || 'Level not set'}</div>
                <div className="text-white text-sm">출석 횟수: {attendance}</div>
                <div className="text-white text-sm">열심히 나무를 키워보세요!</div>
              </div>
            </li>
            {cards.map((card) => (
              <li
                key={card.id}
                className="w-[240px] h-[100px] bg-white text-black rounded-[20px] font-bold mb-4 flex items-center justify-center rounded shadow-md"
              >
                <p className="text-center">{card.name}</p>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
