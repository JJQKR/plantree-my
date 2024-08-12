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
  unsplash_image: string;
  unsplash_image_position: Position;
  unsplash_image_size: Size;
  unsplash_image_rotation: number;
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
  const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([]);
  const [loadedBackgroundImages, setLoadedBackgroundImages] = useState<HTMLImageElement[]>([]);
  const [unsplashImages, setUnsplashImages] = useState<HTMLImageElement[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSession = async () => {
    const {
      data: { session }
    } = await supabase.auth.getSession();
    return session?.user?.id || null;
  };

  const getUserIdAndFetchCovers = async () => {
    const id = await fetchSession();
    if (!id) {
      setIsLoggedIn(false);
      return;
    }
    setUserId(id);
    const rawCovers = await getCoversByUserId(id);

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

    setDiaryCovers(covers);
    preloadImages(covers);
  };

  const preloadImages = (covers: CoverData[]) => {
    const images: HTMLImageElement[] = covers.map((cover) => {
      const img = new Image();
      img.src = cover.cover_image;
      return img;
    });

    const backgroundImages: HTMLImageElement[] = covers.map((cover) => {
      if (cover.cover_bg_color.startsWith('http')) {
        const img = new Image();
        img.src = cover.cover_bg_color;
        return img;
      }
      return new Image(); // 빈 이미지 객체 반환
    });

    const unsplashImgs: HTMLImageElement[] = covers.map((cover) => {
      if (cover.unsplash_image) {
        const img = new Image();
        img.src = cover.unsplash_image;
        return img;
      }
      return new Image(); // 빈 이미지 객체 반환
    });

    setLoadedImages(images);
    setLoadedBackgroundImages(backgroundImages);
    setUnsplashImages(unsplashImgs);
  };

  useEffect(() => {
    getUserIdAndFetchCovers();
  }, []);

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
    setLoading(true);
    const diaryId = uuid();
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
          <div className="grid grid-cols-3 gap-10 max-w-full">
            {diaryCovers.length > 0 ? (
              diaryCovers.map((cover, index) =>
                cover.cover_id ? (
                  <div
                    key={cover.cover_id}
                    className="flex flex-col items-center justify-center cursor-pointer"
                    onClick={() => handleDiaryClick(cover.diary_id as string)}
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
        <CreateDiaryButton onClick={handleCreateDiary} />
      </div>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center">
          <img src="/images/loading.gif" alt="Loading" width={200} height={200} />
        </div>
      )}
    </div>
  );
};

export default DiaryCase;
