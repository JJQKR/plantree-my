import useMyModalStore from '@/stores/my.modal.store';
import React, { useState } from 'react';

const NicknameModal: React.FC = () => {
  const { isNicknameModalOpen, toggleNicknameModal } = useMyModalStore((state) => state);
  const [nickname, setNickname] = useState('');
  const handleBackGroundClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      toggleNicknameModal();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        onClick={handleBackGroundClick}
      >
        <div className="bg-white p-4 rounded">
          <div className="flex flex-col-3 jutify-between">
            <div onClick={(e) => e.stopPropagation()}>
              <h1 className="text-xl font-bold mb-4 text-center text-emerald-400">닉네임 변경하기</h1>

              <input
                type="text"
                placeholder="새 닉네임 입력"
                className="mb-4 p-2 border rounded w-full text-black"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
              <div className="flex flex-col gap-2">
                <button className="px-4 py-2 bg-red-400 w-full text-white rounded" onClick={toggleNicknameModal}>
                  취소
                </button>
                <form>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-400 w-full text-white rounded"
                    onSubmit={toggleNicknameModal}
                  >
                    저장
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NicknameModal;
