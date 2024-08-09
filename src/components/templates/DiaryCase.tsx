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
  diary_id?: string;
  cover_id: string;
}

const DiaryCase: React.FC = () => {
  const { userId, setUserId } = useUserStore((state) => state);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const { gridView } = useStore();
  const router = useRouter();
  const setDiaryId = useDiaryStore((state) => state.setDiaryId);
  const [diaryCovers, setDiaryCovers] = useState<CoverData[]>([]);

  // 현재 사용자 세션을 가져오는 함수
  const fetchSession = async () => {
    const {
      data: { session }
    } = await supabase.auth.getSession();
    return session?.user?.id || null; // 세션이 없다면 null 반환
  };

  // 사용자 ID를 가져오고 해당 사용자에 맞는 커버 데이터를 가져오는 함수
  const getUserIdAndFetchCovers = async () => {
    const id = await fetchSession(); // 세션에서 사용자 ID를 가져옴
    if (!id) {
      // ID가 없으면 로그인 상태를 false로 설정하고 종료
      setIsLoggedIn(false);
      return;
    }
    setUserId(id); // 가져온 사용자 ID를 상태에 설정
    const rawCovers = await getCoversByUserId(id); // 사용자 ID로 커버 데이터를 가져옴

    // 커버 데이터를 CoverData 형식으로 매핑
    const covers: CoverData[] = rawCovers.map((cover: any) => ({
      cover_title: cover.cover_title ?? '', // 커버 타이틀이 없을 경우 빈 문자열로 대체
      cover_title_position: JSON.parse(cover.cover_title_position) as Position, // 위치 데이터는 JSON 파싱
      cover_title_fontsize: cover.cover_title_fontsize ?? 20, // 폰트 크기가 없으면 기본값 20
      cover_title_width: cover.cover_title_width ?? 200, // 타이틀 너비가 없으면 기본값 200
      cover_title_rotation: cover.cover_title_rotation ?? 0, // 회전값이 없으면 기본값 0
      cover_image: cover.cover_image ?? '', // 이미지가 없으면 빈 문자열
      cover_image_position: JSON.parse(cover.cover_image_position) as Position, // 위치 데이터는 JSON 파싱
      cover_image_size: JSON.parse(cover.cover_image_size) as Size, // 사이즈 데이터는 JSON 파싱
      cover_image_rotation: cover.cover_image_rotation ?? 0, // 이미지 회전값이 없으면 기본값 0
      cover_bg_color: cover.cover_bg_color ?? '#ffffff', // 배경 색상이 없으면 기본값 흰색
      cover_scale: cover.cover_scale ?? 1, // 커버 스케일이 없으면 기본값 1
      cover_stage_size: JSON.parse(cover.cover_stage_size) as Size, // 스테이지 사이즈는 JSON 파싱
      diary_id: cover.diary_id,
      cover_id: cover.id
    }));

    setDiaryCovers(covers); // 매핑된 커버 데이터를 상태에 설정
  };

  // 컴포넌트가 처음 렌더링될 때 사용자 ID와 커버 데이터를 가져옴
  useEffect(() => {
    getUserIdAndFetchCovers();
  }, []);

  // 다이어리를 생성하는 함수
  const handleCreateDiary = async () => {
    if (!isLoggedIn) {
      // 로그인 상태가 아니면 알림을 띄우고 홈으로 리다이렉트
      Swal.fire({
        icon: 'error',
        title: '로그인 필요',
        text: '로그인 상태가 아닙니다. 로그인 후 다시 시도해 주세요.'
      }).then(() => {
        router.push('/'); // 로그인 페이지로 이동
      });
      return;
    }
    const diaryId = uuid(); // 새로운 다이어리 ID 생성

    router.push(`/member/diary/${diaryId}/cover`); // 생성된 다이어리의 커버 페이지로 이동
  };

  // 다이어리를 클릭했을 때 실행되는 함수
  const handleDiaryClick = (id: string) => {
    setDiaryId(id); // 클릭한 다이어리의 ID를 상태에 설정
    router.push(`/member/diary/${id}/parchment`); // 다이어리의 페이지로 이동
  };

  return (
    <div>
      <div
        className={`flex-grow flex items-center justify-center transition-all duration-300 ${
          gridView ? 'justify-start mt-8' : 'justify-center'
        }`}
      >
        {gridView ? (
          // 그리드 뷰 모드
          <div className="grid grid-cols-4 gap-10 max-w-full">
            {diaryCovers.length > 0 ? (
              // 다이어리 커버가 존재할 때
              diaryCovers.map((cover) =>
                cover.cover_id ? (
                  <div
                    key={cover.cover_id}
                    className="flex flex-col items-center justify-center cursor-pointer"
                    onClick={() => {
                      handleDiaryClick(cover.diary_id as string);
                    }}
                    style={{
                      transform: `scale(${cover.cover_scale})`,
                      width: cover.cover_stage_size.width,
                      height: cover.cover_stage_size.height
                    }}
                  >
                    <div className="relative flex flex-col items-center justify-center w-[250px] h-[400px] rounded shadow-md text-2xl font-bold text-white overflow-hidden">
                      <div
                        className="relative flex flex-col items-center justify-center w-full h-full rounded"
                        style={{ backgroundColor: cover.cover_bg_color }}
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
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
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
              // 다이어리 커버가 없을 때
              <div className="flex items-center justify-center w-[250px] h-[400px] bg-red-300 rounded shadow-md text-2xl font-bold text-black">
                다이어리가 없습니다
              </div>
            )}
          </div>
        ) : (
          // 스와이프 뷰 모드
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
            style={{ width: '100%', height: '100%' }}
          >
            {diaryCovers.length > 0 ? (
              // 다이어리 커버가 존재할 때
              diaryCovers.map((cover) =>
                cover.cover_id ? (
                  <SwiperSlide
                    key={cover.cover_id}
                    onClick={() => {
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
                          top: cover.cover_title_position.y * cover.cover_scale,
                          left: cover.cover_title_position.x * cover.cover_scale,
                          transform: `translate(10%, -40%) rotate(${cover.cover_title_rotation}deg)`,
                          fontSize: cover.cover_title_fontsize * cover.cover_scale,
                          width: cover.cover_title_width * cover.cover_scale
                        }}
                      >
                        {cover.cover_title || '제목 없음'}
                      </span>
                      {cover.cover_image && (
                        <div
                          className="absolute"
                          style={{
                            width: cover.cover_image_size.width * cover.cover_scale,
                            height: cover.cover_image_size.height * cover.cover_scale,
                            top: cover.cover_image_position.y * cover.cover_scale,
                            left: cover.cover_image_position.x * cover.cover_scale,
                            transform: `translate(10%, -40%) rotate(${cover.cover_image_rotation}deg)`
                          }}
                        >
                          <Image
                            src={cover.cover_image}
                            alt={cover.cover_title || 'Cover Image'}
                            width={cover.cover_image_size.width * cover.cover_scale}
                            height={cover.cover_image_size.height * cover.cover_scale}
                            className="object-cover rounded"
                          />
                        </div>
                      )}
                    </div>
                  </SwiperSlide>
                ) : null
              )
            ) : (
              // 다이어리 커버가 없을 때
              <SwiperSlide className="flex items-center justify-center w-[480px] h-[720px] bg-red-300 rounded shadow-md text-2xl font-bold text-black">
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
      {/* 다이어리 생성 버튼을 화면 오른쪽 하단에 고정 */}
      <div className="fixed bottom-16 right-16">
        <CreateDiaryButton onClick={handleCreateDiary} />
      </div>
    </div>
  );
};

export default DiaryCase;
