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
  const { nickname, levelName, attendance, userId, setLevelId, updatedLevelId } = useUserStore((state) => state);
  const [diaryCovers, setDiaryCovers] = useState<DiaryCover[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('id, level_id')
          .eq('id', userId)
          .single();

        if (!userError && user) {
          setLevelId(user.level_id); // zustand로 전역 상태 관리하도록 변경

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
  }, [userId, setLevelId]);

  return (
    <div className="fixed top-40 left-0 w-[32rem] h-[99.2rem] bg-[#E6F3E6] text-white">
      <FetchUserData />
      <AttendanceCheck />
      <div className="pl-[6rem] pr-[2rem]">
        <h1 className="mt-[12rem] text-[#727272] text-[1.8rem] font-semibold">내 정보</h1>
        <nav>
          <ul className="flex flex-col items-center justify-center">
            <li className="w-[24rem] h-[24.1rem] mt-[1rem] bg-white rounded-[1.6rem] flex flex-col items-center justify-center relative">
              <Link href="/member/mypage">
                <div className="bg-[#E6F3E6] rounded-full w-[3.6rem] h-[3.6rem] border-white border-[0.2rem] flex items-center justify-center absolute top-3 right-3">
                  <DiAptana className="text-[#008A02] w-[2em] h-[2rem]" />
                </div>
              </Link>
              <div className="flex flex-col items-center">
                {updatedLevelId ? (
                  <div className="w-[12rem] h-[12rem]">
                    <ProfileStages size={120} /> {/* updatedLevelId 상태를 사용 */}
                  </div>
                ) : (
                  <div style={{ width: '12rem', height: '12rem' }} className="relative">
                    <Image
                      src="/images/levelNotSet.png"
                      alt="garden1"
                      fill
                      style={{ objectFit: 'contain' }}
                      className="rounded-full w-[12rem] h-[12rem]"
                    />
                  </div>
                )}
                <div className="mt-[0.8rem]">
                  <span className="text-[#008A02] text-[2rem] font-semibold">{levelName || 'Level not set'}</span>
                  <span className="text-black text-[2rem] font-semibold ml-[0.787rem]">{nickname}</span>
                </div>
                <div className="text-[#727272] text-[1.6rem] flex flex-col items-center">
                  <div>출석 횟수: {attendance}</div>
                  <div>열심히 나무를 키워보세요!</div>
                </div>
              </div>
            </li>
          </ul>
        </nav>
        <div>
          <h1 className="font-semibold mt-[3.2rem] mb-[1.3rem] text-[#727272] text-[1.8rem]">내 다이어리</h1>
        </div>
        <div className="">
          <ul className="list-none space-y-2 flex-col">
            {diaryCovers.length > 0 ? (
              diaryCovers.map((cover) => (
                <li
                  key={cover.id}
                  className="pl-[2rem] w-[24rem] h-[5.2rem] text-[1.8rem] font-semibold flex items-center rounded-[1.2rem] text-black"
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
