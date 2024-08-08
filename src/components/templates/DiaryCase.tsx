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
import useDiaryStore from '@/stores/diary.store';
import Swal from 'sweetalert2';
import { useCreateDiary } from '@/lib/hooks/useDiaries';
import useUserStore from '@/stores/user.store';
import uuid from 'react-uuid';
import { supabase } from '@/supabase/client';
import { AddDiaryType } from '@/types/main';
import Image from 'next/image';
import { getCoversByUserId } from '@/services/diarycover.service';

const DiaryCase: React.FC = () => {
  const { userId, setUserId } = useUserStore((state) => state);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // 로그인 상태
  const { gridView } = useStore(); // 그리드 뷰 상태
  const router = useRouter(); // Next.js 라우터
  const setDiaryId = useDiaryStore((state) => state.setDiaryId); // 다이어리 ID 설정 함수
  const [diaryCovers, setDiaryCovers] = useState<any[]>([]); // 다이어리 커버 상태

  // 다이어리 생성 함수 훅
  const { mutate: createDiary } = useCreateDiary();

  // 세션을 통해 사용자 ID를 가져오는 비동기 함수
  const fetchSession = async () => {
    const {
      data: { session }
    } = await supabase.auth.getSession(); // Supabase에서 세션 가져오기
    return session?.user?.id || null; // 사용자 ID 반환
  };

  // 사용자 ID를 설정하고 다이어리 커버 데이터를 가져오는 함수
  const getUserIdAndFetchCovers = async () => {
    const id = await fetchSession();
    if (!id) {
      setIsLoggedIn(false); // 로그인되지 않은 경우 상태 설정
      return;
    }
    setUserId(id); // 사용자 ID 설정
    const covers = await getCoversByUserId(id); // 사용자 ID를 이용하여 다이어리 커버 가져오기
    setDiaryCovers(covers);
  };

  // 컴포넌트가 마운트될 때 사용자 ID를 설정하는 useEffect
  useEffect(() => {
    getUserIdAndFetchCovers();
  }, []);

  // 다이어리를 생성하는 함수
  const handleCreateDiary = async () => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: 'error',
        title: '로그인 필요',
        text: '로그인 상태가 아닙니다. 로그인 후 다시 시도해 주세요.'
      }).then(() => {
        router.push('/'); // 로그인 페이지로 리다이렉트
      });
      return;
    }
    const diaryId = uuid(); // 새로운 다이어리 ID 생성
    const coverTitle = '기본 커버 제목'; // 기본 커버 제목
    const coverImage = null; // 기본 커버 이미지 URL (없을 경우 null)

    // 새로운 다이어리 객체 생성
    const newDiary: AddDiaryType = {
      id: diaryId,
      user_id: userId,
      name: coverTitle,
      bookshelf_order: 0,
      cover_image: coverImage // 추가된 커버 이미지 필드
    };

    createDiary(newDiary, {
      onSuccess: () => {
        setDiaryId(diaryId); // 생성된 다이어리 ID 설정
        router.push(`/member/diary/${diaryId}/cover`); // 새 다이어리 페이지로 리다이렉트
      }
    });
  };

  // 다이어리 클릭 핸들러
  const handleDiaryClick = (id: string) => {
    setDiaryId(id); // 선택된 다이어리 ID 설정
    router.push(`/member/diary/${id}/parchment`); // 해당 다이어리 페이지로 리다이렉트
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
            {diaryCovers && diaryCovers.length > 0 ? (
              diaryCovers.map(
                (cover) =>
                  cover.diary_id && ( // 다이어리 ID가 존재하는 경우
                    <div
                      key={cover.diary_id}
                      className="flex flex-col items-center justify-center cursor-pointer"
                      onClick={() => handleDiaryClick(cover.diary_id as string)} // 타입 단언 사용
                    >
                      <div className="relative flex flex-col items-center justify-center w-[250px] h-[400px] rounded shadow-md text-2xl font-bold text-white">
                        {/* 배경 색상 */}
                        <div
                          className="relative flex flex-col items-center justify-center w-full h-full rounded"
                          style={{ backgroundColor: cover.cover_bg_color || 'bg-white' }} // 기본 배경 색상
                        >
                          <span className="absolute top-10 left-1/2 transform -translate-x-1/2 text-center text-black">
                            {cover.cover_title || '제목 없음'}
                          </span>
                          {/* 이미지 */}
                          {cover.cover_image && (
                            <div className="absolute w-full flex items-center justify-center">
                              <Image
                                src={cover.cover_image}
                                alt={cover.cover_title || 'Cover Image'}
                                width={150} // 이미지 너비
                                height={150} // 이미지 높이
                                className="object-cover rounded"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
              )
            ) : (
              <div className="flex items-center justify-center w-[250px] h-[400px] bg-white rounded shadow-md text-2xl font-bold text-black">
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
            {diaryCovers && diaryCovers.length > 0 ? (
              diaryCovers.map(
                (cover) =>
                  cover.diary_id && ( // 다이어리 ID가 존재하는 경우
                    <SwiperSlide
                      key={cover.diary_id}
                      onClick={() => handleDiaryClick(cover.diary_id as string)}
                      className="relative cursor-pointer flex flex-col items-center justify-center w-[480px] h-[720px] rounded shadow-md text-2xl font-bold text-black"
                      style={{ backgroundColor: cover.cover_bg_color || 'bg-white' }}
                    >
                      {/* 배경 색상 */}
                      <div className="relative flex flex-col items-center justify-center w-full h-full rounded">
                        <span className="absolute top-10 left-1/2 transform -translate-x-1/2 text-center">
                          {cover.cover_title || '제목 없음'}
                        </span>
                        {/* 이미지 */}
                        {cover.cover_image && (
                          <div className="absolute w-full flex items-center justify-center">
                            <Image
                              src={cover.cover_image}
                              alt={cover.cover_title || 'Cover Image'}
                              width={250} // 이미지 너비
                              height={250} // 이미지 높이
                              className="object-cover rounded"
                            />
                          </div>
                        )}
                      </div>
                    </SwiperSlide>
                  )
              )
            ) : (
              <SwiperSlide className="relative flex flex-col items-center justify-center w-[480px] h-[720px] bg-white rounded shadow-md text-2xl font-bold text-black">
                <button onClick={handleCreateDiary} className="flex items-center justify-center w-full h-full">
                  +<br /> 다이어리 생성
                </button>
              </SwiperSlide>
            )}
          </Swiper>
        )}
      </div>
      <div className="fixed bottom-16 right-16">
        <CreateDiaryButton onClick={handleCreateDiary} /> {/* 다이어리 생성 버튼 */}
      </div>
    </div>
  );
};

export default DiaryCase;
