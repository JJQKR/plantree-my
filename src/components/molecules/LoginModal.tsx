'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';
import ResetPasswordModal from './ResetPasswordModal';
import useUserStore from '@/stores/user.store';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

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
        window.location.href = 'http://localhost:3000/member/hub';
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

  return (
    <>
      {!showForgotPasswordModal && !showResetPasswordModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]"
          onClick={handleBackgroundClick}
        >
          <div className="bg-white p-4 rounded w-[400px] h-[370px] flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold mb-4 text-center text-emerald-400">Welcome to PlanTree! </h1>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                placeholder="아이디"
                className="mb-2 p-2 border rounded w-full text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="relative w-full">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="비밀번호"
                  className="mb-2 p-2 border rounded w-full text-black"
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
              <h2 className="text-center cursor-pointer text-rose-300" onClick={handleForgotPasswordClick}>
                비밀번호를 잊어버리셨나요?
              </h2>
              <div className="flex flex-col gap-2 mt-4">
                <button
                  type="submit"
                  className="w-[350px] h-[50px] px-4 py-3 font-bold bg-gray-500 hover:bg-gray-700 hover:text-white text-black rounded"
                >
                  로그인
                </button>
                <button
                  type="button"
                  className="w-[350px] h-[50px] py-3 font-bold bg-blue-500 hover:bg-blue-700 hover:text-white text-black rounded"
                  onClick={onSignupClick}
                >
                  회원가입
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
        redirectTo: 'http://localhost:3000/member/reset-password?token=YOUR_TOKEN'
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

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white p-4 rounded w-[400px] h-[370px]  flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold mb-4 text-center text-emerald-400">Welcome to PlanTree! </h1>
        <h2 className="text-2xl font-bold mb-4 text-center text-black">비밀번호 찾기</h2>
        <form onSubmit={handleResetPassword}>
          <input
            type="email"
            placeholder="이메일을 입력하세요."
            className="mb-4 p-2 border rounded w-[300px] text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p className="text-red-500">{error}</p>}
          <h1 className="text-center text-xl text-black">인증 메일을 메일로 전송해드립니다.</h1>
          <div className="flex flex-col gap-2 mt-4">
            <button
              type="button"
              className="w-full font-bold px-4 py-3 bg-gray-500 hover:bg-gray-700 hover:text-white text-black rounded"
              onClick={onClose}
            >
              취소
            </button>
            <button
              type="submit"
              className="w-full font-bold px-4 py-3 bg-blue-500 hover:bg-blue-700 hover:text-white text-black rounded"
            >
              인증메일 받기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
