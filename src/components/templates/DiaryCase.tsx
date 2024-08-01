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

const DiaryCase: React.FC = () => {
  const [diaries, setDiaries] = useState<any[]>([]); // 다이어리 목록 상태
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // 로그인 상태
  const { gridView } = useStore(); // gridView 상태 가져오기
  const router = useRouter();
  const setDiaryId = useDiaryStore((state) => state.setDiaryId); // Zustand store에서 다이어리 ID 설정 함수 가져오기

  // 컴포넌트가 마운트되었을 때 실행되는 useEffect
  useEffect(() => {
    const fetchDiaries = async () => {
      // 현재 세션 및 사용자 정보 가져오기
      const {
        data: { session }
      } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) {
        setIsLoggedIn(false); // 로그인하지 않은 경우 로그인 상태 false로 설정
        return;
      }

      // 사용자의 다이어리 목록 가져오기
      const { data, error } = await supabase
        .from('diaries')
        .select('*')
        .eq('user_id', user.id)
        .order('bookshelf_order', { ascending: true });

      if (error) {
        console.error('다이어리 목록 가져오기 실패:', error);
      } else {
        setDiaries(data || []); // 다이어리 목록 상태 업데이트
      }
    };

    fetchDiaries();
  }, []);

  // 다이어리 생성 핸들러
  const handleCreateDiary = () => {
    if (!isLoggedIn) {
      alert('로그인 상태가 아닙니다. 로그인 후 다시 시도해 주세요.');
      return;
    }
    router.push('/member/diarycreate/cover'); // 다이어리 생성 페이지로 리다이렉트
  };

  // 다이어리 클릭 핸들러
  const handleDiaryClick = (id: string) => {
    setDiaryId(id); // Zustand store에 클릭한 다이어리 ID 저장
    router.push(`/member/diaryedit/${id}/diarycover`); // 다이어리 상세 페이지로 리다이렉트
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center">
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
                <div className="flex items-center justify-center w-[250px] h-[400px] bg-gray-200 rounded shadow-md text-center text-2xl font-bold text-gray-600">
                  {diary.name}
                </div>
              </div>
            ))}
            <div className="flex flex-col items-center justify-center">
              <button
                onClick={handleCreateDiary}
                className="flex items-center justify-center w-[250px] h-[400px] bg-gray-200 rounded shadow-md text-center text-2xl font-bold text-gray-600"
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
              <SwiperSlide key={diary.id} onClick={() => handleDiaryClick(diary.id)} className="cursor-pointer">
                <div className="flex items-center justify-center w-[350px] h-[570px] bg-gray-200 rounded shadow-md text-center text-2xl font-bold text-gray-600">
                  {diary.name}
                </div>
              </SwiperSlide>
            ))}
            <SwiperSlide>
              <button
                onClick={handleCreateDiary}
                className="flex items-center justify-center w-[350px] h-[570px] bg-gray-200 rounded shadow-md text-center text-2xl font-bold text-gray-600"
              >
                +<br /> 다이어리 생성
              </button>
            </SwiperSlide>
          </Swiper>
        )}
      </div>
      <div className="absolute bottom-4 right-4">
        <CreateDiaryButton onClick={handleCreateDiary} />
      </div>
    </div>
  );
};

export default DiaryCase;
