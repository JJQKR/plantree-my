'use client';

import React from 'react';
import useMyModalStore from '@/stores/my.modal.store';
import BadgeModal from '@/components/molecules/BadgeModal';
import BadgeCollection from '@/components/templates/BadgeCollection';
import NicknameButton from '@/components/atoms/NicknameButton';
import AccountBar from '@/components/molecules/AccountBar';
import WithdrawalButton from '@/components/atoms/WithdrawalButton';
import NicknameModal from '@/components/molecules/NicknameModal';
import WithdrawalModal from '@/components/molecules/WithdrawalModal';
import BadgeCards from '@/components/molecules/BadgeCards';
import GrowthSummary from '@/components/templates/GrowthSummary';
import GardenCarousel from '@/components/templates/GardenCarousel';
import { totalBadges } from '@/components/atoms/TotalBadges';

const MyPage: React.FC = () => {
  const {
    isBadgeModalOpen,
    toggleBadgeModal,
    isNicknameModalOpen,
    toggleNicknameModal,
    isWithdrawalModalOpen,
    toggleWithdrawalModal
  } = useMyModalStore((state) => state);

  const handleToggleBadgeModal = () => {
    toggleBadgeModal();
  };
  const handleToggleNicknameModal = () => {
    toggleNicknameModal();
  };

  const handleToggleWithdrawalModal = () => {
    toggleWithdrawalModal();
  };

  return (
    <>
      <div>
        <GrowthSummary />
        <GardenCarousel />

        <div>
          <div className="flex flex-row justify-between max-w-[600px] mt-4 mb-1">
            <h2 className="font-semibold ml-1">
              도전과제 {} / {totalBadges.length}
            </h2>
            <button className="font-semibold rounded-[5px] mr-1" onClick={handleToggleBadgeModal}>
              전체 보기
            </button>
            {isBadgeModalOpen && <BadgeModal />}
          </div>
        </div>
        <BadgeCollection />

        <NicknameButton>
          <div className="flex items-center justify-start mt-3 pl-3 p-2 bg-white rounded-[10px] shadow-md w-[600px] h-[50px]">
            <button onClick={handleToggleNicknameModal}>닉네임 변경</button>

            {isNicknameModalOpen && <NicknameModal />}
          </div>
        </NicknameButton>
        <AccountBar />
        <WithdrawalButton>
          {' '}
          <div className="flex items-center justify-start mt-3 pl-3 p-2 bg-white rounded-[10px] shadow-md w-[600px] h-[50px]">
            <button onClick={handleToggleWithdrawalModal}>회원 탈퇴</button>
            {isWithdrawalModalOpen && <WithdrawalModal />}
          </div>
        </WithdrawalButton>
      </div>
    </>
  );
};

export default MyPage;
