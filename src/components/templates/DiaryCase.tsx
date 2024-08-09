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
import useUserStore from '@/stores/user.store';
import uuid from 'react-uuid';
import { supabase } from '@/supabase/client';
import Image from 'next/image';
import { getCoversByUserId } from '@/services/diarycover.service';

// CoverData와 관련된 타입 정의
interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface CoverData {
  cover_title: string;
  cover_title_position: Position;
  cover_title_fontsize: number;
  cover_title_width: number;
  cover_title_rotation: number;
  cover_image: string;
  cover_image_position: Position;
  cover_image_size: Size;
  cover_image_rotation: number;
  cover_bg_color: string;
  cover_scale: number;
  cover_stage_size: Size;
  diary_id?: string; // 다이어리 ID (선택적 속성)
  cover_id: string;
}

const DiaryCase: React.FC = () => {
  const { userId, setUserId } = useUserStore((state) => state);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // 로그인 상태
  const { gridView } = useStore(); // 그리드 뷰 상태
  const router = useRouter(); // Next.js 라우터
  const setDiaryId = useDiaryStore((state) => state.setDiaryId); // 다이어리 ID 설정 함수
  const [diaryCovers, setDiaryCovers] = useState<CoverData[]>([]); // 다이어리 커버 상태

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
    const rawCovers = await getCoversByUserId(id);

    // raw 커버 데이터를 CoverData로 변환
    const covers: CoverData[] = rawCovers.map((cover: any) => ({
      cover_title: cover.cover_title ?? '',
      cover_title_position: JSON.parse(cover.cover_title_position) as Position,
      cover_title_fontsize: cover.cover_title_fontsize ?? 20,
      cover_title_width: cover.cover_title_width ?? 200,
      cover_title_rotation: cover.cover_title_rotation ?? 0,
      cover_image: cover.cover_image ?? '',
      cover_image_position: JSON.parse(cover.cover_image_position) as Position,
      cover_image_size: JSON.parse(cover.cover_image_size) as Size,
      cover_image_rotation: cover.cover_image_rotation ?? 0,
      cover_bg_color: cover.cover_bg_color ?? '#ffffff',
      cover_scale: cover.cover_scale ?? 1,
      cover_stage_size: JSON.parse(cover.cover_stage_size) as Size,
      diary_id: cover.diary_id,
      cover_id: cover.id
    }));

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

    router.push(`/member/diary/${diaryId}/cover`);
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
            {diaryCovers.length > 0 ? (
              diaryCovers.map((cover) =>
                cover.cover_id ? (
                  <div
                    key={cover.cover_id}
                    className="flex flex-col items-center justify-center cursor-pointer"
                    onClick={() => {
                      console.log('cover.diary_id 온클릭', cover.diary_id);
                      handleDiaryClick(cover.diary_id as string);
                    }}
                    style={{
                      transform: `scale(${cover.cover_scale})`,
                      width: cover.cover_stage_size.width,
                      height: cover.cover_stage_size.height
                    }}
                  >
                    <div
                      className="relative flex flex-col items-center justify-center rounded shadow-md text-2xl font-bold text-white overflow-hidden"
                      style={{ backgroundColor: cover.cover_bg_color, width: '100%', height: '100%' }}
                    >
                      <div
                        className="relative flex flex-col items-center justify-center w-full h-full rounded"
                        style={{
                          backgroundColor: cover.cover_bg_color,
                          width: '100%',
                          height: '100%'
                        }}
                      >
                        <span
                          className="absolute text-center text-black"
                          style={{
                            top: cover.cover_title_position.y,
                            left: cover.cover_title_position.x,
                            transform: `translate(5%, -30%) rotate(${cover.cover_title_rotation}deg)`,
                            fontSize: cover.cover_title_fontsize,
                            width: cover.cover_title_width,
                            maxWidth: '100%',
                            maxHeight: '100%',
                            whiteSpace: 'nowrap', // 제목이 한 줄로 나오도록
                            overflow: 'hidden',
                            textOverflow: 'ellipsis' // 제목이 길어지면 생략 부호로 표시
                          }}
                        >
                          {cover.cover_title || '제목 없음'}
                        </span>
                        {cover.cover_image && (
                          <div
                            className="absolute"
                            style={{
                              width: cover.cover_image_size.width,
                              height: cover.cover_image_size.height,
                              top: cover.cover_image_position.y,
                              left: cover.cover_image_position.x,
                              transform: `translate(5%, -30%) rotate(${cover.cover_image_rotation}deg)`,
                              overflow: 'hidden'
                            }}
                          >
                            <Image
                              src={cover.cover_image}
                              alt={cover.cover_title || 'Cover Image'}
                              width={cover.cover_image_size.width}
                              height={cover.cover_image_size.height}
                              className="object-cover rounded"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : null
              )
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
            {diaryCovers.length > 0 ? (
              diaryCovers.map((cover) =>
                cover.cover_id ? (
                  <SwiperSlide
                    key={cover.cover_id}
                    onClick={() => {
                      console.log('cover_idary찐', cover);
                      handleDiaryClick(cover.diary_id as string);
                    }}
                    className="relative cursor-pointer flex flex-col mt-10 items-center justify-center rounded shadow-md text-2xl font-bold text-black"
                    style={{
                      backgroundColor: cover.cover_bg_color,
                      width: cover.cover_stage_size.width * cover.cover_scale,
                      height: cover.cover_stage_size.height * cover.cover_scale
                    }}
                  >
                    <div className="relative w-full h-full">
                      <span
                        className="absolute text-center text-black"
                        style={{
                          top: cover.cover_title_position.y,
                          left: cover.cover_title_position.x,
                          transform: `translate(10%, -40%) rotate(${cover.cover_title_rotation}deg)`,
                          fontSize: cover.cover_title_fontsize,
                          width: cover.cover_title_width
                        }}
                      >
                        {cover.cover_title || '제목 없음'}
                      </span>
                      {cover.cover_image && (
                        <div
                          className="absolute"
                          style={{
                            width: cover.cover_image_size.width,
                            height: cover.cover_image_size.height,
                            top: cover.cover_image_position.y,
                            left: cover.cover_image_position.x,
                            transform: `translate(10%, -40%) rotate(${cover.cover_image_rotation}deg)`
                          }}
                        >
                          <Image
                            src={cover.cover_image}
                            alt={cover.cover_title || 'Cover Image'}
                            width={cover.cover_image_size.width}
                            height={cover.cover_image_size.height}
                            className="object-cover rounded"
                          />
                        </div>
                      )}
                    </div>
                  </SwiperSlide>
                ) : null
              )
            ) : (
              <SwiperSlide className="flex items-center justify-center bg-red-300 rounded shadow-md text-2xl font-bold text-black">
                <button
                  onClick={handleCreateDiary}
                  className="flex flex-col items-center justify-center text-center"
                  style={{ transform: 'translateY(-20%)' }}
                >
                  +<br /> 다이어리 생성
                </button>
              </SwiperSlide>
            )}
          </Swiper>
        )}
      </div>
      <div className="fixed bottom-16 right-16">
        <CreateDiaryButton onClick={handleCreateDiary} />
      </div>
    </div>
  );
};

export default DiaryCase;
