'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DiAptana } from 'react-icons/di';
import useUserStore from '@/stores/user.store';
import AttendanceCheck from '@/lib/utils/AttendanceCheck';
import FetchUserData from '@/lib/utils/FetchUserData';
import ProfileStages from './ProfileStages';
import useDiaryStore from '@/stores/diary.store';
import { supabase } from '@/supabase/client';
import { MainSidebarProps } from '@/types/main';

const Sidebar: React.FC<MainSidebarProps> = ({ onClose }) => {
  const { nickname, levelName, attendance, userId } = useUserStore((state) => state); // 유저 상태 관리 스토어에서 닉네임 가져오기
  const { diaries, fetchDiaries } = useDiaryStore((state) => ({
    diaries: state.diaries,
    fetchDiaries: state.fetchDiaries
  }));

  const [levelId, setLevelId] = useState<string | null>(null); // 사용자 레벨 ID 상태

  // 컴포넌트가 마운트되었을 때 실행되는 useEffect
  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        // 사용자 레벨 ID 가져오기
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('level_id')
          .eq('id', userId)
          .single();
        if (userError) {
          console.error('레벨 ID 가져오기 실패:', userError);
        } else {
          setLevelId(user.level_id);
        }

        // 다이어리 목록 가져오기
        await fetchDiaries();
      }
    };

    fetchData();
  }, [fetchDiaries, userId]);

  return (
    <div className="fixed top-40 left-0 w-[320px] bg-green-200 text-white ">
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
                  <ProfileStages levelId={levelId} size={120} /> // levelId가 존재할 때만 렌더링
                ) : (
                  <div style={{ width: 120, height: 120 }} className="bg-gray-400 rounded-full mb-2"></div>
                )}
                <span className="font-semibold text-sm text-[#008A02]">{levelName || 'Level not set'}</span>
                <span className="text-black text-lg font-bold">{nickname}</span>

                <div className="text-black text-sm">출석 횟수: {attendance}</div>
                <div className="text-black text-sm">levelText</div>
              </div>
            </li>
          </ul>
        </nav>
        <div>
          <p className="text-[16px] text-black mb-2">내 다이어리</p>
        </div>
        <div className="w-full bg-white p-4 rounded-[20px]">
          <ul className="list-none space-y-2 text-center">
            {diaries.length > 0 ? (
              diaries.map((diary) => (
                <li key={diary.id} className="bg-red-300 h-[50px] p-3 rounded-lg shadow-md text-black">
                  {diary.name}
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
