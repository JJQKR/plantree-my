'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client'; // 기존에 생성된 supabase 클라이언트 가져오기
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import useUserStore from '@/stores/user.store';
import Image from 'next/image';

const levelMap: { [key: string]: number } = {
  lv1: 1,
  lv2: 2,
  lv3: 3,
  lv4: 4,
  lv5: 5,
  lv6: 6
};

interface GardenStage {
  id: number;
  content: React.ReactNode;
  name: string;
}

const GardenCarousel: React.FC = () => {
  const [gardenStages, setGardenStages] = useState<GardenStage[]>([
    {
      id: 1,
      content: (
        <div className="relative w-[98rem] h-[48rem] sm:w-[38rem] sm:h-[18.7rem] rounded-bl-[2rem] rounded-br-[2rem]">
          <Image src="/images/garden1.jpg" alt="garden1" fill className="object-cover" />
        </div>
      ),
      name: '씨앗'
    },
    {
      id: 2,
      content: (
        <div className="relative w-[98rem] h-[48rem] sm:w-[38rem] sm:h-[18.7rem] rounded-bl-[2rem] rounded-br-[2rem]">
          <Image src="/images/garden2.jpg" alt="garden2" fill className="object-cover" />
        </div>
      ),
      name: '새싹'
    },
    {
      id: 3,
      content: (
        <div className="relative w-[98rem] h-[48rem] sm:w-[38rem] sm:h-[18.7rem] rounded-bl-[2rem] rounded-br-[2rem]">
          <Image src="/images/garden3.jpg" alt="garden3" fill className="object-cover" />
        </div>
      ),
      name: '풀'
    },
    {
      id: 4,
      content: (
        <div className="relative w-[98rem] h-[48rem] sm:w-[38rem] sm:h-[18.7rem] rounded-bl-[2rem] rounded-br-[2rem]">
          <Image src="/images/garden4.jpg" alt="garden4" fill className="object-cover" />
        </div>
      ),
      name: '묘목'
    },
    {
      id: 5,
      content: (
        <div className="relative w-[98rem] h-[48rem] sm:w-[38rem] sm:h-[18.7rem] rounded-bl-[2rem] rounded-br-[2rem]">
          <Image src="/images/garden5.jpg" alt="garden5" fill className="object-cover" />
        </div>
      ),
      name: '나무'
    },
    {
      id: 6,
      content: (
        <div className="relative w-[98rem] h-[48rem] sm:w-[38rem] sm:h-[18.7rem] rounded-bl-[2rem] rounded-br-[2rem]">
          <Image src="/images/garden6.jpg" alt="garden6" fill className="object-cover" />
        </div>
      ),
      name: '열매'
    }
  ]);

  const [displayStages, setDisplayStages] = useState<GardenStage[]>([]);
  const [totalStages, setTotalStages] = useState<number>(1);

  const { levelName } = useUserStore((state) => state);

  useEffect(() => {
    const fetchUserEmailAndLevel = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !sessionData.session) {
        console.error('Session fetching error:', sessionError);
        return;
      }

      const email = sessionData.session?.user?.email;

      if (!email) {
        console.error('Email is undefined');
        return;
      }

      const { data, error } = await supabase.from('users').select('level_id').eq('email', email).single();

      if (error) {
        console.error('level_id fetching error:', error);
        return;
      }

      const levelId = data?.level_id;
      const maxLevel = levelId ? levelMap[levelId] : 1;
      setTotalStages(maxLevel);
      setDisplayStages(gardenStages.slice(0, maxLevel));
    };

    fetchUserEmailAndLevel();
  }, [gardenStages, levelName]);

  const pagination = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      const stageName = displayStages[index]?.name || '';
      return `<div class="${className} custom-bullet">${stageName}</div>`;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-[98rem] h-[48rem] sm:w-[38rem] sm:h-[18.7rem]">
        <Swiper
          spaceBetween={0}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          pagination={pagination}
          modules={[Pagination]}
          style={{ marginTop: 0, paddingTop: 0 }}
        >
          {displayStages.map((stage) => (
            <SwiperSlide key={stage.id}>
              <div className="w-[98rem] h-[48rem] sm:w-[38rem] sm:h-[18.7rem] rounded-bl-[2rem] rounded-br-[2rem] overflow-hidden">
                {stage.content}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <style jsx global>{`
        .swiper-container {
          height: 100%; /* Ensure Swiper container height is fixed */
          padding: 0 !important;
          margin: 0 !important;
        }
        .swiper-slide {
          height: 100%; /* Ensure each slide fits within the container */
        }

        .custom-bullet {
          bottom: 1rem; /* 원하는 위치로 조정 */
          width: 5.1rem;
          height: 3.3rem;
          background-color: rgba(0, 0, 0, 0.5) !important;
          border-radius: 0.4rem !important;
          text-align: center;
          color: white !important;
          font-weight: 600;
          font-size: 2rem;
          margin-bottom: 2rem !important;
          margin-top: -2rem !important; /* This will move the bullet upwards */
          /* z-index: 1; */
        }

        .swiper-pagination-bullet-active.custom-bullet {
          width: 5.1rem;
          height: 3.3rem;
          background-color: white !important;
          color: green !important;
          border-radius: 0.4rem !important;
          font-weight: 600;
          font-size: 2rem;
          margin-bottom: 2rem !important;
          margin-top: -2rem !important; /* This will move the bullet upwards */
          /* z-index: 1; */
        }

        @media (max-width: 767px) {
          .custom-bullet,
          .swiper-pagination-bullet-active.custom-bullet {
            width: 4.1rem;
            height: 2.599rem;
            font-size: 1.6rem;
            margin-bottom: 0.2rem !important;
          }
        }

        img {
          display: block; /* 추가된 스타일 */
        }
      `}</style>
    </div>
  );
};

export default GardenCarousel;
