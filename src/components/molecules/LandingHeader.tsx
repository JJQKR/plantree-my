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
    <header className="bg-blue-200 text-white p-4 h-[80px]">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Image
            src="/images/Plantree.png"
            alt="Logo"
            width={200} // 원하는 너비
            height={50} // 원하는 높이
          />
        </h1>
        <div className="flex gap-4">
          {isLoggedIn ? (
            <button className="px-4 py-2 bg-red-500 rounded hover:bg-red-700" onClick={handleLogout}>
              로그아웃
            </button>
          ) : (
            <>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                onClick={() => setPlantreeLoginModalOpen(true)}
              >
                로그인
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
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
