'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DiAptana } from 'react-icons/di';
import useUserStore from '@/stores/user.store';
import AttendanceCheck from '@/lib/utils/AttendanceCheck';
import FetchUserData from '@/lib/utils/FetchUserData';
import ProfileStages from './ProfileStages';
import { supabase } from '@/supabase/client';
import { DiaryCover } from '@/types/main';
import Image from 'next/image';

const Sidebar: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { nickname, levelName, attendance, userId } = useUserStore((state) => state);
  const [diaryCovers, setDiaryCovers] = useState<DiaryCover[]>([]);
  const [levelId, setLevelId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
      setLoading(false);
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="fixed top-40 left-0 w-[20rem] bg-[#E6F3E6] text-white">
      <FetchUserData />
      <AttendanceCheck />
      <div className="p-[2.5rem]">
        {/* <button onClick={onClose} className="mb-4 text-[20px] text-black">
          Close
        </button> */}
        <h1 className="my-[1rem] text-[#727272] text-[1.13rem] font-semibold">내 정보</h1>
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
                <div className="mt-2">
                  <span className="text-[#008A02] text-[1.25rem] font-semibold">{levelName || 'Level not set'}</span>
                  <span className="text-black text-[1.25rem] font-semibold ml-1">{nickname}</span>
                </div>
                <div className="text-[#727272] text-[1rem] flex flex-col items-center">
                  <div>출석 횟수: {attendance}</div>
                  <div>열심히 나무를 키워보세요!</div>
                </div>
              </div>
            </li>
          </ul>
        </nav>
        <div>
          <h1 className="font-semibold mt-[3rem] mb-[1rem] text-[#727272] text-[1.13rem]">내 다이어리</h1>
        </div>
        <div className="">
          <ul className="list-none space-y-2 flex-col">
            {diaryCovers.length > 0 ? (
              diaryCovers.map((cover) => (
                <li
                  key={cover.id}
                  className="pl-2 w-[15rem] h-[3.25rem] text-[1.13rem] font-semibold flex items-center rounded-[10px] text-black"
                  style={{
                    backgroundColor: cover.cover_bg_color || 'bg-white',
                    backgroundImage: cover.cover_bg_color ? `url(${cover.cover_bg_color})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: cover.cover_title_color || 'black', // 텍스트 색깔 적용
                    fontFamily: cover.cover_title_fontfamily || 'inherit', // 폰트 패밀리 적용
                    fontWeight: cover.cover_title_fontweight || 'normal' // 폰트 굵기 적용
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
