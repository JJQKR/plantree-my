'use client';

import React from 'react';
import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

interface TestPagesProps {
  selectedPage: number;
}

const TestPages: React.FC<TestPagesProps> = ({ selectedPage }) => {
  const pages = Array.from({ length: 4 }, (_, i) =>
    i === 0 ? (
      <SwiperSlide key={i}>
        <div className="flex items-center justify-center h-[80vh] bg-white border border-gray-300 shadow-md text-2xl w-full">
          <div className="h-3/4 w-1/3 flex items-center justify-center bg-gray-200 border border-gray-300 shadow-md">
            <h3>Page 0</h3>
          </div>
        </div>
      </SwiperSlide>
    ) : (
      <SwiperSlide key={i}>
        <div className="flex h-[80vh] w-full">
          <div className="flex-1 flex items-center justify-center h-full bg-gray-200 border border-gray-300 shadow-md text-2xl">
            <h3>Page {i * 2 - 1}</h3>
          </div>
          <div className="flex-1 flex items-center justify-center h-full bg-gray-200 border border-gray-300 shadow-md text-2xl">
            <h3>Page {i * 2}</h3>
          </div>
        </div>
      </SwiperSlide>
    )
  );

  return (
    <div className="container mx-auto p-5 max-w-4xl">
      <h2 className="text-center text-3xl mb-5">Flipping Pages</h2>
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        initialSlide={selectedPage}
      >
        {pages}
      </Swiper>
    </div>
  );
};

export default TestPages;
