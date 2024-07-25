import React, { useState } from 'react';
import { supabase } from '../../supabase/client';

const LoginModal: React.FC<{ onClose: () => void; onSignupClick: () => void }> = ({ onClose, onSignupClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

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

  const handleResetPasswordClick = () => {
    setShowResetPasswordModal(true);
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

  const handleSignIn = async () => {
    try {
      const data = await signIn(email, password);
      console.log('로그인 성공:', data);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('로그인 실패:', error);
      setError(error instanceof Error ? error.message : 'An error occurred.');
    }
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
              className="mb-4 p-2 border rounded w-full text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500">{error}</p>}
            <h2 className="text-center cursor-pointer text-rose-300" onClick={handleForgotPasswordClick}>
              비밀번호를 잊어버리셨나요?
            </h2>
            <div className="flex flex-col gap-2 mt-4">
              <button className="w-full px-4 py-3 font-bold bg-gray-500 text-black rounded" onClick={handleSignIn}>
                로그인
              </button>
              <button className="w-full px-4 py-3 font-bold bg-blue-500 text-black rounded" onClick={onSignupClick}>
                회원가입
              </button>
            </div>
          </div>
        </div>
      )}
      {showForgotPasswordModal && <ForgotPasswordModal onClose={handleForgotPasswordClose} />}
      {showResetPasswordModal && <ResetPasswordModal onClose={handleResetPasswordClose} />}
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

  const handleResetPassword = async () => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setMessage('인증번호가 이메일로 전송되었습니다.');
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
          <button className="w-full px-4 py-3 bg-gray-500 text-white rounded" onClick={onClose}>
            취소
          </button>
          <button className="w-full px-4 py-3 bg-blue-500 text-white rounded" onClick={handleResetPassword}>
            인증번호 받기
          </button>
        </div>
      </div>
    </div>
  );
};

const ResetPasswordModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const { data, error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage('비밀번호가 성공적으로 변경되었습니다.');
      setError(null);
      setTimeout(onClose, 2000);
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
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
        <h2 className="text-xl font-bold mb-4 text-center text-black">비밀번호 재설정</h2>
        <input
          type="password"
          placeholder="새 비밀번호를 입력하세요."
          className="mb-4 p-2 border rounded w-full text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호를 다시 입력하세요."
          className="mb-4 p-2 border rounded w-full text-black"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-col gap-2 mt-4">
          <button className="w-full px-4 py-3 bg-gray-500 text-white rounded" onClick={onClose}>
            취소
          </button>
          <button className="w-full px-4 py-3 bg-blue-500 text-white rounded" onClick={handleResetPassword}>
            비밀번호 변경
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
