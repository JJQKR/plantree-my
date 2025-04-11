'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { supabase } from '@/supabase/client';
import PlantreeLoginModal from './PlantreeLoginModal';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';

const LandingMain = () => {
  const [showPlantreeLoginModal, setShowPlantreeLoginModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePlantreeLoginClick = () => {
    setShowPlantreeLoginModal(false);
    setShowLoginModal(true);
  };

  const handleSignupClick = () => {
    setShowPlantreeLoginModal(false);
    setShowSignupModal(true);
  };

  const handleSignupSuccess = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };
  // const handleLinkClick = async (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  //   e.preventDefault();
  //   alert('클릭됨!');
  // 인증 확인 없이 바로 해당 페이지로 이동
  // window.location.href = href;
  // };

  // 🐡 25.03.13 주석처리함
  // 🐡 25.04.11 다시 살림

  const handleLinkClick = async (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    alert('배포됏냐고');
    setLoading(true);

    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (user) {
      window.location.href = href;
    } else {
      setLoading(false);
      Swal.fire({
        title: '로그인이 필요합니다',
        text: '이 기능을 사용하려면 로그인이 필요합니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '로그인',
        cancelButtonText: '취소'
      }).then((result) => {
        if (result.isConfirmed) {
          setShowPlantreeLoginModal(true);
        }
      });
    }
  };

  return (
    <main className="w-[80rem] max-w-full mx-auto px-4 bg-white text-black flex flex-col flex-grow items-center justify-center">
      <div className=" relative image-cover">
        <div className="relative mb-[1.2rem] w-full h-auto sm:w-[100%] sm:h-auto sm overflow-hidden rounded-2xl">
          <img
            src="/images/랜딩페이지_메인히어로.png"
            alt="Main Image"
            className="w-full h-auto object-contain object-left sm:w-[100%] "
          />
        </div>
        {/* <div className="overlay"></div> */}
      </div>

      <div className="w-[21.7rem] h-[3.5rem] pt-2 pb-2 mt-5 rounded-2xl bg-green-600 text-white text-[1.6rem] font-bold sm:flex sm:items-center">
        <p className="w-fit mx-auto ">플랜트리를 소개합니다💬</p>
      </div>

      <section className="w-full max-w-[80rem] mx-auto mt-[4.1rem] mb-[4.1rem] flex flex-row sm:flex-col sm:items-center sm:justify-between">
        <div className="w-[45.625rem] h-[30rem] relative mb-8 sm:w-[35.625rem] sm:h-[20rem]">
          <Image
            src="/images/랜딩페이지_PC1.jpg"
            alt="Main Image"
            fill
            className="rounded-2xl shadow-xl object-cover"
            sizes="(max-width: 1280px) 100vw, 45.625rem"
          />
        </div>
        <div className="w-[30rem] flex flex-col font-normal ml-5">
          <div className="mt-[2.2rem] ">
            <span className="text-2xl text-center font-bold">
              <p>
                플랜트리는 <span className="text-green-600">원하는 템플릿</span>을 이용해
              </p>{' '}
              <p>
                나만의 <span className="text-green-600">다이어리를 꾸미고</span>
              </p>{' '}
              <p>
                나의 <span className="text-green-600">일상을 한 권의 책처럼</span>
              </p>{' '}
              <p>만들 수 있는 서비스입니다.</p>
            </span>
          </div>
          <div className="w-[30rem] h-[12.125rem] relative mb-3 sm:mt-[3rem]">
            <Image
              src="/images/랜딩페이지_Review1.png"
              alt="Review Image"
              fill
              className="rounded-2xl object-cover"
              sizes="(max-width: 1280px) 100vw, 45.625rem"
            />
          </div>
          <a
            href="/member/hub"
            className="w-[30rem] h-[4.75rem] font-black bg-green-600 text-white px-[0.6rem] py-[0.5rem] rounded-lg text-center hover:bg-green-900 shadow-2xl"
            onClick={(e) => handleLinkClick(e, '/member/hub')}
          >
            <div className="mt-3">다이어리를 만들어볼까요?</div>
          </a>
        </div>
      </section>

      <section className="w-full max-w-[80rem] mx-auto mt-[4.1rem] mb-[4.1rem] flex flex-row-reverse sm:flex-col sm:items-center sm:justify-between">
        <div className="w-[45.625rem] h-[30rem] relative mb-8 sm:w-[35.625rem] sm:h-[20rem]">
          <Image
            src="/images/랜딩페이지_PC2.jpg"
            alt="Main Image"
            fill
            className="rounded-2xl shadow-xl object-cover"
            sizes="(max-width: 1280px) 100vw, 45.625rem"
          />
        </div>
        <div className="w-[30rem] flex flex-col font-normal mr-5">
          <div className="mt-[2.2rem]">
            <span className="text-2xl text-center font-bold">
              <p>씨앗이었던 내가 열매가 되었다고?</p>{' '}
              <p>
                다이어를 <span className="text-green-600">만들고 꾸밀수록</span>
              </p>
              <p>
                <span className="text-green-600">귀여운 이미지와 뱃지</span>를 얻으며
              </p>
              <p>
                <span className="text-green-600">소소한 재미를</span> 찾아보세요.
              </p>
            </span>
          </div>
          <div className="w-[30rem] h-[12.125rem] relative mb-3 sm:mt-[3rem]">
            <Image
              src="/images/랜딩페이지_Review2.png"
              alt="Review Image"
              fill
              className="rounded-2xl object-cover"
              sizes="(max-width: 1280px) 100vw, 45.625rem"
            />
          </div>
          <a
            href="/member/hub"
            className="w-[30rem] h-[4.75rem] font-black bg-green-600 text-white px-[0.6rem] py-[0.5rem] rounded-lg text-center hover:bg-green-900 shadow-2xl"
            onClick={(e) => handleLinkClick(e, '/member/hub')}
          >
            <div className="mt-3">기억나무를 보러갈까요?</div>
          </a>
        </div>
      </section>

      <section className="w-full max-w-[80rem] mx-auto mt-[4.1rem] mb-[4.1rem] flex flex-row sm:flex-col sm:items-center sm:justify-between">
        <div className="w-[45.625rem] h-[30rem] relative mb-8 sm:w-[35.625rem] sm:h-[20rem]">
          <Image
            src="/images/랜딩페이지_PC3.jpg"
            alt="Main Image"
            fill
            className="rounded-2xl shadow-xl object-cover"
            sizes="(max-width: 1280px) 100vw, 45.625rem"
          />
        </div>
        <div className="w-[30rem] flex flex-col font-normal ml-5">
          <div className="mt-[3rem]">
            <span className="text-2xl text-center font-bold">
              <p>
                플랜트리는 <span className="text-green-600">반응형 웹서비스</span>에요!
              </p>{' '}
              <p>
                PC, 태블릿, 모바일 <span className="text-green-600">언제 어디서든지</span>
              </p>{' '}
              <p>일상을 기록할 수 있어요.</p>
            </span>
          </div>
          <div className="w-[30rem] h-[12.125rem] relative mb-3 sm:mt-[3rem]">
            <Image
              src="/images/랜딩페이지_Review3.png"
              alt="Review Image"
              fill
              className="rounded-2xl object-cover"
              sizes="(max-width: 1280px) 100vw, 45.625rem"
            />
          </div>
          <a
            href="/member/hub"
            className="w-[30rem] h-[4.75rem] font-black bg-green-600 text-white px-[0.6rem] py-[0.5rem] rounded-lg text-center hover:bg-green-900 shadow-2xl"
            onClick={(e) => handleLinkClick(e, '/member/hub')}
          >
            <div className="mt-3">반응형을 체험하러 가볼까요?</div>
          </a>
        </div>
      </section>

      {/* {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white">
          <div className="relative w-[20rem] h-[20rem]">
            <Image
              src="/images/loading.gif"
              alt="Loading"
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 20rem"
            />
          </div>
        </div>
      )} */}
      {showPlantreeLoginModal && (
        <PlantreeLoginModal
          onClose={() => setShowPlantreeLoginModal(false)}
          onSignupClick={handleSignupClick}
          onPlantreeLoginClick={handlePlantreeLoginClick}
        />
      )}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onSignupClick={handleSignupClick} />}
      {showSignupModal && (
        <SignupModal onClose={() => setShowSignupModal(false)} onSignupSuccess={handleSignupSuccess} />
      )}
    </main>
  );
};

export default LandingMain;
