'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DiAptana } from 'react-icons/di';
import useUserStore from '@/stores/user.store';
import AttendanceCheck from '@/lib/utils/AttendanceCheck';
import FetchUserData from '@/lib/utils/FetchUserData';
import ProfileStages from './ProfileStages';
import { supabase } from '@/supabase/client';
import { DiaryCover, MainSidebarProps } from '@/types/main';

const Sidebar: React.FC<MainSidebarProps> = ({ onClose }) => {
  const { nickname, levelName, attendance, userId } = useUserStore((state) => state); // 유저 상태 관리 스토어에서 닉네임 가져오기
  const [diaryCovers, setDiaryCovers] = useState<DiaryCover[]>([]);
  const [levelId, setLevelId] = useState<string | null>(null);

  // 컴포넌트 마운트 시 사용자 정보 및 다이어리 커버를 가져오는 useEffect
  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        // 사용자 레벨 ID 가져오기
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('id, level_id')
          .eq('id', userId)
          .single();
        if (userError) {
          console.error('레벨 ID 가져오기 실패:', userError);
        } else {
          setLevelId(user.level_id);

          // diary_covers 테이블에서 다이어리 커버 정보 가져오기
          const { data: coversData, error: coversError } = await supabase
            .from('diary_covers')
            .select('*')
            .eq('user_id', user.id);

          if (coversError) {
            console.error('다이어리 커버 정보 가져오기 실패:', coversError);
          } else {
            setDiaryCovers(coversData);
          }
        }
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="fixed top-40 left-0 w-[320px] bg-green-200 text-white">
      <FetchUserData />
      <AttendanceCheck />
      <div className="p-4">
        <button onClick={onClose} className="mb-4 text-[20px] text-black">
          Close
        </button>
        <h1 className="ml-8 mb-2 text-black text-[16px]">내 정보</h1>
        <nav>
          <ul className="flex flex-col items-center justify-center space-y-4">
            <li className="w-[240px] h-[300px] bg-white rounded-[20px] mb-4 flex flex-col items-center justify-center relative">
              <Link href="/member/mypage">
                <DiAptana size={30} className="text-black absolute top-3 right-3" />
              </Link>
              <div className="flex flex-col items-center mb-10">
                {levelId ? (
                  <ProfileStages levelId={levelId} size={120} /> // 레벨 ID가 존재할 때만 렌더링
                ) : (
                  <div style={{ width: 120, height: 120 }} className="bg-gray-400 rounded-full mb-2"></div>
                )}
                <span className="text-black text-lg font-bold">{nickname}</span>
                <div className="text-black text-sm">{levelName || 'Level not set'}</div>
                <div className="text-black text-sm">출석 횟수: {attendance}</div>
                <div className="text-black text-sm">열심히 나무를 키워보세요!</div>
              </div>
            </li>
          </ul>
        </nav>
        <div>
          <p className="text-[16px] text-black mb-2">내 다이어리</p>
        </div>
        <div className="w-full bg-white p-4 rounded-[20px]">
          <ul className="list-none space-y-2 text-center">
            {diaryCovers.length > 0 ? (
              diaryCovers.map((cover) => (
                <li
                  key={cover.id}
                  className="h-[50px] p-5 rounded-lg shadow-md text-black"
                  style={{ backgroundColor: cover.cover_bg_color || 'bg-red-300' }} // 배경색 설정
                >
                  {cover.cover_title || '제목 없음'}
                </li>
              ))
            ) : (
              <li className="text-gray-400 text-center">다이어리가 없습니다.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
