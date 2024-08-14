'use client';

import { supabase } from '@/supabase/client';
import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';

const PlantreeLoginModal: React.FC<{
  onClose: () => void;
  onSignupClick: () => void;
  onPlantreeLoginClick: () => void;
}> = ({ onClose, onSignupClick, onPlantreeLoginClick }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Error fetching session:', sessionError.message);
      } else {
        setSession(sessionData.session);
      }
    };

    fetchSession();
  }, []);

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleLoginSuccess = async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      console.error('Auth session missing or session error:', sessionError?.message);
      return;
    }

    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Error fetching user data:', userError.message);
    } else {
      console.log('User data:', user);
      localStorage.setItem('loginSuccess', 'true');
      setLoading(false);
    }
  };

  const handleKakaoLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: 'http://localhost:3000/member/hub',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });

    if (error) {
      console.error('Kakao login error:', error.message);
      setLoading(false);
    } else {
      setTimeout(async () => {
        await handleLoginSuccess();
      }, 1000);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/member/hub',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });

    if (error) {
      console.error('Google login error:', error.message);
      setLoading(false);
    } else {
      setTimeout(async () => {
        await handleLoginSuccess();
      }, 1000);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]"
      onClick={handleBackgroundClick}
    >
      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white">
          <img src="/images/loading.gif" alt="Loading" className="w-[8rem] h-[8rem]" />
        </div>
      ) : (
        <div className="rounded-lg bg-white p-[4rem] w-[40rem] h-[37rem] flex flex-col justify-center items-center">
          <h1 className="text-4xl font-black mb-[1rem] text-center text-emerald-400">Welcome to PlanTree</h1>
          <form>
            <div className="flex flex-col items-center gap-[1rem]">
              <button
                type="button"
                className="w-[35rem] h-[5rem] px-[0.4rem] py-[0.3rem] font-bold bg-green-600 text-black rounded hover:bg-green-800 hover:text-white"
                onClick={onPlantreeLoginClick}
              >
                플랜트리 로그인
              </button>
              <button
                type="button"
                className="w-[35rem] h-[5rem] px-[0.4rem] py-[0.3rem] font-bold bg-yellow-300 hover:bg-yellow-500 hover:text-white text-black rounded flex items-center justify-center gap-[0.2rem]"
                onClick={handleKakaoLogin}
              >
                <img src="/images/kakao_logo.png" alt="Kakao Logo" className="w-[2rem] h-[2rem]" />
                카카오톡 로그인
              </button>
              <button
                type="button"
                className="w-[35rem] h-[5rem] px-[0.4rem] py-[0.3rem] font-bold bg-blue-400 hover:bg-blue-700 hover:text-white text-black rounded flex items-center justify-center gap-[0.2rem]"
                onClick={handleGoogleLogin}
              >
                <img src="/images/google_logo.png" alt="Google Logo" className="w-[2rem] h-[2rem]" />
                구글 로그인
              </button>
              <button
                type="button"
                className="w-[35rem] h-[5rem] px-[0.4rem] py-[0.3rem] font-bold bg-gray-500 hover:bg-gray-700 hover:text-white text-black rounded"
                onClick={onSignupClick}
              >
                회원가입
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PlantreeLoginModal;
