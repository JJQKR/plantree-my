'use client';

import { supabase } from '@/supabase/client';
import React from 'react';

const PlantreeLoginModal: React.FC<{
  onClose: () => void;
  onSignupClick: () => void;
  onPlantreeLoginClick: () => void;
}> = ({ onClose, onSignupClick, onPlantreeLoginClick }) => {
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKakaoLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: 'http://localhost:3000/member',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });

    if (error) {
      console.error('Kakao login error:', error.message);
    } else {
      localStorage.setItem('loginSuccess', 'true');
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/member',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });
    if (error) {
      console.error('Google login error:', error.message);
    } else {
      localStorage.setItem('loginSuccess', 'true');
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white p-4 rounded">
        <h1 className="text-xl font-bold mb-4 text-center text-emerald-400">Welcome to PlanTree!! </h1>
        <form>
          <div className="flex flex-col gap-2 mt-4">
            <button
              type="button"
              className="w-full px-4 py-3 font-bold bg-emerald-400 text-black rounded"
              onClick={onPlantreeLoginClick}
            >
              플랜트리 로그인
            </button>
            <button
              type="button"
              className="w-full px-4 py-3 font-bold bg-yellow-300 text-black rounded"
              onClick={handleKakaoLogin}
            >
              카카오톡 로그인
            </button>
            <button
              type="button"
              className="w-full px-4 py-3 font-bold bg-red-500 text-black rounded"
              onClick={handleGoogleLogin}
            >
              구글 로그인
            </button>
          </div>
          <div className="gap-2 mt-4">
            <button
              type="button"
              className="w-full px-4 py-3 font-bold bg-blue-500 text-black rounded"
              onClick={onSignupClick}
            >
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlantreeLoginModal;
