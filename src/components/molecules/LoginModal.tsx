import React, { useState } from 'react';

const LoginModal: React.FC<{ onClose: () => void; onSignupClick: () => void }> = ({ onClose, onSignupClick }) => {
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

  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  return (
    <>
      {!showForgotPasswordModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleBackgroundClick}
        >
          <div className="bg-white p-4 rounded">
            <h1 className="text-xl font-bold mb-4 text-center text-emerald-400">Welcome to PlanTree! </h1>
            <h2 className="text-xl font-bold mb-4">로그인</h2>
            <input type="text" placeholder="아이디" className="mb-2 p-2 border rounded w-full" />
            <input type="password" placeholder="비밀번호" className="mb-4 p-2 border rounded w-full" />
            <h2 className="text-center cursor-pointer text-rose-300" onClick={handleForgotPasswordClick}>
              비밀번호를 잊어버리셨나요?
            </h2>
            <div className="flex justify-center gap-10 mt-2">
              <div className="w-14 h-14 bg-gray-300 rounded-full"></div>
              <div className="w-14 h-14 bg-gray-300 rounded-full"></div>
              <div className="w-14 h-14 bg-gray-300 rounded-full"></div>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <button className="w-full px-4 py-3 bg-green-500 text-white rounded" onClick={onSignupClick}>
                회원가입 하기
              </button>
              <button className="w-full px-4 py-3 bg-blue-500 text-white rounded">로그인</button>
              <button className="w-full px-4 py-3 bg-gray-500 text-white rounded" onClick={onClose}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
      {showForgotPasswordModal && <ForgotPasswordModal onClose={handleForgotPasswordClose} />}
    </>
  );
};

const ForgotPasswordModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded w-96">
        <h2 className="text-xl font-bold mb-4 text-center">비밀번호 찾기</h2>
        <input type="email" placeholder="이메일을 입력하세요." className="mb-4 p-2 border rounded w-full" />
        <h1 className="text-center text-xs">인증번호를 메일로 전송해드립니다.</h1>
        <div className="flex flex-col gap-2 mt-4">
          <button className="w-full px-4 py-3 bg-gray-500 text-white rounded" onClick={onClose}>
            취소
          </button>
          <button className="w-full px-4 py-3 bg-blue-500 text-white rounded">인증번호 받기</button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
