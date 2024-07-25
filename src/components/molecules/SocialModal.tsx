import React from 'react';

const SocialModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white p-4 rounded w-96">
        <h1 className="text-xl font-bold mb-4 text-center text-emerald-400">Welcome to PlanTree! </h1>
        <h2 className="text-xl font-bold mb-4 text-center text-black">소셜 로그인</h2>
        <div className="flex flex-col gap-2 mt-4">
          <button className="w-full px-4 py-3 font-bold bg-green-500 text-black rounded">네이버 로그인</button>
          <button className="w-full px-4 py-3 font-bold bg-yellow-300 text-black rounded">카카오톡 로그인</button>
          <button className="w-full px-4 py-3 font-bold bg-red-500  text-black rounded">구글 로그인</button>
          <button className="w-full px-4 py-3 bg-gray-500 text-white rounded" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialModal;
