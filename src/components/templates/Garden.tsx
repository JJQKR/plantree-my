'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import Image from 'next/image';
import { GardenStage } from '@/types/garden';

const Garden = () => {
  const gardenStages: GardenStage[] = [
    { id: 1, content: 'Stage1의 url', name: '씨앗' },
    { id: 2, content: 'Stage2의 url', name: '새싹' },
    { id: 3, content: 'Stage3의 url', name: '풀' }
  ];

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
