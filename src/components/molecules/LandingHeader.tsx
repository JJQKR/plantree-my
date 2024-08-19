'use client';

import { supabase } from '@/supabase/client';
import React, { useEffect, useState } from 'react';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import Image from 'next/image';
import PlantreeLoginModal from './PlantreeLoginModal';
import Swal from 'sweetalert2';

const LandingHeader = () => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);
  const [isPlantreeLoginModalOpen, setPlantreeLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };

    checkUser();
  }, []);

  const handleOpenSignupModal = () => {
    setLoginModalOpen(false);
    setSignupModalOpen(true);
  };

  const handleSignupSuccess = () => {
    setSignupModalOpen(false);
    setLoginModalOpen(true);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('로그아웃 실패:', error);
    } else {
      setIsLoggedIn(false);
      Swal.fire({
        title: '로그아웃 성공!',
        text: '또 볼 수 있으면 좋겠어요!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        window.location.reload();
      });
    }
  };

  const handlePlantreeLoginClick = () => {
    setPlantreeLoginModalOpen(false);
    setLoginModalOpen(true);
  };

  return (
    <header className="bg-white text-black w-full h-[6rem] flex justify-center shadow-b z-10">
      <div className="w-[80rem] flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <div className="relative w-[20rem] h-[5rem]">
            <Image
              src="/images/Plantree.png"
              alt="Logo"
              fill
              className="object-contain sm:ml-6"
              sizes="(max-width: 1280px) 100vw, 20rem"
            />
          </div>
        </h1>
        <div className="flex gap-4">
          {isLoggedIn ? (
            <button className="px-4 py-2 bg-red-500 rounded hover:bg-red-700 font-bold" onClick={handleLogout}>
              로그아웃
            </button>
          ) : (
            <>
              <button
                className="px-4 py-2 bg-lime-700 text-white rounded hover:bg-lime-900 font-bold"
                onClick={() => setPlantreeLoginModalOpen(true)}
              >
                로그인
              </button>
              <button
                className="px-4 py-2 bg-white text-lime-700 border border-lime-700 rounded hover:bg-lime-900 hover:text-white mr-5 font-bold"
                onClick={() => setSignupModalOpen(true)}
              >
                회원가입
              </button>
            </>
          )}
        </div>
        {isPlantreeLoginModalOpen && (
          <PlantreeLoginModal
            onClose={() => setPlantreeLoginModalOpen(false)}
            onSignupClick={handleOpenSignupModal}
            onPlantreeLoginClick={handlePlantreeLoginClick}
          />
        )}
        {isLoginModalOpen && (
          <LoginModal onClose={() => setLoginModalOpen(false)} onSignupClick={handleOpenSignupModal} />
        )}
        {isSignupModalOpen && (
          <SignupModal onClose={() => setSignupModalOpen(false)} onSignupSuccess={handleSignupSuccess} />
        )}
      </div>
    </header>
  );
};

export default LandingHeader;
