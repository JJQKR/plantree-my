'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';
import ResetPasswordModal from './ResetPasswordModal';
import useUserStore from '@/stores/user.store';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import ForgotPasswordModal from './ForgotPasswordModal';

const LoginModal: React.FC<{ onClose: () => void; onSignupClick: () => void }> = ({ onClose, onSignupClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const setUserId = useUserStore((state) => state.setUserId);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    if (token) {
      setResetToken(token);
      setShowResetPasswordModal(true);
    }

    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');
    const savedAutoLogin = localStorage.getItem('autoLogin') === 'true';

    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }

    if (savedAutoLogin && savedEmail && savedPassword) {
      handleSignIn(savedEmail, savedPassword, true);
    }
  }, [location]);

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPasswordModal(true);
  };

  const handleForgotPasswordClose = () => {
    setShowForgotPasswordModal(false);
  };

  const handleResetPasswordClose = () => {
    setShowResetPasswordModal(false);
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  };

  // 이메일 형식 검사 함수
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 로그인 처리 함수
  const handleSignIn = async (email: string, password: string, fromAutoLogin = false) => {
    try {
      // 이메일과 비밀번호가 비어 있는지 확인
      if (!email || !password) {
        Swal.fire({
          title: '로그인 실패',
          text: '아이디와 비밀번호를 입력해주세요!',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      }

      // 이메일 형식 검사
      if (!isValidEmail(email)) {
        Swal.fire({
          title: '로그인 실패',
          text: '아이디는 이메일 형식이어야 합니다!',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      }

      const { data, error } = await signIn(email, password);

      // 오류가 있는 경우
      if (error) {
        if (error.message === 'Invalid login credentials') {
          // 아이디가 존재하지 않는 경우
          Swal.fire({
            title: '로그인 실패',
            text: '아이디, 비밀번호를 다시 한 번 확인 해주세요!',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        } else {
          // 기타 로그인 오류
          Swal.fire({
            title: '로그인 실패',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
        return;
      }

      // 비밀번호가 일치하지 않는 경우
      if (!data.user) {
        Swal.fire({
          title: '로그인 실패',
          text: '비밀번호가 일치하지 않습니다!',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      }

      setUserId(data.user.id);
      console.log('로그인 성공:', data.user);
      if (rememberMe) {
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
      } else {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
      }
      if (autoLogin) {
        localStorage.setItem('autoLogin', 'true');
      } else if (!fromAutoLogin) {
        localStorage.removeItem('autoLogin');
      }
      Swal.fire({
        title: '로그인 성공!',
        text: 'PlanTree 에 오신 것을 환영합니다!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        onClose();
        window.location.reload();
        window.location.href = '/member/hub';
      });
    } catch (error) {
      console.error('로그인 실패:', error);
      setError(error instanceof Error ? error.message : 'An error occurred.');
      Swal.fire({
        title: '로그인 실패',
        text: '다시 시도해주세요!',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await handleSignIn(email, password);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const clearEmail = () => setEmail('');

  const handleSignupClick = () => {
    onClose();
    onSignupClick();
  };

  return (
    <>
      {!showForgotPasswordModal && !showResetPasswordModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]"
          onClick={handleBackgroundClick}
        >
          <div className="bg-white p-4 rounded-3xl w-[40rem] h-[37rem] flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold mb-4 text-center text-green-600"> 이메일 로그인 </h1>
            <form onSubmit={handleFormSubmit}>
              <h2 className="text-xl font-bold mb-1">이메일 주소</h2>
              <div className="relative w-full mb-2">
                <input
                  type="text"
                  placeholder="아이디 (이메일)"
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
              <h2 className="text-xl font-bold mb-1">비밀번호</h2>
              <div className="relative w-full">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="비밀번호"
                  className="mb-2 p-2 border rounded-[0.7rem] w-full text-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center ml-1">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    className="mr-2"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="rememberMe" className="text-black mr-5">
                    계정정보 기억하기
                  </label>
                </div>
                <div className="flex items-center mr-2">
                  <input
                    type="checkbox"
                    id="autoLogin"
                    className="mr-2"
                    checked={autoLogin}
                    onChange={(e) => setAutoLogin(e.target.checked)}
                  />
                  <label htmlFor="autoLogin" className="text-black">
                    자동로그인
                  </label>
                </div>
              </div>
              <h2
                className="text-center cursor-pointer text-green-600 underline hover:text-green-800"
                onClick={handleForgotPasswordClick}
              >
                비밀번호를 잊어버리셨나요?
              </h2>
              <div className="flex flex-col gap-2 mt-4">
                <button
                  type="button"
                  className="w-[35rem] h-[5rem] py-[0.3rem] font-bold text-green-600 bg-white hover:bg-gray-100 rounded-[0.7rem] border-2 border-green-600"
                  onClick={handleSignupClick}
                >
                  회원가입
                </button>
                <button
                  type="submit"
                  className="w-[35rem] h-[5rem] px-[0.4rem] py-[0.3rem] font-bold bg-green-600 hover:bg-green-700 hover:text-white text-white rounded-[0.7rem] border-1 border-black "
                >
                  로그인
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showForgotPasswordModal && <ForgotPasswordModal onClose={handleForgotPasswordClose} />}
      {showResetPasswordModal && <ResetPasswordModal token={resetToken} onClose={handleResetPasswordClose} />}
    </>
  );
};

export default LoginModal;
