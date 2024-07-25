'use client';

import React, { useState, useEffect, ReactNode, MouseEvent, KeyboardEvent } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: (event: MouseEvent<HTMLDivElement> | KeyboardEvent) => void;
  children: ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, children }) => {
  const handleClose = (e: MouseEvent<HTMLDivElement> | KeyboardEvent) => {
    if ('key' in e && e.key === 'Escape') {
      onClose(e);
    } else if ((e.target as HTMLElement).id === 'backdrop') {
      onClose(e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleClose as unknown as (e: Event) => void);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      window.removeEventListener('keydown', handleClose as unknown as (e: Event) => void);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <div
      id="backdrop"
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end transition-opacity ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-t-lg w-full max-w-md p-4 transition-transform transform ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

const IndexBottomSheet: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <div className="IndexBottomSheet">
        <button onClick={handleOpen}>Open BottomSheet</button>
        <BottomSheet isOpen={isOpen} onClose={handleClose}>
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-pink-400 rounded shadow-md cursor-pointer">하나</div>
            <Swiper
              slidesPerView={3}
              spaceBetween={3}
              className="flex-1"
              pagination={{
                clickable: true,
                renderBullet: (index, className) => `<span class="${className} hidden"></span>`
              }}
              modules={[Pagination]}
            >
              <SwiperSlide>
                <div className="p-4 bg-white rounded shadow-md cursor-pointer">하나</div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="p-4 bg-white rounded shadow-md cursor-pointer">하나</div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="p-4 bg-white rounded shadow-md cursor-pointer">하나</div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="p-4 bg-white rounded shadow-md cursor-pointer">하나</div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="p-4 bg-white rounded shadow-md cursor-pointer">하나</div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="p-4 bg-white rounded shadow-md cursor-pointer">하나</div>
              </SwiperSlide>
            </Swiper>
          </div>
        </BottomSheet>
      </div>
    </>
  );
};

export default IndexBottomSheet;
