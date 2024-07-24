'use client';

import React from 'react';
import useMyModalStore from '@/stores/my.modal.store';
import BadgeModal from '../../components/molecules/BadgeModal';
import Garden from '@/components/templates/Garden';
import BadgeCollection from '@/components/templates/BadgeCollection';
import NicknameButton from '@/components/atoms/NicknameButton';
import AccountBar from '@/components/molecules/AccountBar';
import WithdrawalButton from '@/components/atoms/WithdrawalButton';

const MyPage: React.FC = () => {
  const { isBadgeModalOpen, toggleBadgeModal } = useMyModalStore((state) => state);
  const handleToggleBadgeModal = () => {
    toggleBadgeModal();
  };

  return (
    <>
      <div>
        <Garden>
          <h2>씨앗 밍밍밍 님의 정원</h2>
        </Garden>
      </div>
      <div>
        <BadgeCollection>
          <div>
            <div>
              <h2>획득한 배지</h2>
              <button className="bg-purple-400" onClick={handleToggleBadgeModal}>
                배지 전체 보기
              </button>
              {isBadgeModalOpen && <BadgeModal />}
            </div>
          </div>
        </BadgeCollection>
      </div>
      <NicknameButton />
      <AccountBar>
        <div>내가 account bar의 자식이다!!!!!!</div>
      </AccountBar>
      <WithdrawalButton />

      {/* 
        <button onClick={toggleNicknameModal}>Toggle Nickname Modal</button>
        {isNicknameModalOpen && <div>Nickname Modal Content</div>}

        <button onClick={toggleWithdrawalModal}>Toggle Withdrawal Modal</button>
        {isWithdrawalModalOpen && <div>Withdrawal Modal Content</div>} */}
    </>
  );
};

export default MyPage;
