import React from 'react';

const SignupModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white p-4 rounded w-96">
        <h2 className="text-xl font-bold mb-4 text-center">회원가입</h2>
        <input type="text" placeholder="아이디" className="mb-4 p-2 border rounded w-full" />
        <input type="password" placeholder="비밀번호" className="mb-4 p-2 border rounded w-full" />
        <input type="password" placeholder="비밀번호 확인" className="mb-4 p-2 border rounded w-full" />
        <div className="flex flex-col gap-2 mt-4">
          <button className="w-full px-4 py-3 bg-gray-500 text-white rounded" onClick={onClose}>
            취소
          </button>
          <button className="w-full px-4 py-3 bg-blue-500 text-white rounded">회원가입</button>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
