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

const DiaryCase: React.FC = () => {
  const [diaries, setDiaries] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const { gridView } = useStore();
  const router = useRouter();
  const setDiaryId = useDiaryStore((state) => state.setDiaryId);

  useEffect(() => {
    const fetchDiaries = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) {
        setIsLoggedIn(false);
        return;
      }

      const { data, error } = await supabase
        .from('diaries')
        .select('*')
        .eq('user_id', user.id)
        .order('bookshelf_order', { ascending: true });

      if (error) {
        console.error('다이어리 목록 가져오기 실패:', error);
      } else {
        setDiaries(data || []);
      }
    };

    fetchDiaries();
  }, []);

  const handleCreateDiary = () => {
    if (!isLoggedIn) {
      alert('로그인 상태가 아닙니다. 로그인 후 다시 시도해 주세요.');
      return;
    }
    const diaryId = uuid();
    setDiaryId(diaryId);
    router.push(`/member/diary/${diaryId}/cover`); // 다이어리 생성 페이지로 리다이렉트
  };

  const handleDiaryClick = (id: string) => {
    setDiaryId(id); // Zustand store에 클릭한 다이어리 ID 저장
    router.push(`/member/diary/${id}/cover`); // 다이어리 상세 페이지로 리다이렉트
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
            {diaries.map((diary) => (
              <div
                key={diary.id}
                className="flex flex-col items-center justify-center cursor-pointer"
                onClick={() => handleDiaryClick(diary.id)}
              >
                <div className="flex items-center justify-center w-[250px] h-[400px] bg-red-300 rounded shadow-md text-2xl font-bold text-black">
                  {diary.name}
                </div>
              </div>
            ))}
            <div className="flex flex-col items-center justify-center">
              <button
                onClick={handleCreateDiary}
                className="flex items-center justify-center w-[250px] h-[400px] bg-red-300 rounded shadow-md text-2xl font-bold text-black"
              >
                +<br /> 다이어리 생성
              </button>
            </div>
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
            {diaries.map((diary) => (
              <SwiperSlide
                key={diary.id}
                onClick={() => handleDiaryClick(diary.id)}
                className="cursor-pointer flex items-center justify-center w-[350px] h-[570px] bg-red-300 rounded shadow-md text-2xl font-bold text-black"
              >
                <div className="flex items-center justify-center w-full h-full">{diary.name}</div>
              </SwiperSlide>
            ))}
            <SwiperSlide className="flex items-center justify-center w-[350px] h-[570px] bg-red-300 rounded shadow-md text-2xl font-bold text-black">
              <button onClick={handleCreateDiary} className="flex items-center justify-center w-full h-full">
                +<br /> 다이어리 생성
              </button>
            </SwiperSlide>
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
