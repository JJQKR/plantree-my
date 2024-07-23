'use client';

import React, { useState } from 'react';
import Card from '@/components/atoms/Card';
import { MainDiaryCaseProps } from '@/types/main';

const cards = ['Card 1', 'Card 2', 'Card 3']; // 카드 데이터

const DiaryCase: React.FC<MainDiaryCaseProps> = ({ sidebarOpen, isSorted }) => {
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const cardWidth = isSorted ? 300 : 380; // 카드 너비 설정
  const cardGap = 20; // 카드 간격
  const containerWidth = cardWidth + cardGap * 2; // 컨테이너 너비 설정

  // 카드 렌더링 함수
  const renderCards = () => {
    const sortedCards = isSorted ? [...cards].sort() : cards; // 정렬된 카드 데이터
    const index = currentPage - 1;
    const translateX = index * cardWidth; // 카드 이동 거리

    return (
      <div className="relative overflow-hidden" style={{ width: `${containerWidth}px`, height: 'auto' }}>
        <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${translateX}px)` }}>
          {sortedCards.map((content, i) => (
            <div key={i} className="flex-shrink-0" style={{ width: cardWidth, marginRight: cardGap }}>
              <Card content={content} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`bg-gray-400 ${
        sidebarOpen ? 'w-[764px]' : 'w-full'
      } h-[930px] flex flex-col items-center justify-center transition-all duration-300`}
    >
      {renderCards()}
      <div className="flex mt-4 space-x-2">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`w-3 h-3 rounded-full ${currentPage === index + 1 ? 'bg-blue-500' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default DiaryCase;
