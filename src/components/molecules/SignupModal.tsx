'use client';

import React, { useState } from 'react';
import { supabase } from '../../supabase/client';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';

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

    // 이메일 전체 형식이 맞는지 먼저 확인
    if (!emailRegex.test(email)) {
      return false;
    }

    // 로컬 파트(골뱅이 앞 부분) 검사
    const [localPart] = email.split('@');
    if (!localPart || localPart.trim().length < 4) {
      return false;
    }

    return true;
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault(); // 엔터 시 폼이 제출되지 않도록 기본 동작 막기

    // 이메일 형식 확인
    if (!isValidEmail(email)) {
      Swal.fire({
        title: '회원가입 실패.',
        text: '이메일 형식을 지켜주세요! 골뱅이(@) 앞에 아이디를 최소 4자 이상 입력해주세요.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    // 닉네임이 비어있는지 확인
    if (!nickname.trim()) {
      Swal.fire({
        title: '회원가입 실패.',
        text: '닉네임을 입력해주세요!',
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
      Swal.fire({
        title: '회원가입 실패.',
        text: '비밀번호와 비밀번호 재입력이 일치하지 않습니다!',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

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

  const clearEmail = () => setEmail('');
  const clearNickname = () => setNickname('');

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]"
      onClick={handleBackgroundClick}
    >
      <div className="rounded-3xl bg-white p-4 w-[40rem] h-[45rem] flex flex-col justify-center items-center">
        <form onSubmit={signUp}>
          <h2 className="text-3xl font-bold mb-4 text-center text-green-600">회원가입</h2>
          <h1 className="text-xl font-bold mb-1">사용할 이메일 주소</h1>
          <div className="relative w-[35rem] mb-4">
            <input
              type="email"
              placeholder="이메일 형식을 지켜서 입력해주세요"
              className="p-2 border rounded-[0.7rem] w-full text-black"
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
          <h1 className="text-xl font-bold mb-1">사용할 비밀번호</h1>
          <div className="relative w-[35rem] mb-4">
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="최소 6글자 이상 입력해주세요."
              className="p-2 border rounded-[0.7rem] w-full text-black"
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
          <h1 className="text-xl font-bold mb-1">비밀번호 재입력</h1>
          <div className="relative w-[35rem] mb-4">
            <input
              type={confirmPasswordVisible ? 'text' : 'password'}
              placeholder="위 비밀번호와 동일하게 입력해주세요"
              className="p-2 border rounded-[0.7rem] w-full text-black"
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
          <h1 className="text-xl font-bold mb-1">닉네임 설정</h1>
          <div className="relative w-[35rem] mb-4">
            <input
              type="text"
              placeholder="플랜트리에서 사용할 별명이에요"
              className="p-2 border rounded-[0.7rem] w-full text-black"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            {nickname && (
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={clearNickname}
              >
                <FaTimes />
              </span>
            )}
          </div>

          {passwordError && <p className="mb-4 text-red-500">{passwordError}</p>}

          <div className="flex flex-col gap-2 mt-4">
            <button
              type="submit"
              className="w-[35rem] h-[5rem] px-4 py-3 font-bold bg-green-600 hover:bg-green-800 hover:text-white text-white rounded-[0.7rem]"
            >
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;
