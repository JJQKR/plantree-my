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

  const { email } = useUserStore((state) => state);
  const toBack = () => {
    window.history.back();
  };

  return (
    <>
      <div className="w-[128rem] h-[188rem] grid grid-cols-1 justify-items-center ">
        <div className="w-[98rem] h-[161.9rem]">
          <h2 className="w-[98rem] h-[4.8rem] text-[3.2rem] mt-[6.4rem] mb-0 text-black font-bold">
            {' '}
            <button onClick={toBack}>&lt;</button> 마이페이지
          </h2>
          <div className="w-[98rem] h-[64.2rem] mt-[3.2rem] mb-[3.2rem]">
            <GrowthSummary />
            <GardenCarousel />
          </div>
          <div className="w-[98rem] h-[47.3rem] bg-white rounded-[2rem] shadow-md mt-0 p-[4rem]">
            <div className="flex flex-row justify-between mb-[2rem]">
              <h3 className="font-semibold text-[2.6rem] ml-[1rem] h-[3.3rem] mb-[1rem]">
                도전과제 <ObtainedBadgesCount /> / {totalBadges.length}
              </h3>
              <button
                className="font-semibold text-[#008A02] text-[1.8rem] mr-[1rem] hover:underline"
                onClick={handleToggleBadgeModal}
              >
                모든 배지 확인하기
              </button>
              {isBadgeModalOpen && <BadgeModal />}
            </div>
            <BadgeCollection />
          </div>

          <NicknameButton>
            <div className="flex items-center justify-start font-semibold text-[2.6rem] my-[3.2rem] pl-[3.2rem] bg-white rounded-[2rem] shadow-md w-[98rem] h-[9.9rem]">
              <button onClick={handleToggleNicknameModal}>닉네임 변경</button>
              {isNicknameModalOpen && <NicknameModal />}
            </div>
          </NicknameButton>
          <AccountBarButton>
            <div className="flex items-center justify-between  font-semibold text-[2.6rem] my-[3.2rem] pl-[3.2rem] bg-white rounded-[2rem] shadow-md w-[98rem] h-[9.9rem]">
              <button onClick={handleAccountBarModal}>계정 설정</button>
              <p className="mr-[3.2rem]">{email}</p>
              {isAccountBarModalOpen && <AccountBarModal />}
            </div>
          </AccountBarButton>
          <WithdrawalButton>
            <div className="flex items-center justify-start  font-semibold text-[2.6rem] my-[3.2rem] pl-[3.2rem] bg-white rounded-[2rem] shadow-md w-[98rem] h-[9.9rem]">
              <button onClick={handleToggleWithdrawalModal}>회원 탈퇴</button>
              {isWithdrawalModalOpen && <WithdrawalModal />}
            </div>
          </WithdrawalButton>
        </div>
      </div>
    </>
  );
};

export default MyPage;
