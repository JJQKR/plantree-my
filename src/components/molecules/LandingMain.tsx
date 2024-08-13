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

  const handleLinkClick = async (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
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

  return (
    <main className=" w-[1280px] bg-white text-black flex flex-col flex-grow items-center justify-center mx-auto">
      <div className="w-[1000px] relative mb-12 image-container">
        <Image
          src="/images/main11.jpg"
          alt="Main Image"
          width={1600}
          height={900}
          className="rounded-2xl mt-3 w-full h-[450px] object-cover"
        />
        <div className="overlay"></div>
      </div>
      <div className="text-center mb-12">
        <p className="text-5xl font-black mb-4">소중한 우리의 일상을</p>
        <p className="text-5xl font-black mb-4 text-green-500">
          자유롭게<span className="text-black">,</span> 재미있게<span className="text-black">,</span> 언제 어디서나
        </p>
        <p className="text-5xl font-black mb-7">기록하는 새로운 방법</p>
        <p className="text-7xl font-black mb-8">
          <span className="text-green-600">
            Plan<span className="text-green-400">tree</span>
          </span>{' '}
          에 오신것을 환영합니다!
        </p>
      </div>

      <section className="w-full max-w-[800px] mx-auto mb-11">
        <div className="flex items-start mt-4 w-full justify-center">
          <div className="flex-shrink-0">
            <Image
              src="/images/mainse3.png"
              alt="Main Image"
              width={450}
              height={604}
              className="rounded-2xl w-full h-[450px] max-w-[450px] shadow-xl mr-3"
            />
          </div>
          <div className="flex flex-col m-3 font-black">
            <div className="mt-11">
              <p className="text-4xl text-green-600 mb-4 mt-11">플랜트리는</p>
              <p className="text-3xl">유저분들의 다양한 일상을 기록할 수 있는</p>
              <p className="text-3xl">온라인 다이어리 서비스 입니다.</p>
            </div>
            <div className="mt-6">
              <p className="text-3xl">
                라이프 스타일에 맞는 템플릿을 선택하고, 직접 꾸미면서 오프라인에서 느꼈던 다꾸 감성을 온라인으로도
                느껴보실 수 있어요.
              </p>
            </div>
            <div className="w-[480px] h-[150px] mt-6 border-2 border-green-700 rounded-lg p-5 bg-transparent flex">
              <div className="flex flex-col items-center ml-5">
                <Image
                  src="/images/mainavatar4.jpg"
                  alt="Profile Image"
                  width={50}
                  height={50}
                  className="rounded-full mt-10"
                />
                <div className="mt-2 text-center">
                  <p className="text-xl font-bold">Boyoung</p>
                  <p className="text-sm text-gray-600">FE</p>
                </div>
              </div>
              <div className="w-[480px] ml-6 flex flex-col items-center text-gray-600">
                <p className="text-md">평소 다이어리를 쓰면서 하루를 정리하는 편인데,</p>
                <p>손글씨가 안 이뻐서 다꾸 하는 맛이 없었어요..</p>
                <p>이번 프로젝트를 기획하면서</p>
                <p>UX/UI 적으로도 사용하기 쉬우면서도</p>
                <p>최대한 다꾸 감성을 느낄 수 있도록</p>
                <p>유저의 자유도를 높힌 서비스를 기획 해봤어요!</p>
              </div>
            </div>
            <a
              href="/member/hub"
              className="bg-green-600 text-white px-6 py-5 rounded-lg mt-4 text-center hover:bg-green-900 shadow-2xl"
              onClick={(e) => handleLinkClick(e, '/member/hub')}
            >
              자유롭게 다이어리를 꾸며볼까요?
            </a>
          </div>
        </div>
      </section>

      <section className="w-full max-w-[800px] mx-auto mt-11 mb-11">
        <div className="flex flex-row-reverse items-start mt-4 w-full justify-center">
          <div className="flex-shrink-0">
            <Image
              src="/images/mainse21.png"
              alt="Main Image"
              width={450}
              height={400}
              style={{ objectFit: 'cover', overflow: 'hidden' }}
              className="rounded-2xl h-[450px] max-w-[800px] shadow-xl ml-3"
            />
          </div>
          <div className="flex flex-col m-3 font-black text-right">
            <div className="mt-9">
              <p className="text-4xl text-green-600 mt-1 mb-4">'기억나무'와 함께 일상을 기록해요</p>
              <p className="text-3xl">
                Plantree 서비스에는 이름을 본딴 '기억나무' 가 있어요! 처음엔 씨앗의 모습이지만 저희와 함께 다이어리를
                만들고 일상을 기록하다 보면 열심히 자랄거에요
              </p>
            </div>
            <div className="mt-6">
              <p className="text-3xl">다이어리는 써보고 싶었지만 의지력이 약했던 P도!</p>
              <p className="text-3xl">추억을 기록하고 회상하며 일상을 루틴하게 사는 J도!</p>
              <p className="text-3xl">모두 재밌게 일상을 기록해볼 수 있어요.</p>
            </div>
            <div className="w-[480px] h-[150px] mt-10 border-2 border-green-700 rounded-lg p-5 bg-transparent flex">
              <div className="flex flex-col items-center ml-4">
                <Image
                  src="/images/mainavatar2.jpg"
                  alt="Profile Image"
                  width={50}
                  height={50}
                  className="rounded-full mt-10"
                />
                <div className="mt-2 text-center">
                  <p className="text-xl font-bold">Hoondolla</p>
                  <p className="text-sm text-gray-600">FE</p>
                </div>
              </div>
              <div className="w-[480px] ml-6 flex flex-col items-center text-gray-600 text-center mt-3">
                <p className="text-md">솔직히 저는 다이어리를 주로 사용하진 않는 편이에요</p>
                <p>그래서 이번 프로젝트에 임할 때 '낯선 사람들도 익숙하게' 느끼게 해보자 라는 마인드를 가지고</p>
                <p>내가 생각하기에도 한 번 써보고 싶다 라고 </p>
                <p>느낄만한 서비스를 만들고자 했습니다.</p>
              </div>
            </div>
            <a
              href="/member/hub"
              className="bg-green-600 text-white px-6 py-5 rounded-lg mt-4 text-center hover:bg-green-900 shadow-2xl"
              onClick={(e) => handleLinkClick(e, '/member/hub')}
            >
              기억나무와 함께 일상을 기록해볼까요?
            </a>
          </div>
        </div>
      </section>

      <section className="w-full max-w-[800px] mx-auto mb-11 mt-11">
        <div className="flex items-start mt-4 w-full justify-center">
          <div className="flex-shrink-0">
            <Image
              src="/images/mainse4.jpg"
              alt="Main Image"
              width={730}
              height={604}
              style={{ objectFit: 'cover', overflow: 'hidden' }}
              className="rounded-2xl w-full h-[450px] max-w-[450px] shadow-xl mr-3"
            />
          </div>
          <div className="flex flex-col m-3 ml-6 font-black">
            <div className="mt-6">
              <p className="text-4xl text-green-600 mb-4 mt-7">언제 어디서든 원하는 기기로 이용하세요!</p>
              <p className="text-3xl">
                태블릿으로 영상을 보다가도, PC로 게임을 하다가도 기기 지원이 어려워 핸드폰을 찾아 헤멘 기억, 다들 한
                번씩 있지 않으신가요?
              </p>
            </div>
            <div className="mt-3">
              <p className="text-3xl">
                우리의 일상이 빠르게 추억이 될 수 있도록, 기록이 귀찮은 일이 되지 않도록 Plantree는 PC, 태블릿, 모바일
                환경에서도 사용할 수 있어요.
              </p>
            </div>
            <div className="w-[480px] h-[150px] mt-10 border-2 border-green-700 rounded-lg p-5 bg-transparent flex">
              <div className="flex flex-col items-center ml-5">
                <Image
                  src="/images/mainavatar1.jpg"
                  alt="Profile Image"
                  width={50}
                  height={50}
                  className="rounded-full mt-10"
                />
                <div className="mt-2 text-center">
                  <p className="text-xl font-bold">Insu</p>
                  <p className="text-sm text-gray-600">FE</p>
                </div>
              </div>
              <div className="w-[480px] ml-6 flex flex-col items-center text-gray-600">
                <p className="text-md">평소 다이어리를 쓰면서 하루를 정리하는 편인데,</p>
                <p>손글씨가 안 이뻐서 다꾸 하는 맛이 없었어요..</p>
                <p>이번 프로젝트를 기획하면서</p>
                <p>UX/UI 적으로도 사용하기 쉬우면서도</p>
                <p>최대한 다꾸 감성을 느낄 수 있도록</p>
                <p>유저의 자유도를 높힌 서비스를 기획 해봤어요!</p>
              </div>
            </div>
            <a
              href="/member/hub"
              className="bg-green-600 text-white px-6 py-5 rounded-lg mt-4 text-center hover:bg-green-900 shadow-2xl"
              onClick={(e) => handleLinkClick(e, '/member/hub')}
            >
              Plantree 를 사용해볼까요?
            </a>
          </div>
        </div>
      </section>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white">
          <Image src="/images/loading.gif" alt="Loading" width={200} height={200} />
        </div>
      )}
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
