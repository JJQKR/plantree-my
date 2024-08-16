'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const LandingFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full h-[23rem] bg-green-950 text-white p-8">
      <div className="w-[80rem] container mx-auto text-center flex flex-col items-center font-bold text-white">
        <div className="flex flex-row mb-8 items-center">
          <div className="relative w-[20rem] h-[4rem]">
            <Image
              src="/images/footer_logo.png"
              alt="Plantree Logo"
              fill
              className="object-contain"
              sizes="(max-width: 1280px) 100vw, 20rem"
            />
          </div>
          <div className="text-xl ml-4 mt-4">플랜트리 - 일상을 기록하는 새로운 방법</div>
        </div>

        <div className="flex justify-center items-center w-full mb-6 gap-[29rem]">
          <span className="text-lg hover:text-gray-500 cursor-pointer" onClick={scrollToTop}>
            페이지 최상단으로 이동
          </span>
          <Link href="#" className="text-lg">
            Plantree
          </Link>
          <Link href="#" className="text-lg">
            About Us
          </Link>
        </div>

        <div className="text-left w-[37.5rem] mb-1">
          <p>© 2024 Team Plantree</p>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-[80rem] mt-1">
          <div className="flex flex-row items-center gap-[1.1rem]">
            <h2 className="text-lg font-bold">FE</h2>
            <p>이보영</p>
            <Link href="https://github.com/osoon9295" target="_blank" rel="noopener noreferrer">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/githublogo.png"
                  alt="GitHub Logo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1280px) 10vw, 40px"
                />
              </div>
            </Link>
          </div>
          <div className="flex flex-row items-center gap-[1.1rem]">
            <h2 className="text-lg font-bold">FE</h2>
            <p>강연주</p>
            <Link href="https://github.com/JJQKR" target="_blank" rel="noopener noreferrer">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/githublogo.png"
                  alt="GitHub Logo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1280px) 10vw, 40px"
                />
              </div>
            </Link>
          </div>
          <div className="flex flex-row items-center gap-[1.1rem]">
            <h2 className="text-lg font-bold">FE</h2>
            <p>김재훈</p>
            <Link href="https://github.com/hoondolla" target="_blank" rel="noopener noreferrer">
              <div className="relative w-10 h-10 ml-[0.25rem]">
                <Image
                  src="/images/githublogo.png"
                  alt="GitHub Logo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1280px) 10vw, 40px"
                />
              </div>
            </Link>
          </div>
          <div className="flex flex-row items-center gap-[1.1rem]">
            <h2 className="text-lg font-bold">FE</h2>
            <p>박영수</p>
            <Link href="https://github.com/youngsupark1" target="_blank" rel="noopener noreferrer">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/githublogo.png"
                  alt="GitHub Logo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1280px) 10vw, 40px"
                />
              </div>
            </Link>
          </div>
          <div className="flex flex-row items-center gap-[1.1rem]">
            <h2 className="text-lg font-bold">FE</h2>
            <p>유인수</p>
            <Link href="https://github.com/YISYISYISYIS" target="_blank" rel="noopener noreferrer">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/githublogo.png"
                  alt="GitHub Logo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1280px) 10vw, 40px"
                />
              </div>
            </Link>
          </div>
          <div className="flex flex-row items-center gap-[1.1rem]">
            <h2 className="text-lg font-bold">DE</h2>
            <p>황민균</p>
            <Link href="https://notion.so" target="_blank" rel="noopener noreferrer">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/githublogo.png"
                  alt="GitHub Logo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1280px) 10vw, 40px"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
