'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import CreateDiaryButton from '../atoms/CreateDiaryButton';
import { useRouter } from 'next/navigation';
import { useStore } from '@/stores/sidebar.store';
import { supabase } from '@/supabase/client';
import useDiaryStore from '@/stores/diary.store';
import uuid from 'react-uuid';
import Swal from 'sweetalert2';
import { useDiariesToUserId } from '@/lib/hooks/useDiaries';
import useUserStore from '@/stores/user.store';

const DiaryCase: React.FC = () => {
  const { userId, setUserId } = useUserStore((state) => state);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const { gridView } = useStore();
  const router = useRouter();
  const setDiaryId = useDiaryStore((state) => state.setDiaryId);
  const fetchDiaries = useDiaryStore((state) => state.fetchDiaries); // fetchDiaries를 가져옵니다.

  // 현재 세션을 가져와서 userId를 반환하는 함수입니다.
  const fetchSession = async () => {
    const {
      data: { session }
    } = await supabase.auth.getSession();
    return session?.user?.id || null;
  };

  // 컴포넌트가 마운트되면 userId를 가져오는 useEffect입니다.
  useEffect(() => {
    const getUserId = async () => {
      const id = await fetchSession();
      if (!id) {
        setIsLoggedIn(false);
        return;
      }
      setUserId(id);
    };
    getUserId();
  }, []);

  // userId에 따라 다이어리를 가져오는 커스텀 훅입니다.
  const { data: diaries } = useDiariesToUserId(userId);

  // 다이어리 생성 버튼 클릭 시 호출되는 함수입니다.
  const handleCreateDiary = async () => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: 'error',
        title: '로그인 필요',
        text: '로그인 상태가 아닙니다. 로그인 후 다시 시도해 주세요.'
      }).then(() => {
        router.push('/');
      });
      return;
    }
    const diaryId = uuid();
    setDiaryId(diaryId);
    await fetchDiaries(); // 다이어리 목록을 업데이트합니다.
    router.push(`/member/diary/${diaryId}/cover`);
  };

  const handleDiaryClick = (id: string) => {
    setDiaryId(id);
    router.push(`/member/diary/${id}/parchment`);
  };

  return (
    <div>
      <div
        className={`flex-grow flex items-center justify-center transition-all duration-300 ${
          gridView ? 'justify-start mt-8' : 'justify-center'
        }`}
      >
        {gridView ? (
          <div className="grid grid-cols-4 gap-10 max-w-full">
            {diaries && diaries.length > 0 ? (
              diaries.map((diary) => (
                <div
                  key={diary.id}
                  className="flex flex-col items-center justify-center cursor-pointer"
                  onClick={() => handleDiaryClick(diary.id)}
                >
                  <div className="flex items-center justify-center w-[250px] h-[400px] bg-red-300 rounded shadow-md text-2xl font-bold text-black">
                    {diary.name}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center w-[250px] h-[400px] bg-red-300 rounded shadow-md text-2xl font-bold text-black">
                다이어리가 없습니다
              </div>
            )}
          </div>
        ) : (
          <Swiper
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true
            }}
            pagination={{ clickable: true }}
            modules={[EffectCoverflow, Pagination]}
            className="mySwiper"
          >
            {diaries && diaries.length > 0 ? (
              diaries.map((diary) => (
                <SwiperSlide
                  key={diary.id}
                  onClick={() => handleDiaryClick(diary.id)}
                  className="cursor-pointer flex items-center justify-center w-[350px] h-[570px] bg-red-300 rounded shadow-md text-2xl font-bold text-black"
                >
                  <div className="flex items-center justify-center w-full h-full">{diary.name}</div>
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide className="flex items-center justify-center w-[350px] h-[570px] bg-red-300 rounded shadow-md text-2xl font-bold text-black">
                <button onClick={handleCreateDiary} className="flex items-center justify-center w-full h-full">
                  +<br /> 다이어리 생성
                </button>
              </SwiperSlide>
            )}
          </Swiper>
        )}
      </div>
      <div className="absolute bottom-[20px] right-4">
        <CreateDiaryButton onClick={handleCreateDiary} />
      </div>
    </div>
  );
};

export default DiaryCase;
