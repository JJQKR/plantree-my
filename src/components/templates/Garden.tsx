'use client';

import React, { useEffect, useState } from 'react';

import { createClient } from '@supabase/supabase-js';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import Image from 'next/image';
import { GardenStage } from '@/types/garden';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Key.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const Garden = () => {
  const [gardenStages, setGardenStages] = useState<GardenStage[]>([
    { id: 1, content: 'Stage1의 url', name: '씨앗' },
    { id: 2, content: 'Stage2의 url', name: '새싹' },
    { id: 3, content: 'Stage3의 url', name: '풀' }
  ]);

  const [levelId, setLevelId] = useState<string | null>(null);

  useEffect(() => {
    //우선 email 및 yjcoyjco@naver.com로 코딩, 수정필요
    const fetchLevelId = async (email: string) => {
      const { data, error } = await supabase.from('users').select('level_id').eq('email', email).single();

      if (error) {
        console.error('level_id fetching error:', error);
        return;
      }

      if (data.level_id === 'dd85615d-7d41-43a4-86e3-33ca7c80248e') {
        const newStage = { id: 4, content: 'Stage4의 url', name: '묘목' };
        setGardenStages((prevStages) => [...prevStages, newStage]);
      }

      setLevelId(data.level_id);
      console.log(levelId);

      // strict mode로 인한 중복 추가 방지 코드
      // if (data.level_id === 'dd85615d-7d41-43a4-86e3-33ca7c80248e') {
      //     const newStage = { id: 4, content: 'Stage4의 url', name: '묘목' };
      //     setGardenStages((prevStages) => {
      //       // 중복 추가 방지
      //       const alreadyAdded = prevStages.some(stage => stage.id === newStage.id);
      //       if (!alreadyAdded) {
      //         return [...prevStages, newStage];
      //       }
      //       return prevStages;
      //     });
      //   }
      // };
    };

    fetchLevelId('yjcoyjco@naver.com');
  }, []);

  return (
    <div className="bg-[#1edaaa] w-[700px] h-[400px]">
      <Swiper
        effect="" // 커버플로우 효과 적용
        grabCursor={true} // 마우스 커서가 손 모양으로 변경
        centeredSlides={true} // 슬라이드가 가운데 정렬
        slidesPerView="auto" // 화면에 보이는 슬라이드 개수를 자동으로 조정
        coverflowEffect={{
          rotate: 50, // 슬라이드 회전 각도
          stretch: 0, // 슬라이드 간 거리
          depth: 100, // 슬라이드 깊이
          modifier: 1, // 효과 강도
          slideShadows: true // 슬라이드 그림자 표시
        }}
        pagination={{ clickable: true }} // 페이지네이션을 클릭 가능하게 설정
        modules={[EffectCoverflow, Pagination]} // 사용 모듈 설정
        className="myGarden"
      >
        {gardenStages.map((stage) => (
          <SwiperSlide key={stage.id}>
            <h3>{stage.name}</h3>
            <div className="flex items-center justify-center p-4 bg-white rounded shadow-md w-[400px] h-[200px]">
              <p className="text-center">{stage.content}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="bg-slate-300 w-[600px] h-[300px]">
        이미지 예시
        <Image src="/images/garden.png" alt="garden" width={300} height={100} />
      </div>
    </div>
  );
};

export default Garden;
