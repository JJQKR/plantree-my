'use client';

import useMyModalStore from '@/stores/my.modal.store';
import React from 'react';
import BasicModal from './BasicModal';

const MyPage: React.FC = () => {
  const { isBadgeModalOpen, toggleBadgeModal } = useMyModalStore((state) => state);
  const handleToggleBadgeModal = () => {
    toggleBadgeModal();
  };

  // e : React.MouseEventHandler<HTMLButtonElement>
  return (
    <>
      <div>myPage</div>
      <div>
        <button className="bg-purple-400" onClick={handleToggleBadgeModal}>
          배지 모달 버튼
        </button>
        {isBadgeModalOpen && <BasicModal />}
        {/* 
        <button onClick={toggleNicknameModal}>Toggle Nickname Modal</button>
        {isNicknameModalOpen && <div>Nickname Modal Content</div>}

        <button onClick={toggleWithdrawalModal}>Toggle Withdrawal Modal</button>
        {isWithdrawalModalOpen && <div>Withdrawal Modal Content</div>} */}
      </div>
    </>
  );
};

export default MyPage;
