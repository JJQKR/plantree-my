import React, { useState, useEffect } from 'react';
import SideButton from '../atoms/SideButton';
import GridToggleButton from '../atoms/GridToggleButton';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import SocialModal from './SocialModal';
import { supabase } from '../../supabase/client';
import { MainHeaderProps } from '@/types/main';
import { useStore } from '@/stores/sidebar.store'; // 상태 가져오기
import Link from 'next/link';

const Header: React.FC<MainHeaderProps> = ({ toggleSidebar, toggleGrid }) => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);
  const [isSocialModalOpen, setSocialModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 상태 가져오기
  const { gridView } = useStore();

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
      window.location.reload();
    }
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <SideButton onClick={toggleSidebar}>Menu</SideButton>
      <div className="flex-grow flex justify-center">
        <Link href="/member">
          <h1 className="text-2xl font-bold">Logo</h1>
        </Link>
      </div>
      <GridToggleButton onClick={toggleGrid} gridView={gridView} />
      <div className="flex gap-4">
        {isLoggedIn ? (
          <button className="px-4 py-2 bg-red-500 rounded hover:bg-red-700" onClick={handleLogout}>
            로그아웃
          </button>
        ) : (
          <>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              onClick={() => setLoginModalOpen(true)}
            >
              로그인
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              onClick={() => setSocialModalOpen(true)}
            >
              소셜 로그인
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
      {isLoginModalOpen && (
        <LoginModal onClose={() => setLoginModalOpen(false)} onSignupClick={handleOpenSignupModal} />
      )}
      {isSignupModalOpen && (
        <SignupModal onClose={() => setSignupModalOpen(false)} onSignupSuccess={handleSignupSuccess} />
      )}
      {isSocialModalOpen && <SocialModal onClose={() => setSocialModalOpen(false)} />}
    </header>
  );
};

export default Header;
