import React from 'react';
import { supabase } from '../../supabase/client';

const SocialModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKakaoLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });
    if (error) console.log('Kakao login error:', error.message);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });
    if (error) console.log('Google login error:', error.message);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white p-4 rounded w-96">
        <h1 className="text-xl font-bold mb-4 text-center text-emerald-400">Welcome to PlanTree!</h1>
        <h2 className="text-xl font-bold mb-4 text-center text-black">소셜 로그인</h2>
        <div className="flex flex-col gap-2 mt-4">
          <button className="w-full px-4 py-3 font-bold bg-yellow-300 text-black rounded" onClick={handleKakaoLogin}>
            카카오톡 로그인
          </button>
          <button className="w-full px-4 py-3 font-bold bg-red-500 text-black rounded" onClick={handleGoogleLogin}>
            구글 로그인
          </button>
          <button className="w-full px-4 py-3 bg-gray-500 text-white rounded" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialModal;
