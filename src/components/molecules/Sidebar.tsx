'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BsPersonFillGear } from 'react-icons/bs';
import { FaHome } from 'react-icons/fa';
import useUserStore from '@/stores/user.store';
import AttendanceCheck from '@/lib/utils/AttendanceCheck';
import FetchUserData from '@/lib/utils/FetchUserData';
import ProfileStages from './ProfileStages';
import { supabase } from '@/supabase/client';
import { DiaryCover } from '@/types/main';
import Image from 'next/image';
import FetchMembershipDays from '@/lib/utils/FetchMembershipDays';
import Swal from 'sweetalert2';
import { FaWalking } from 'react-icons/fa';

const Sidebar: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { nickname, levelName, membershipDays, attendance, userId, setLevelId, updatedLevelId } = useUserStore(
    (state) => state
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [diaryCovers, setDiaryCovers] = useState<DiaryCover[]>([]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('로그아웃 실패:', error);
    } else {
      setIsLoggedIn(false);
      Swal.fire({
        title: '로그아웃 성공!',
        text: '또 볼 수 있으면 좋겠어요!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        window.location.href = '/';
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('id, level_id')
          .eq('id', userId)
          .single();

        if (!userError && user) {
          setLevelId(user.level_id);

          const { data: coversData, error: coversError } = await supabase
            .from('diary_covers')
            .select('*')
            .eq('user_id', user.id);

          if (coversError) {
            console.error('다이어리 커버 정보 가져오기 실패:', coversError);
          } else {
            coversData.sort(
              (a, b) => new Date((a as any).created_at).getTime() - new Date((b as any).created_at).getTime()
            );
            setDiaryCovers(coversData);
          }
        }
      }
    };

    fetchData();
  }, [userId, setLevelId]);

  return (
    <>
      <FetchUserData />
      <AttendanceCheck />
      <FetchMembershipDays />

      <div className="fixed top-[8rem] left-0 w-[32rem] h-[99.2rem] sm:w-[24rem] sm:h-[87.2rem] bg-[#E6F3E6] text-white z-50">
        <div className="pl-[4rem] pr-[4rem] sm:pl-[2rem] sm:pr-[2rem]">
          <h2 className="mt-[4rem] text-[#727272] text-[1.6rem] sm-text-[1.4rem] font-semibold">내 정보</h2>
          <nav>
            <ul className="flex flex-col items-center justify-center">
              <li className="w-[24rem] h-[21.8rem] sm:w-[20rem] sm:h-[20.6rem] mt-[1.2rem] sm:mt-[0.8rem] bg-white rounded-[1.6rem] flex flex-col items-center justify-center relative">
                <div className="flex flex-col items-center">
                  {updatedLevelId ? (
                    <div className="relative w-[12rem] h-[12rem] sm:w-[9.8rem] sm:h-[9.8rem]">
                      <ProfileStages /> {/* updatedLevelId 상태를 사용 */}
                    </div>
                  ) : (
                    <div className="relative w-[12rem] h-[12rem] sm:w-[9.8rem] sm:h-[9.8rem]">
                      <Image
                        src="/images/levelNotSet.png"
                        alt="garden1"
                        fill
                        style={{ objectFit: 'contain' }}
                        className="rounded-full w-[12rem] h-[12rem] sm:w-[9.8rem] sm:h-[9.8rem]"
                      />
                    </div>
                  )}
                  <div className="mt-[0.8rem]">
                    <span className="text-[#008A02] text-[1.8rem] sm:text-[1.6rem] font-semibold">
                      {levelName || 'Level not set'}
                    </span>
                    <span className="text-black text-[1.8rem] sm:text-[1.6rem] font-semibold ml-[0.8rem]">
                      {nickname}
                    </span>
                  </div>
                  <div className="text-[#727272] text-[1.5rem] sm:text-[1.3rem] sm:mt-[0.8rem] font-normal flex flex-col items-center">
                    <div>플랜트리와 함께한 지 {membershipDays}일😄</div>
                    <div>같이 기억나무를 키워보아요🪴</div>
                  </div>
                </div>
              </li>
            </ul>
          </nav>
        </div>

        <Link href="/">
          <div className="ml-[4rem] sm:ml-[2rem] w-[24rem] h-[5.2rem] sm:w-[20rem] sm:h-[4.8rem] mt-[1.2rem] sm:mt-[0.8rem] rounded-[1.2rem] bg-white flex flex-row items-center">
            <p className="w-[2.4rem] h-[2.4rem] text-[2.4rem] sm:w-[2rem] sm:h-[2rem] sm:text-[2rem] text-[#008A02] flex items-center ml-[2rem] sm:ml-[1.6rem]">
              <FaHome />
            </p>
            <p className="flex-grow text-[1.6rem] sm:text-[1.4rem] font-semibold text-[#008A02] text-center">홈</p>
          </div>
        </Link>

        <Link href="/member/mypage">
          <div className="ml-[4rem] sm:ml-[2rem] w-[24rem] h-[5.2rem] sm:w-[20rem] sm:h-[4.8rem] mt-[1.2rem] sm:mt-[0.8rem] rounded-[1.2rem] bg-white flex flex-row items-center">
            <p className="w-[2.4rem] h-[2.4rem] text-[2.4rem] sm:w-[2rem] sm:h-[2rem] sm:text-[2rem] text-[#008A02] flex items-center ml-[2rem] sm:ml-[1.6rem]">
              <BsPersonFillGear />
            </p>
            <p className="flex-grow text-[1.6rem] sm:text-[1.4rem] font-semibold text-[#008A02] text-center">
              마이 페이지
            </p>
          </div>
        </Link>

        <button onClick={handleLogout}>
          <div className="ml-[4rem] sm:ml-[2rem] w-[24rem] h-[5.2rem] sm:w-[20rem] sm:h-[4.8rem] mt-[1.2rem] sm:mt-[0.8rem] rounded-[1.2rem] bg-white flex flex-row items-center">
            <p className="w-[2.4rem] h-[2.4rem] text-[2.4rem] sm:w-[2rem] sm:h-[2rem] sm:text-[2rem] text-[#008A02] flex items-center ml-[2rem] sm:ml-[1.6rem]">
              <FaWalking />
            </p>
            <p className="flex-grow text-[1.6rem] sm:text-[1.4rem] font-semibold text-[#008A02] text-center">
              로그아웃
            </p>
          </div>
        </button>

        <div className="pl-[4rem] pr-[4rem] sm:pl-[2rem] sm:pr-[2rem]">
          <div>
            <h2 className="mt-[3.2rem] sm:mt-[2.4rem] text-[#727272] text-[1.6rem] sm-text-[1.4rem] font-semibold">
              내 다이어리
            </h2>
          </div>
          <div className="">
            <ul className="list-none space-y-2 flex-col">
              {diaryCovers.length > 0 ? (
                diaryCovers.map((cover) => (
                  <li key={cover.id}>
                    <Link
                      href={`/member/diary/${cover.diary_id}/parchment`}
                      className="pl-[2rem] w-[24rem] h-[5.2rem] sm:w-[2rem] sm:h-[4.8rem] text-[1.5rem] sm:text-[1.4rem] flex items-center mt-[1.2rem] sm:mt-[0.8rem] rounded-[1.2rem] text-black"
                      style={{
                        backgroundColor: cover.cover_bg_color || 'bg-white',
                        backgroundImage: cover.cover_bg_color ? `url(${cover.cover_bg_color})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        color: cover.cover_title_color || 'black',
                        fontFamily: cover.cover_title_fontfamily || 'inherit',
                        fontWeight: cover.cover_title_fontweight || 'normal'
                      }}
                    >
                      {cover.cover_title || '제목 없음'}
                    </Link>
                  </li>
                ))
              ) : (
                <div className="w-[24rem] h-[5.2rem] sm:w-[20rem] sm:h-[4.8rem] mt-[1.2rem] sm:mt-[0.8rem] rounded-[1.2rem] border-[#9E9E9E] border-2 flex flex-row items-center justify-center">
                  <li className="text-[1.5rem] sm:text-[1.4rem] text-[#9E9E9E] text-center rounded-[1.2rem]">
                    생성된 다이어리가 없습니다.
                  </li>
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
