'use client';

import React from 'react';
import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

const TestPages: React.FC = () => {
  const pages = Array.from({ length: 6 }, (_, i) =>
    i === 0 ? (
      <SwiperSlide key={i}>
        <div className="flex items-center justify-center h-screen bg-white border border-gray-300 shadow-md text-2xl">
          <div className="h-3/4 w-1/3 flex items-center justify-center bg-gray-200 border border-gray-300 shadow-md">
            <h3>Page 0</h3>
          </div>
        </div>
      </SwiperSlide>
    ) : (
      <SwiperSlide key={i}>
        <div className="flex h-screen">
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
    <div className="container mx-auto p-5 max-w-7xl">
      <h2 className="text-center text-3xl mb-5">Flipping Pages</h2>
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
      >
        {pages}
      </Swiper>
    </div>
  );
};

export default TestPages;
