'use client';

import { supabase } from '@/supabase/client';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ForgotPasswordModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/member/reset-password?token=YOUR_TOKEN'
      });
      if (error) throw error;
      setMessage('인증 메일이 전송되었습니다.');
      setError(null);
      Swal.fire({
        title: '인증 메일 전송 성공!',
        text: '인증 메일이 전송되었습니다. 이메일을 확인해주세요.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error('비밀번호 재설정 실패:', error);
      setMessage(null);
      setError(error instanceof Error ? error.message : 'An error occurred.');
      Swal.fire({
        title: '인증 메일 전송 실패!',
        text: '인증 메일 전송에 실패했습니다. 다시 시도해주세요.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const clearEmail = () => setEmail('');

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white rounded-3xl w-[40rem] h-[37rem] flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-4 text-center text-green-600"> 비밀번호 찾기 </h1>
        <form onSubmit={handleResetPassword}>
          <h1 className="font-bold mb-1">가입한 이메일 주소</h1>
          <div className="relative w-[35rem] mb-4">
            <input
              type="email"
              placeholder="가입하셨던 이메일 주소를 입력해주세요."
              className="p-2 border rounded w-full text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {email && (
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={clearEmail}
              >
                <FaTimes />
              </span>
            )}
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <h1 className="text-left text-xl text-black">* 받으신 메일을 통해 비밀번호를 재설정 하실 수 있습니다.</h1>
          <h1 className="text-left text-xl text-black">* 이메일 발송까지 최대 1~10초 가량 소요될 수 있습니다.</h1>
          <h1 className="text-left text-xl text-black">* 보낸이 메일 주소는 아래와 같습니다.</h1>
          <h1 className="text-left text-xl text-black">* noreply@mail.app.superbase.io</h1>
          <div className="flex flex-col gap-2 mt-4">
            <button
              type="submit"
              className="w-[35rem] h-[5rem] font-bold px-[0.4rem] py-[0.3rem] bg-green-600 hover:bg-green-800 text-white rounded-2xl"
            >
              재설정 메일 전송하기
            </button>
            {/* <button
              type="button"
              className="w-[35rem] h-[5rem] font-bold px-[0.4rem] py-[0.3rem] bg-white hover:bg-gray-200 text-black rounded-2xl border-1 border-black shadow-md"
              onClick={onClose}
            >
              취소
            </button> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
