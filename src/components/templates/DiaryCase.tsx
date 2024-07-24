import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import { DiaryCard } from '@/types/main';
import { useStore } from '@/stores/sidebar.store';

// 다이어리 카드 데이터를 하드코딩한 배열 (테스트를 위한 것)
const cards: DiaryCard[] = [
  { id: 1, content: 'Card 1' },
  { id: 2, content: 'Card 2' },
  { id: 3, content: 'Card 3' }
];

const DiaryCase: React.FC = () => {
  const { gridView } = useStore(); // 상태에서 gridView 값을 가져옴
  const limitedCards = cards.slice(0, 3); // 카드 데이터를 최대 3개로 제한

  return (
    <div className={`w-full h-full flex ${gridView ? 'items-start mt-8' : 'items-center'} justify-center`}>
      {gridView ? (
        // gridView가 true일 때 그리드 형태로 카드 렌더링
        <div className="grid grid-cols-3 gap-4">
          {limitedCards.map((card) => (
            <div key={card.id} className="p-4 bg-white rounded shadow-md w-[180px] h-[270px]">
              <p className="text-center">{card.content}</p> {/* 카드의 내용을 가운데 정렬하여 렌더링 */}
            </div>
          ))}
        </div>
      ) : (
        // gridView가 false일 때 Swiper 형태로 카드 렌더링
        <Swiper
          effect="coverflow" // 커버플로우 효과 적용
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
      )}
    </div>
  );
};

export default DiaryCase;
