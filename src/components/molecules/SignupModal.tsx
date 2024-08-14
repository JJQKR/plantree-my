import React, { useState } from 'react';
import { supabase } from '../../supabase/client';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface SignupModalProps {
  onClose: () => void;
  onSignupSuccess: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ onClose, onSignupSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 이메일 형식 검사 함수
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const signUp = async () => {
    // 이메일 형식 확인
    if (!isValidEmail(email)) {
      Swal.fire({
        title: '회원가입 실패.',
        text: '이메일 형식을 지켜주세요!',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    // 비밀번호 길이 확인
    if (password.length < 6) {
      Swal.fire({
        title: '회원가입 실패.',
        text: '비밀번호는 6자 이상으로 설정해주세요!',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    // 비밀번호 확인
    if (password !== confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setPasswordError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: nickname
          }
        }
      });
      if (authError) {
        if (authError.message.includes('User already registered')) {
          Swal.fire({
            title: '이미 사용중인 이메일 입니다.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        } else {
          throw authError;
        }
      }

      if (authData.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            nickname: nickname,
            email: email,
            level_id: 'lv1'
          })
          .select();
        if (profileError) throw profileError;

        Swal.fire({
          title: '회원가입 성공!',
          text: 'PlanTree에 오신 것을 환영합니다!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          onClose();
          onSignupSuccess();
        });

        return { authData, profileData };
      }
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : 'An error occurred.');
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]"
      onClick={handleBackgroundClick}
    >
      <div className="rounded-lg bg-white p-4 w-[400px] h-[400px] flex flex-col justify-center items-center">
        <h1 className="text-4xl font-black mb-4 text-center text-emerald-400">Welcome to PlanTree! </h1>
        <h2 className="text-2xl font-bold mb-4 text-center text-black">회원가입</h2>
        <input
          type="text"
          placeholder="닉네임"
          className="mb-4 p-2 border rounded w-[350px] text-black"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <input
          type="email"
          placeholder="이메일"
          className="mb-4 p-2 border rounded w-[350px] text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="relative w-[350px] mb-4">
          <input
            type={passwordVisible ? 'text' : 'password'}
            placeholder="비밀번호"
            className="p-2 border rounded w-full text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={togglePasswordVisibility}
          >
            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <div className="relative w-[350px] mb-4">
          <input
            type={confirmPasswordVisible ? 'text' : 'password'}
            placeholder="비밀번호 재입력"
            className="p-2 border rounded w-full text-black"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={toggleConfirmPasswordVisibility}
          >
            {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {passwordError && <p className="mb-4 text-red-500">{passwordError}</p>}
        <div className="flex flex-col gap-2 mt-4">
          <button
            className="w-[350px] h-[50px] px-4 py-3 font-bold bg-blue-500 hover:bg-blue-700 hover:text-white text-black rounded"
            onClick={signUp}
          >
            회원가입
          </button>
          <button
            className="w-[350px] h-[50px] px-4 py-3 font-bold bg-gray-500 hover:bg-gray-700 hover:text-white text-black rounded"
            onClick={onClose}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
