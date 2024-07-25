import useMyModalStore from '@/stores/my.modal.store';
import React, { useRef } from 'react';

const NicknameModal: React.FC = () => {
  const { isNicknameModalOpen, toggleNicknameModal } = useMyModalStore((state) => state);
  const nicknameRef = useRef<HTMLInputElement>(null);

  const handleBackGroundClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      toggleNicknameModal();
    }
  };

  const handleNicknameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (nicknameRef.current) {
      const newNickname = nicknameRef.current.value;
      toggleNicknameModal();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0  z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={handleBackGroundClick}
      >
        <div className="bg-white p-4 rounded">
          <div onClick={(e) => e.stopPropagation()}>
            <h1 className="text-xl font-bold mb-4 text-left text-emerald-400">닉네임 변경하기</h1>
            <form className="flex flex-col gap-2" onSubmit={handleNicknameSubmit}>
              <input
                type="text"
                placeholder="새 닉네임 입력"
                className="mb-4 p-2 border rounded w-full text-black"
                ref={nicknameRef}
              />

              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-400 w-full text-white rounded"
                  // onSubmit={toggleNicknameModal}
                >
                  저장
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <button className="px-4 py-2 bg-red-400 w-full text-white rounded" onClick={toggleNicknameModal}>
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NicknameModal;
