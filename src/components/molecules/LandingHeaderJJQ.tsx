'use client';

import { supabase } from '@/supabase/client';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import PlantreeLoginModal from './PlantreeLoginModal';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';

const LandingHeaderJJQ = () => {
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
      // 세션 스토리지에서 userId 제거
      sessionStorage.removeItem('userId');

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
    <>
      <header>
        <div>
          <h1>
            <div>
              <Image
                src="/images/Plantree.png"
                alt="Logo"
                fill
                className="object-contain sm:ml-6"
                sizes="(max-width: 1280px) 100vw, 20rem"
              />
            </div>
          </h1>
          <div>
            {isLoggedIn ? (
              <button>로그아웃</button>
            ) : (
              <>
                <button onClick={() => setPlantreeLoginModalOpen(true)}>로그인</button>
                <button onClick={() => setSignupModalOpen(true)}>회원가입</button>
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
    </>
  );
};

export default LandingHeaderJJQ;
