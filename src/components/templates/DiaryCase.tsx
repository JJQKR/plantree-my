import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import { DiaryCard } from '@/types/main';

const cards: DiaryCard[] = [
  { id: 1, content: 'Card 1' },
  { id: 2, content: 'Card 2' },
  { id: 3, content: 'Card 3' }
];

const DiaryCase: React.FC = () => {
  // 최대 3개의 카드만 표시
  const limitedCards = cards.slice(0, 3);

  return (
    <div className="w-full h-full flex items-center justify-center">
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
        {limitedCards.map((card) => (
          <SwiperSlide key={card.id}>
            <div className="flex items-center justify-center p-4 bg-white rounded shadow-md w-[380px] h-[570px]">
              <p className="text-center">{card.content}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default DiaryCase;
