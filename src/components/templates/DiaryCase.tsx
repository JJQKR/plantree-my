'use client';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Stage, Layer, Rect, Text, Image as KonvaImage } from 'react-konva';
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
import { getCoversByUserId } from '@/services/diarycover.service';
import { CoverData, Position, Size } from '@/types/main';

const DiaryCase: React.FC = () => {
  const { userId, setUserId } = useUserStore((state) => state); // 사용자 상태를 관리하는 훅
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // 로그인 상태를 관리하는 상태
  const { gridView } = useStore(); // 그리드 뷰 상태를 관리하는 훅
  const router = useRouter(); // 라우터 훅을 사용하여 페이지 이동

  const setDiaryId = useDiaryStore((state) => state.setDiaryId); // 다이어리 ID를 설정하는 훅

  // 다이어리 커버와 이미지 상태를 관리
  const [diaryCovers, setDiaryCovers] = useState<CoverData[]>([]);
  const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([]);
  const [loadedBackgroundImages, setLoadedBackgroundImages] = useState<HTMLImageElement[]>([]);
  const [unsplashImages, setUnsplashImages] = useState<HTMLImageElement[]>([]);

  // Supabase에서 세션 정보를 가져오는 함수
  const fetchSession = async () => {
    const {
      data: { session }
    } = await supabase.auth.getSession();
    return session?.user?.id || null;
  };

  // 사용자 ID를 가져오고 커버 데이터를 가져오는 함수
  const getUserIdAndFetchCovers = async () => {
    const id = await fetchSession(); // 사용자 ID 가져오기
    if (!id) {
      setIsLoggedIn(false); // 로그인 상태가 아니면 로그인 필요 표시
      return;
    }
    setUserId(id); // 사용자 ID 설정
    const rawCovers = await getCoversByUserId(id); // 커버 데이터 가져오기

    // 커버 데이터 가공
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
      unsplash_image: cover.unsplash_image ?? '',
      unsplash_image_position: JSON.parse(cover.unsplash_image_position) as Position,
      unsplash_image_size: JSON.parse(cover.unsplash_image_size) as Size,
      unsplash_image_rotation: cover.unsplash_image_rotation ?? 0,
      diary_id: cover.diary_id,
      cover_id: cover.id
    }));

    setDiaryCovers(covers); // 커버 상태 업데이트
    preloadImages(covers); // 이미지 미리 로드
  };

  // 이미지 미리 로드 함수
  const preloadImages = (covers: CoverData[]) => {
    const images: HTMLImageElement[] = covers.map((cover) => {
      const img = new Image();
      img.src = cover.cover_image; // 커버 이미지
      return img;
    });

    const backgroundImages: HTMLImageElement[] = covers.map((cover) => {
      if (cover.cover_bg_color.startsWith('http')) {
        const img = new Image();
        img.src = cover.cover_bg_color; // 배경 이미지
        return img;
      }
      return new Image(); // 빈 이미지 객체 반환
    });

    const unsplashImgs: HTMLImageElement[] = covers.map((cover) => {
      if (cover.unsplash_image) {
        const img = new Image();
        img.src = cover.unsplash_image; // Unsplash 이미지
        return img;
      }
      return new Image(); // 빈 이미지 객체 반환
    });

    setLoadedImages(images); // 이미지 상태 업데이트
    setLoadedBackgroundImages(backgroundImages); // 배경 이미지 상태 업데이트
    setUnsplashImages(unsplashImgs); // Unsplash 이미지 상태 업데이트
  };

  // 컴포넌트가 처음 렌더링될 때 사용자 ID와 커버 데이터를 가져오는 함수 호출
  useEffect(() => {
    getUserIdAndFetchCovers();
  }, []);

  // 다이어리 생성 버튼 클릭 핸들러
  const handleCreateDiary = async () => {
    if (!isLoggedIn) {
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
    router.push(`/member/diary/${diaryId}/cover`); // 새로운 다이어리 생성 페이지로 이동
  };

  // 다이어리 클릭 핸들러
  const handleDiaryClick = (id: string) => {
    setDiaryId(id); // 클릭된 다이어리 ID 설정
    router.push(`/member/diary/${id}/parchment`); // 다이어리 페이지로 이동
  };

  return (
    <div>
      <div
        className={`flex-grow flex items-center justify-center transition-all duration-300 ${
          gridView ? 'justify-start mt-8' : 'justify-center'
        }`}
      >
        {gridView ? (
          // 그리드 뷰에서 다이어리 커버 표시
          <div className="grid grid-cols-3 gap-20 max-w-full mt-[100px]">
            {diaryCovers.length > 0 ? (
              diaryCovers.map((cover, index) =>
                cover.cover_id ? (
                  <div
                    key={cover.cover_id}
                    className="flex flex-col items-center justify-center cursor-pointer"
                    onClick={() => handleDiaryClick(cover.diary_id as string)}
                    style={{
                      width: '250px',
                      height: '400px'
                    }}
                  >
                    <div className="relative flex flex-col items-center justify-center w-full h-full rounded shadow-md overflow-hidden">
                      <Stage
                        width={250} // 고정된 너비
                        height={400} // 고정된 높이
                        scaleX={250 / cover.cover_stage_size.width} // 비율에 맞춰 크기 조정
                        scaleY={400 / cover.cover_stage_size.height} // 비율에 맞춰 크기 조정
                      >
                        <Layer>
                          <Rect
                            x={0}
                            y={0}
                            width={cover.cover_stage_size.width}
                            height={cover.cover_stage_size.height}
                            fillPatternImage={
                              cover.cover_bg_color.startsWith('http')
                                ? (() => {
                                    const img = new window.Image();
                                    img.src = cover.cover_bg_color;
                                    return img;
                                  })()
                                : undefined
                            }
                            fill={cover.cover_bg_color.startsWith('http') ? undefined : cover.cover_bg_color}
                          />
                          <Text
                            text={cover.cover_title}
                            fontSize={cover.cover_title_fontsize}
                            x={cover.cover_title_position.x}
                            y={cover.cover_title_position.y}
                            width={cover.cover_title_width}
                            rotation={cover.cover_title_rotation}
                          />
                          {loadedImages[index].src && (
                            <KonvaImage
                              image={loadedImages[index]}
                              x={cover.cover_image_position.x}
                              y={cover.cover_image_position.y}
                              width={cover.cover_image_size.width}
                              height={cover.cover_image_size.height}
                              rotation={cover.cover_image_rotation}
                            />
                          )}
                          {unsplashImages[index].src && (
                            <KonvaImage
                              image={unsplashImages[index]}
                              x={cover.unsplash_image_position.x}
                              y={cover.unsplash_image_position.y}
                              width={cover.unsplash_image_size.width}
                              height={cover.unsplash_image_size.height}
                              rotation={cover.unsplash_image_rotation}
                            />
                          )}
                        </Layer>
                      </Stage>
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
          // 스와이프 뷰에서 다이어리 커버 표시
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
              diaryCovers.map((cover, index) =>
                cover.cover_id ? (
                  <SwiperSlide
                    key={cover.cover_id}
                    onClick={() => handleDiaryClick(cover.diary_id as string)}
                    className="relative cursor-pointer flex flex-col w-[480px] h-[720px] items-center justify-center rounded shadow-md text-2xl font-bold text-black"
                    style={{
                      backgroundColor: cover.cover_bg_color,
                      width: cover.cover_stage_size.width * cover.cover_scale,
                      height: cover.cover_stage_size.height * cover.cover_scale
                    }}
                  >
                    <Stage
                      width={cover.cover_stage_size.width}
                      height={cover.cover_stage_size.height}
                      scaleX={cover.cover_scale}
                      scaleY={cover.cover_scale}
                    >
                      <Layer>
                        <Rect
                          x={0}
                          y={0}
                          width={cover.cover_stage_size.width}
                          height={cover.cover_stage_size.height}
                          fillPatternImage={
                            cover.cover_bg_color.startsWith('http')
                              ? (() => {
                                  const img = new window.Image();
                                  img.src = cover.cover_bg_color;
                                  return img;
                                })()
                              : undefined
                          }
                          fill={cover.cover_bg_color.startsWith('http') ? undefined : cover.cover_bg_color}
                        />
                        <Text
                          text={cover.cover_title}
                          fontSize={cover.cover_title_fontsize}
                          x={cover.cover_title_position.x}
                          y={cover.cover_title_position.y}
                          width={cover.cover_title_width}
                          rotation={cover.cover_title_rotation}
                        />
                        {loadedImages[index].src && (
                          <KonvaImage
                            image={loadedImages[index]}
                            x={cover.cover_image_position.x}
                            y={cover.cover_image_position.y}
                            width={cover.cover_image_size.width}
                            height={cover.cover_image_size.height}
                            rotation={cover.cover_image_rotation}
                          />
                        )}
                        {unsplashImages[index].src && (
                          <KonvaImage
                            image={unsplashImages[index]}
                            x={cover.unsplash_image_position.x}
                            y={cover.unsplash_image_position.y}
                            width={cover.unsplash_image_size.width}
                            height={cover.unsplash_image_size.height}
                            rotation={cover.unsplash_image_rotation}
                          />
                        )}
                      </Layer>
                    </Stage>
                  </SwiperSlide>
                ) : null
              )
            ) : (
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
      <div className="fixed bottom-16 right-16">
        <CreateDiaryButton onClick={handleCreateDiary} /> {/* 다이어리 생성 버튼 */}
      </div>
    </div>
  );
};

export default DiaryCase;
