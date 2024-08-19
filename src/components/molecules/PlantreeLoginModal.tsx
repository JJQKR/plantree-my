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
        redirectTo: 'http://plantreeforest.com/member/hub',
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
        <div className="fixed inset-0 flex items-center justify-center bg-white ">
          <img src="/images/loading.gif" alt="Loading" className="w-[8rem] h-[8rem]" />
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-[4rem] w-[41rem] h-[39rem] flex flex-col justify-center items-center">
          <h1 className="text-4xl font-black mb-[1rem] text-center text-green-600">🪴플랜트리에 어서오세요!</h1>
          <h1 className="text-2xl font-black mb-[1rem] text-center text-gray-400">소셜 로그인을 통해</h1>
          <h1 className="text-2xl font-black mb-[1rem] text-center text-gray-400">
            빠르고 편하게 이용하실 수 있어요 😄
          </h1>
          <form>
            <div className="flex flex-col items-center gap-[1rem]">
              <button
                type="button"
                className="w-[35rem] h-[5rem] px-[0.4rem] py-[0.3rem] font-bold bg-green-600 text-white rounded flex items-center justify-start hover:bg-green-800 hover:text-black shadow-md border-1 border-black"
                onClick={onPlantreeLoginClick}
              >
                <img
                  src="/images/login_plantree.png"
                  alt="Kakao Logo"
                  className="w-[2rem] h-[2rem] ml-[1rem] mr-[2rem]"
                />
                <span className="flex-1 text-center">Plantree (e-mail)</span>
              </button>
              <button
                type="button"
                className="w-[35rem] h-[5rem] px-[0.4rem] py-[0.3rem] font-bold bg-yellow-300 hover:bg-yellow-500 hover:text-white text-black rounded flex items-center justify-start gap-[0.2rem] shadow-md border-1 border-black"
                onClick={handleKakaoLogin}
              >
                <img src="/images/kakao_plantreelogin.png" alt="Kakao Logo" className="w-[2rem] h-[2rem] ml-[1rem]" />
                <span className="flex-1 text-center">Kakao</span>
              </button>
              <button
                type="button"
                className="w-[35rem] h-[5rem] px-[0.4rem] py-[0.3rem] font-bold bg-white hover:bg-blue-700 hover:text-white text-black rounded flex items-center justify-start gap-[0.2rem] shadow-md border-1 border-black"
                onClick={handleGoogleLogin}
              >
                <img src="/images/google_logo.png" alt="Google Logo" className="w-[2rem] h-[2rem] ml-[1rem]" />
                <span className="flex-1 text-center">Google</span>
              </button>
              <button
                type="button"
                className="w-[35rem] h-[5rem] px-[0.4rem] py-[0.3rem] font-bold bg-gray-200 hover:bg-gray-700 hover:text-white text-black flex items-center justify-start rounded shadow-md border-1 border-black"
                onClick={onSignupClick}
              >
                <img src="/images/signup.png" alt="Signup Logo" className="w-[2rem] h-[2rem] ml-[1rem]" />
                <span className="flex-1 text-center">회원가입</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PlantreeLoginModal;
