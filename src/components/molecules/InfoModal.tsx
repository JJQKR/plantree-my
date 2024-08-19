'use client';

import useInfoModalStore from '@/stores/info.madal.store';
import React from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { FaTimes } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import Image from 'next/image';

const InfoModal = () => {
  const { isInfoModalOpen, toggleInfoModal } = useInfoModalStore((state) => state);

  const closeInfoModal = () => {
    toggleInfoModal();
  };

  if (!isInfoModalOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={toggleInfoModal}
    >
      <div
        className="bg-white rounded-[2rem]  w-[93.2rem] h-[61.1rem] p-[4rem] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row justify-between text-[2.8rem]">
          <div>플랜트리 사용방법</div>
          <div onClick={closeInfoModal} className="text-[#008A02]">
            <FaTimes />
          </div>
        </div>
        <div className="w-[85.2rem] h-[47.9rem]">
          <Swiper pagination={true} modules={[Pagination]} className="h-full">
            <SwiperSlide className="flex justify-center items-center bg-white text-lg font-semibold">
              <Image src="/images/pcInfo1.png" width={1000} height={800} alt="홈 도움말" />
            </SwiperSlide>
            <SwiperSlide className="flex justify-center items-center bg-white text-lg font-semibold">
              <Image src="/images/pcInfo2.png" width={1000} height={800} alt="다이어리 표지 페이지 도움말" />
            </SwiperSlide>
            <SwiperSlide className="flex justify-center items-center bg-white text-lg font-semibold">
              <Image
                src="/images/pcInfo3.png"
                width={1000}
                height={800}
                alt="다이어리 속지 작성 페이지로 가는 방법 도움말"
              />
            </SwiperSlide>
            <SwiperSlide className="flex justify-center items-center bg-white text-lg font-semibold">
              <Image src="/images/pcInfo4.png" width={1000} height={800} alt="다이어리 속지 작성 페이지 도움말" />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
