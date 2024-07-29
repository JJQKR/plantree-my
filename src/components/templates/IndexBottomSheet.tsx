'use client';

import React, { useState, useEffect, ReactNode, MouseEvent, KeyboardEvent } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import './indexBottomSheet.css';

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
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end transition-opacity z-50 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-t-lg w-full max-w-md p-4 transition-transform transform ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <button onClick={onClose} className="absolute top-0 right-0 m-4">
          Close
        </button>
        {children}
      </div>
    </div>
  );
};

interface IndexBottomSheetProps {
  setSelectedPage: (page: number) => void;
}

const IndexBottomSheet: React.FC<IndexBottomSheetProps> = ({ setSelectedPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handlePageSelection = (page: number) => {
    setSelectedPage(page);
    handleClose();
  };

  return (
    <>
      <div className="IndexBottomSheet z-50">
        <BottomSheet isOpen={isOpen} onClose={handleClose}>
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-pink-400 rounded shadow-md cursor-pointer" onClick={() => handlePageSelection(0)}>
              0
            </div>
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
                <div className="p-4 bg-white rounded shadow-md cursor-pointer" onClick={() => handlePageSelection(1)}>
                  1
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="p-4 bg-white rounded shadow-md cursor-pointer" onClick={() => handlePageSelection(2)}>
                  2
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="p-4 bg-white rounded shadow-md cursor-pointer" onClick={() => handlePageSelection(3)}>
                  3
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="p-4 bg-white rounded shadow-md cursor-pointer" onClick={() => handlePageSelection(4)}>
                  4
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="p-4 bg-white rounded shadow-md cursor-pointer" onClick={() => handlePageSelection(5)}>
                  5
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="p-4 bg-white rounded shadow-md cursor-pointer" onClick={() => handlePageSelection(6)}>
                  6
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </BottomSheet>
        <button
          onClick={handleOpen}
          className="fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-4 w-full max-w-md p-4 bg-blue-500 text-white text-xl"
        >
          !!!!!!!INDEX!!!!!!!!
        </button>
      </div>
    </>
  );
};

export default IndexBottomSheet;
