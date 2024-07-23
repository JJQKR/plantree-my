'use client';

import React, { useState } from 'react';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import { supabase } from '../../supabase/client';

const MainHeader: React.FC = () => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);

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
      window.location.reload(); // 페이지 새로고침
    }
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-100">
      <h1 className="text-xl font-bold">MainHeader</h1>
      <div className="flex gap-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          onClick={() => setLoginModalOpen(true)}
        >
          로그인
        </button>
        <button className="px-4 py-2 bg-red-500 rounded hover:bg-red-700" onClick={handleLogout}>
          로그아웃
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          onClick={() => setSignupModalOpen(true)}
        >
          회원가입
        </button>
      </div>
      {isLoginModalOpen && (
        <LoginModal onClose={() => setLoginModalOpen(false)} onSignupClick={handleOpenSignupModal} />
      )}
      {isSignupModalOpen && (
        <SignupModal onClose={() => setSignupModalOpen(false)} onSignupSuccess={handleSignupSuccess} />
      )}
    </header>
  );
};

export default MainHeader;
