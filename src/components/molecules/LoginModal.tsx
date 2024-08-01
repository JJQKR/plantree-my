'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';
import ResetPasswordModal from './ResetPasswordModal';

const LoginModal: React.FC<{ onClose: () => void; onSignupClick: () => void }> = ({ onClose, onSignupClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

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

    //ID와 비밀번호가 저장되어 있으면, 로컬스토리지에서 불러와서 상태에 저장

    if (savedAutoLogin && savedEmail && savedPassword) {
      handleSignIn(savedEmail, savedPassword, true);
    }
  }, [location]);

  //자동 로그인이 설정되어 있고, ID와 비밀번호가 저장되어 있으면, 자동으로 로그인

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
    if (error) throw error;
    return data;
  };

  const handleSignIn = async (email: string, password: string, fromAutoLogin = false) => {
    try {
      const data = await signIn(email, password);
      console.log('로그인 성공:', data);
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
      onClose();
      window.location.reload();
      window.location.href = 'http://localhost:3000/member';
    } catch (error) {
      console.error('로그인 실패:', error);
      setError(error instanceof Error ? error.message : 'An error occurred.');
    }
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await handleSignIn(email, password);
  };

  return (
    <>
      {!showForgotPasswordModal && !showResetPasswordModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]"
          onClick={handleBackgroundClick}
        >
          <div className="bg-white p-4 rounded">
            <h1 className="text-xl font-bold mb-4 text-center text-emerald-400">Welcome to PlanTree! </h1>
            <h2 className="text-xl font-bold mb-4 text-center text-black">로그인</h2>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                placeholder="아이디"
                className="mb-2 p-2 border rounded w-full text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="비밀번호"
                className="mb-2 p-2 border rounded w-full text-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center ml-1">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    className="mr-2"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="rememberMe" className="text-black">
                    아이디, 패스워드 기억하기
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
                    자동 로그인
                  </label>
                </div>
              </div>
              <h2 className="text-center cursor-pointer text-rose-300" onClick={handleForgotPasswordClick}>
                비밀번호를 잊어버리셨나요?
              </h2>
              <div className="flex flex-col gap-2 mt-4">
                <button type="submit" className="w-full px-4 py-3 font-bold bg-gray-500 text-black rounded">
                  로그인
                </button>
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
    } catch (error) {
      console.error('비밀번호 재설정 실패:', error);
      setMessage(null);
      setError(error instanceof Error ? error.message : 'An error occurred.');
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white p-4 rounded w-96">
        <h1 className="text-xl font-bold mb-4 text-center text-emerald-400">Welcome to PlanTree! </h1>
        <h2 className="text-xl font-bold mb-4 text-center text-black">비밀번호 찾기</h2>
        <form onSubmit={handleResetPassword}>
          <input
            type="email"
            placeholder="이메일을 입력하세요."
            className="mb-4 p-2 border rounded w-full text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {message && <p className="text-green-500">{message}</p>}
          {error && <p className="text-red-500">{error}</p>}
          <h1 className="text-center text-xs">인증번호를 메일로 전송해드립니다.</h1>
          <div className="flex flex-col gap-2 mt-4">
            <button type="button" className="w-full px-4 py-3 bg-gray-500 text-white rounded" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="w-full px-4 py-3 bg-blue-500 text-white rounded">
              인증번호 받기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
