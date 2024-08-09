'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import useUserStore from '@/stores/user.store';
import Image from 'next/image';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Key.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

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
        <div style={{ width: '61.25rem', height: '30.63rem' }} className="relative">
          <Image
            src="/images/garden1.png"
            alt="garden1"
            layout="fill"
            objectFit="cover"
            className="rounded-bl-[20px] rounded-br-[20px]"
          />
        </div>
      ),
      name: '씨앗'
    },
    {
      id: 2,
      content: (
        <div style={{ width: '61.25rem', height: '30.63rem' }} className="relative">
          <Image
            src="/images/garden2.png"
            alt="garden2"
            layout="fill"
            objectFit="cover"
            className="rounded-bl-[20px] rounded-br-[20px]"
          />
        </div>
      ),
      name: '새싹'
    },
    {
      id: 3,
      content: (
        <div style={{ width: '61.25rem', height: '30.63rem' }} className="relative">
          <Image
            src="/images/garden3.jpg"
            alt="garden3"
            layout="fill"
            objectFit="cover"
            className="rounded-bl-[20px] rounded-br-[20px]"
          />
        </div>
      ),
      name: '풀'
    },
    {
      id: 4,
      content: (
        <div style={{ width: '61.25rem', height: '30.63rem' }} className="relative">
          <Image
            src="/images/garden4.png"
            alt="garden4"
            layout="fill"
            objectFit="cover"
            className="rounded-bl-[20px] rounded-br-[20px]"
          />
        </div>
      ),
      name: '묘목'
    },
    {
      id: 5,
      content: (
        <div style={{ width: '61.25rem', height: '30.63rem' }} className="relative">
          <Image
            src="/images/garden5.jpg"
            alt="garden5"
            layout="fill"
            objectFit="cover"
            className="rounded-bl-[20px] rounded-br-[20px]"
          />
        </div>
      ),
      name: '나무'
    },
    {
      id: 6,
      content: (
        <div style={{ width: '61.25rem', height: '30.63rem' }} className="relative">
          <Image
            src="/images/garden6.png"
            alt="garden6"
            layout="fill"
            objectFit="cover"
            className="rounded-bl-[20px] rounded-br-[20px]"
          />
        </div>
      ),
      name: '열매나무'
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

      const { email } = sessionData.session.user;
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
      return `<span class="${className} custom-bullet">${stageName}</span>`;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-[61.25rem] h-[30.63rem]">
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
            slideShadows: false
          }}
          pagination={pagination}
          modules={[EffectCoverflow, Pagination]}
        >
          {displayStages.map((stage) => (
            <SwiperSlide key={stage.id}>
              <div className="w-[61.25rem] h-[30.63rem] rounded-bl-[20px] rounded-br-[20px] overflow-hidden">
                {stage.content}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <style jsx global>{`
        .swiper-container {
          height: 100%; /* Ensure Swiper container height is fixed */
        }
        .swiper-slide {
          height: 100%; /* Ensure each slide fits within the container */
        }
        .custom-bullet {
          width: 50px;
          height: 30px;
          background-color: rgba(0, 0, 0, 0.5) !important;
          border-radius: 0.5rem !important;
          text-align: center;
          line-height: 30px;
          color: white !important;
          font-weight: 600;
        }
        .swiper-pagination-bullet-active.custom-bullet {
          width: 50px;
          height: 30px;
          background-color: white !important;
          color: green !important;
          font-weight: 600;
          line-height: 30px;
        }
      `}</style>
    </div>
  );
};

export default GardenCarousel;
