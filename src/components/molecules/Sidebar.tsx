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
import Image from 'next/image';

// Sidebar에서도 useEffect를 통해 사용자 정보를 가져오지만,
// 이 과정에서 FetchUserData, AttendanceCheck와 같은 다른 컴포넌트도 함께 사용되고 있습니다.
// useEffect가 userId에 의존하여 데이터를 가져오도록 되어 있지만,
// 사용자의 상태가 갱신되는 시점에서 Sidebar의 상태가 즉시 업데이트되지 않을 수 있습니다.
// 이로 인해 한 번 새로고침을 했을 때 상태가 완전히 반영되지 않고,
// 두 번째 새로고침을 해야 최종적으로 변경된 프로필 이미지가 렌더링됩니다.

// Sidebar는 사용자 정보를 가져오는 과정에서 비동기 호출이 여러 번 이루어지거나
// 상태 업데이트가 비효율적으로 처리되어,
// 첫 번째 새로고침 시점에 모든 데이터가 준비되지 않을 수 있습니다.
// 이로 인해 두 번의 새로고침을 해야 모든 상태가 완전히 반영됩니다.

// 해결 방법 제안
// 이 문제를 해결하기 위해 Sidebar 컴포넌트에서 다음과 같은 방법을 고려할 수 있습니다:

// loading 상태 도입: GrowthSummary처럼 Sidebar에서도 loading 상태를 추가하여
// 데이터 로딩이 완료된 후에만 UI가 렌더링되도록 합니다.
// 이를 통해 한 번의 새로고침으로 데이터가 완전히 반영되도록 할 수 있습니다.

// 상태 관리 일관성: Sidebar에서 사용자의 정보를 가져오는 로직을 GrowthSummary와 더 일관되게 처리해,
// 데이터 로딩과 상태 업데이트가 확실하게 이루어지도록 개선합니다.

// 컴포넌트 분리: FetchUserData와 AttendanceCheck와 같은 컴포넌트를 Sidebar 내부에서 분리하여,
// 상태 관리의 복잡성을 줄이고, 필요한 데이터만 정확하게 가져오도록 최적화합니다.

const Sidebar: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { nickname, levelName, attendance, userId } = useUserStore((state) => state);
  const [diaryCovers, setDiaryCovers] = useState<DiaryCover[]>([]);
  const [levelId, setLevelId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('id, level_id')
          .eq('id', userId)
          .single();
        if (userError) {
          console.error('레벨 ID 가져오기 실패:', userError);
        } else {
          setLevelId(user.level_id);

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
    <div className="fixed top-40 left-0 w-[20rem] bg-[#E6F3E6] text-white">
      <FetchUserData />
      <AttendanceCheck />
      <div className="p-[2.5rem]">
        {/* <button onClick={onClose} className="mb-4 text-[20px] text-black">
          Close
        </button> */}
        <h1 className="ml-8 mb-2 text-[#727272] text-[1rem]">내 정보</h1>
        <nav>
          <ul className="flex flex-col items-center justify-center space-y-4">
            <li className="w-[15rem] h-[15.06rem] bg-white rounded-[20px] flex flex-col items-center justify-center relative">
              <Link href="/member/mypage">
                <div className="bg-[#E6F3E6] rounded-full w-[2.25rem] h-[2.25rem] border-white border-2 flex items-center justify-center absolute top-3 right-3">
                  <DiAptana className="text-[#008A02] w-[1.25rem] h-[1.25rem]" />
                </div>
              </Link>
              <div className="flex flex-col items-center">
                {levelId ? (
                  <div className="w-[7.5rem] h-[7.5rem]">
                    <ProfileStages levelId={levelId} />
                  </div> // 레벨 ID가 존재할 때만 렌더링
                ) : (
                  <div style={{ width: '7.5rem', height: '7.5rem' }} className="relative">
                    <Image
                      src="/images/levelNotSet.png"
                      alt="garden1"
                      fill
                      style={{ objectFit: 'contain' }}
                      className="rounded-full w-[7.5rem] h-[7.5rem]"
                    />
                  </div>
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
          <h1 className="ml-8 mb-2 text-[#727272] text-[1rem]">내 다이어리</h1>
        </div>
        <div className="w-full bg-white p-4 rounded-[20px]">
          <ul className="list-none space-y-2 text-center">
            {diaryCovers.length > 0 ? (
              diaryCovers.map((cover) => (
                <li
                  key={cover.id}
                  className="h-[50px] p-5 rounded-lg shadow-md text-black"
                  style={{
                    backgroundColor: cover.cover_bg_color || 'bg-white',
                    backgroundImage: cover.cover_bg_color ? `url(${cover.cover_bg_color})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: cover.unsplash_image ? 'white' : 'black'
                  }}
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
