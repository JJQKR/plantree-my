'use client';

import { MainSidebarProps } from '@/types/main';
import React, { useState, useEffect } from 'react';
import { cards } from '../templates/DiaryCase';
import Link from 'next/link';
import { DiAptana } from 'react-icons/di';
import { supabase } from '../../supabase/client';

const Sidebar: React.FC<MainSidebarProps> = ({ onClose }) => {
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    const fetchNickname = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase.from('users').select('nickname').eq('id', user.id).single();
        if (error) {
          console.error('닉네임 가져오기 실패:', error);
        } else {
          setNickname(data.nickname);
        }
      }
    };

    fetchNickname();
  }, []);

  return (
    <div className="w-[260px] h-[930px] bg-gray-700 text-white flex-shrink-0">
      <div className="p-4">
        <button onClick={onClose} className="mb-4">
          Close
        </button>
        <nav>
          <ul className="flex flex-col items-center justify-center">
            <li className="w-[240px] h-[300px] bg-black mb-4 flex justify-end items-start relative">
              <Link href="/mypage">
                <DiAptana size={30} className="text-white mt-3 mr-3" />
              </Link>
              {nickname && <span className="absolute top-3 left-3 text-white text-lg font-bold">{nickname}</span>}
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
