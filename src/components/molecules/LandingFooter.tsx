'use client';

import React from 'react';
import Image from 'next/image';

const LandingFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-green-950 text-white p-8">
      <div className="w-[80rem] container mx-auto text-center flex flex-col items-center font-bold text-gray-400">
        <div className="flex flex-row mb-8 items-center">
          <div className="relative w-[20rem] h-[10rem]">
            <Image
              src="/images/footer_logo.png"
              alt="Plantree Logo"
              fill
              className="object-contain"
              sizes="(max-width: 1280px) 100vw, 20rem"
            />
          </div>
          <div className="text-xl ml-4 mt-7">플랜트리 - 일상을 기록하는 새로운 방법</div>
        </div>

        <div className="flex justify-center w-full mb-8 gap-[1.1rem]">
          <span className="text-lg hover:text-white cursor-pointer" onClick={scrollToTop}>
            페이지 최상단으로 이동
          </span>
          <a href="#" className="text-lg">
            Plantree
          </a>
          <a href="#" className="text-lg">
            About Us
          </a>
        </div>

        <div className="text-center mb-4">
          <p>© 2024 Team Plantree</p>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-[80rem] mt-5">
          <div className="flex flex-row items-center gap-[1.1rem]">
            <h2 className="text-lg font-bold">FE</h2>
            <p>이보영</p>
            <a
              href="https://github.com/osoon9295"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-500 p-1 rounded-lg text-black hover:text-white hover:bg-red-700"
            >
              깃허브
            </a>
          </div>
          <div className="flex flex-row items-center gap-[1.1rem]">
            <h2 className="text-lg font-bold">FE</h2>
            <p>강연주</p>
            <a
              href="https://github.com/JJQKR"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-500 p-1 rounded-lg text-black hover:text-white hover:bg-red-700"
            >
              깃허브
            </a>
          </div>
          <div className="flex flex-row items-center gap-[1.1rem]">
            <h2 className="text-lg font-bold">FE</h2>
            <p>김재훈</p>
            <a
              href="https://github.com/hoondolla"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-500 p-1 rounded-lg text-black hover:text-white hover:bg-red-700"
            >
              깃허브
            </a>
          </div>
          <div className="flex flex-row items-center gap-[1.1rem]">
            <h2 className="text-lg font-bold">FE</h2>
            <p>박영수</p>
            <a
              href="https://github.com/youngsupark1"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-500 p-1 rounded-lg text-black hover:text-white hover:bg-red-700"
            >
              깃허브
            </a>
          </div>
          <div className="flex flex-row items-center gap-[1.1rem]">
            <h2 className="text-lg font-bold">FE</h2>
            <p>유인수</p>
            <a
              href="https://github.com/YISYISYISYIS"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-500 p-1 rounded-lg text-black hover:text-white hover:bg-red-700"
            >
              깃허브
            </a>
          </div>
          <div className="flex flex-row items-center gap-[1.1rem]">
            <h2 className="text-lg font-bold">DE</h2>
            <p>황민균</p>
            <a
              href="https://notion.so"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-500 p-1 rounded-lg text-black hover:text-white hover:bg-red-700"
            >
              노션 포폴
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
