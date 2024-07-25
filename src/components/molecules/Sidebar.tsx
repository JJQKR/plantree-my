import { MainSidebarProps } from '@/types/main';
import React from 'react';
import { cards } from '../templates/DiaryCase';
import Link from 'next/link';

const Sidebar: React.FC<MainSidebarProps> = ({ onClose }) => {
  return (
    <div className="w-[260px] h-[930px] bg-gray-700 text-white flex-shrink-0">
      <div className="p-4">
        <button onClick={onClose} className="mb-4">
          Close
        </button>
        <nav>
          <ul className="flex flex-col items-center justify-center">
            <li className="w-[240px] h-[300px] bg-black mb-4 ">
              <Link href="/mypage">
                <button>마이 페이지</button>
              </Link>
            </li>
            {cards.map((card) => (
              <li
                key={card.id}
                className="w-[240px] h-[100px] bg-white text-black font-bold mb-4 flex items-center justify-center rounded shadow-md"
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
