import React, { useState } from 'react';
import { supabase } from '@/supabase/client';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';

interface ResetPasswordModalProps {
  token: string | null;
  onClose: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ token, onClose }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleResetPassword = async () => {
    if (password.length < 6) {
      Swal.fire({
        title: '유효성 검사 실패',
        text: '비밀번호는 최소 6자 이상이어야 합니다.',
        icon: 'error',
        confirmButtonText: '확인'
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        title: '유효성 검사 실패',
        text: '비밀번호가 일치하지 않습니다.',
        icon: 'error',
        confirmButtonText: '확인'
      });
      return;
    }

    try {
      const { data, error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage('비밀번호가 성공적으로 변경되었습니다.');
      setError(null);

      Swal.fire({
        title: '비밀번호 변경 완료',
        text: '비밀번호가 성공적으로 변경되었습니다.',
        icon: 'success',
        confirmButtonText: '확인'
      });

      setTimeout(onClose, 2000);
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
      setMessage(null);
      setError(error instanceof Error ? error.message : 'An error occurred.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]">
      <div className="bg-white p-4 rounded-3xl w-[39rem] h-[28rem]">
        <h2 className="text-3xl font-bold mt-10 mb-4 text-center text-green-600">비밀번호 재설정</h2>
        <h1 className="text-xl font-bold">사용할 비밀번호</h1>
        <div className="relative mb-4">
          <input
            type={passwordVisible ? 'text' : 'password'}
            placeholder="최소 6글자 이상 입력해주세요"
            className="p-2 border rounded-[0.7rem] w-full text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          >
            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <h1 className="text-xl font-bold">비밀번호 재입력</h1>
        <div className="relative mb-4">
          <input
            type={confirmPasswordVisible ? 'text' : 'password'}
            placeholder="위 비밀번호와 동일하게 입력해주세요"
            className="p-2 border rounded-[0.7rem] w-full text-black"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span
            onClick={toggleConfirmPasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          >
            {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-col gap-2 mt-4">
          <button
            className="w-full h-[4rem] px-4 py-3 rounded-[0.7rem] bg-green-600 hover:bg-green-800 text-white"
            onClick={handleResetPassword}
          >
            비밀번호 변경
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
