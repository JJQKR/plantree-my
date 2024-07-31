'use client';

import { MainSidebarProps } from '@/types/main';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DiAptana } from 'react-icons/di';
import useUserStore from '@/stores/user.store';
import AttendanceCheck from '@/lib/utils/AttendanceCheck';
import FetchUserData from '@/lib/utils/FetchUserData';
import ProfileStages from './ProfileStages';
import useDiaryStore from '@/stores/diary.store';
import { supabase } from '@/supabase/client';

const Sidebar: React.FC<MainSidebarProps> = ({ onClose }) => {
  const [nickname, setNickname] = useState<string | null>(null); // 사용자 닉네임 상태
  const { levelName, attendance } = useUserStore((state) => state); // 사용자 레벨과 출석 상태 가져오기
  const { diaries, fetchDiaries } = useDiaryStore((state) => ({
    diaries: state.diaries,
    fetchDiaries: state.fetchDiaries
  }));

  const [levelId, setLevelId] = useState<string | null>(null); // 사용자 레벨 ID 상태

  // 컴포넌트가 마운트되었을 때 실행되는 useEffect
  useEffect(() => {
    const fetchData = async () => {
      // 현재 사용자 정보 가져오기
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (user) {
        // 사용자 닉네임 및 레벨 ID 가져오기
        const { data: nicknameData, error: nicknameError } = await supabase
          .from('users')
          .select('nickname, level_id')
          .eq('id', user.id)
          .single();

        if (nicknameError) {
          console.error('닉네임 가져오기 실패:', nicknameError);
        } else {
          setNickname(nicknameData.nickname);
          setLevelId(nicknameData.level_id);
        }

        // 다이어리 목록 가져오기
        await fetchDiaries();
      } else {
        setNickname('Guest'); // 로그인하지 않은 경우 기본 닉네임 설정
      }
    };

    fetchData();
  }, [fetchDiaries]);

  return (
    <div className="w-[320px] h-auto bg-gray-700 text-white flex-shrink-0">
      <FetchUserData />
      <AttendanceCheck />
      <div className="p-4">
        <button onClick={onClose} className="mb-4 text-[20px]">
          Close
        </button>
        <nav>
          <ul className="flex flex-col items-center justify-center space-y-4">
            <li className="w-[240px] h-[300px] bg-black rounded-[20px] mb-4 flex flex-col items-center justify-center relative">
              <Link href="/member/mypage">
                <DiAptana size={30} className="text-white absolute top-3 right-3" />
              </Link>
              <div className="flex flex-col items-center mb-10">
                <ProfileStages levelId={levelId} size={120} />
                <span className="text-white text-lg font-bold">{nickname}</span>
                <div className="text-white text-sm">{levelName || 'Level not set'}</div>
                <div className="text-white text-sm">출석 횟수: {attendance}</div>
                <div className="text-white text-sm">열심히 나무를 키워보세요!</div>
              </div>
            </li>
            <div className="w-full bg-gray-800 p-4 rounded-lg">
              <p className="text-lg font-bold mb-2 text-center">리스트</p>
              <ul className="list-none space-y-2 text-center">
                {diaries.length > 0 ? (
                  diaries.map((diary) => (
                    <li key={diary.id} className="bg-gray-600 p-2 rounded-lg shadow-md">
                      {diary.name}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400 text-center">다이어리가 없습니다.</li>
                )}
              </ul>
            </div>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
