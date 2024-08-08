'use client';

import React from 'react';
import useMyModalStore from '@/stores/my.modal.store';
import BadgeModal from '@/components/molecules/BadgeModal';
import BadgeCollection from '@/components/templates/BadgeCollection';
import NicknameButton from '@/components/atoms/NicknameButton';
import WithdrawalButton from '@/components/atoms/WithdrawalButton';
import NicknameModal from '@/components/molecules/NicknameModal';
import WithdrawalModal from '@/components/molecules/WithdrawalModal';
import GrowthSummary from '@/components/templates/GrowthSummary';
import GardenCarousel from '@/components/templates/GardenCarousel';
import { totalBadges } from '@/components/atoms/TotalBadges';
import ObtainedBadgesCount from '@/components/atoms/ObtainedBadges';
import AccountBarButton from '@/components/atoms/AccountBarButton';
import useUserStore from '@/stores/user.store';
import AccountBarModal from '@/components/molecules/AccountBarModal';

const MyPage: React.FC = () => {
  const {
    isBadgeModalOpen,
    toggleBadgeModal,
    isNicknameModalOpen,
    toggleNicknameModal,
    isWithdrawalModalOpen,
    toggleWithdrawalModal,
    isAccountBarModalOpen,
    toggleAccountBarModal
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

  const handleAccountBarModal = () => {
    toggleAccountBarModal();
  };

  const { email } = useUserStore((state) => state); // email 속성만 추출

  return (
    <>
      <div className="w-[80rem] h-[117.5rem] grid grid-cols-1 justify-items-center ">
        <div className="my-5 w-[61.25rem] h-[40.13rem] shadow-sm ">
          <GrowthSummary />
          <GardenCarousel />
        </div>
        <div className="w-[61.25rem] h-[29.56rem] bg-white rounded-[20px] shadow-md">
          <div className="flex flex-row justify-between mt-4 mb-1">
            <h2 className="font-semibold ml-10">
              도전과제 <ObtainedBadgesCount /> / {totalBadges.length}
            </h2>
            <button className="font-semibold text-[#008A02] rounded-[5px] mr-10" onClick={handleToggleBadgeModal}>
              전체 보기
            </button>
            {isBadgeModalOpen && <BadgeModal />}
          </div>
          <BadgeCollection />
        </div>

        <NicknameButton>
          <div className="flex items-center justify-start mt-3 pl-3 p-2 bg-white rounded-[10px] shadow-md w-[600px] h-[50px]">
            <button onClick={handleToggleNicknameModal}>닉네임 변경</button>
            {isNicknameModalOpen && <NicknameModal />}
          </div>
        </NicknameButton>
        <AccountBarButton>
          <div className="flex items-center justify-between mt-3 pl-3 p-2 bg-white rounded-[10px] shadow-md w-[600px] h-[50px]">
            <button onClick={handleAccountBarModal}>계정 설정</button>
            <p className="mr-5">{email}</p>
            {isAccountBarModalOpen && <AccountBarModal />}
          </div>
        </AccountBarButton>
        <WithdrawalButton>
          <div className="flex items-center justify-start my-3 pl-3 p-2 bg-white rounded-[10px] shadow-md w-[600px] h-[50px]">
            <button onClick={handleToggleWithdrawalModal}>회원 탈퇴</button>
            {isWithdrawalModalOpen && <WithdrawalModal />}
          </div>
        </WithdrawalButton>
      </div>
    </>
  );
};

export default MyPage;
