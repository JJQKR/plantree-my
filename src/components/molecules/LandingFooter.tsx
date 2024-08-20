'use client';

import React, { useState, useEffect } from 'react';
import { FaGithub, FaArrowUp, FaLinkedin } from 'react-icons/fa';
import Link from 'next/link';

const LandingFooter = () => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (scrollTop / windowHeight > 0.8) {
      setShowScrollToTop(true);
    } else {
      setShowScrollToTop(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <footer className="w-full h-auto bg-green-950 text-gray-400 p-8 relative">
      <div className="w-full max-w-[80rem] mx-auto text-center flex flex-col items-center font-bold">
        <div className="flex flex-row mb-8 items-center">
          <div className="relative w-[20rem] h-[4rem]">
            <img src="/images/footer_logo.png" alt="Plantree Logo" className="object-contain w-full h-full" />
          </div>
          <div className="text-xl mt-4 ml-4 text-left">
            <p className="text-2xl">플랜트리 </p> <p> 일상을 기록하는 새로운 방법</p>
            <p>@2024 Team Plantree</p>
          </div>
        </div>

        <div className="flex flex-row justify-center items-center w-full mb-6 gap-[5rem]">
          <span className="text-lg hover:text-white cursor-pointer" onClick={scrollToTop}>
            페이지 최상단으로 이동
          </span>
          <Link href="#" className="text-lg">
            Plantree
          </Link>
          <Link href="https://github.com/osoon9295/plantree" className="text-lg">
            About Us
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-4 max-w-[80rem] mt-1">
          <div className="flex flex-row items-center gap-[2rem]">
            <h2 className="text-lg font-bold">FE</h2>
            <p>이보영</p>
            <Link href="https://github.com/osoon9295" target="_blank" rel="noopener noreferrer">
              <FaGithub className="text-3xl text-white hover:text-gray-400" />
            </Link>
          </div>
          <div className="flex flex-row items-center gap-[2rem]">
            <h2 className="text-lg font-bold">FE</h2>
            <p>강연주</p>
            <Link href="https://github.com/JJQKR" target="_blank" rel="noopener noreferrer">
              <FaGithub className="text-3xl text-white hover:text-gray-400" />
            </Link>
          </div>
          <div className="flex flex-row items-center gap-[2rem]">
            <h2 className="text-lg font-bold">FE</h2>
            <p>김재훈</p>
            <Link href="https://github.com/hoondolla" target="_blank" rel="noopener noreferrer">
              <FaGithub className="text-3xl text-white hover:text-gray-400" />
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 max-w-[80rem] mt-4 ml-[rem]">
          <div className="flex flex-row items-center gap-[2rem]">
            <h2 className="text-lg font-bold">FE</h2>
            <p>박영수</p>
            <Link href="https://github.com/youngsupark1" target="_blank" rel="noopener noreferrer">
              <FaGithub className="text-3xl text-white hover:text-gray-400" />
            </Link>
          </div>
          <div className="flex flex-row items-center gap-[2rem]">
            <h2 className="text-lg font-bold">FE</h2>
            <p>유인수</p>
            <Link href="https://github.com/YISYISYISYIS" target="_blank" rel="noopener noreferrer">
              <FaGithub className="text-3xl text-white hover:text-gray-400" />
            </Link>
          </div>
          <div className="flex flex-row items-center gap-[2rem]">
            <h2 className="text-lg font-bold tracking-[-0.08rem]">DE</h2>
            <p>황민균</p>
            {/* <img src="/images/Notion.png" alt="Notion Logo" className="w-8 h-8" /> */}
            <Link
              href="https://www.linkedin.com/in/%EB%AF%BC%EA%B7%A0-%ED%99%A9-289a632a7/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-[0.5rem]"
            >
              <FaLinkedin className="text-3xl text-white hover:text-gray-400" />
            </Link>
          </div>
        </div>
      </div>

      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-800"
        >
          <FaArrowUp className="text-5xl" />
        </button>
      )}
    </footer>
  );
};

export default LandingFooter;
