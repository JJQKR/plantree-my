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
      <div className="w-[80rem] h-[117.5rem] grid grid-cols-1 justify-items-center ">
        <div className="w-[61.26rem] h-[101.19rem]">
          <h2 className="w-[61.25rem] h-[3rem] text-[2rem] mt-[4rem] mb-0 text-black font-bold">
            {' '}
            <button onClick={toBack}>&lt;</button> 마이페이지
          </h2>
          <div className="w-[61.25rem] h-[40.13rem] shadow-sm mt-[2rem] mb-[2rem]">
            <GrowthSummary />
            <GardenCarousel />
          </div>
          <div className="w-[61.25rem] h-[29.56rem] bg-white rounded-[20px] shadow-md mt-0">
            <div className="flex flex-row justify-between">
              <h3 className="font-semibold text-[1.63rem] ml-[2.5rem] h-[2.06rem] mt-[2rem] mb-[1.25rem]">
                도전과제 <ObtainedBadgesCount /> / {totalBadges.length}
              </h3>
              <button
                className="font-semibold text-[#008A02] text-[1.63rem]  mt-[2rem] mb-[1.25rem] mr-[2.5rem]"
                onClick={handleToggleBadgeModal}
              >
                전체 보기
              </button>
              {isBadgeModalOpen && <BadgeModal />}
            </div>
            <BadgeCollection />
          </div>

          <NicknameButton>
            <div className="flex items-center justify-start font-semibold text-[1.63rem] my-[2rem] pl-[1.25rem] bg-white rounded-[1.25rem] shadow-md w-[61.25rem] h-[7rem]">
              <button onClick={handleToggleNicknameModal}>닉네임 변경</button>
              {isNicknameModalOpen && <NicknameModal />}
            </div>
          </NicknameButton>
          <AccountBarButton>
            <div className="flex items-center justify-between  font-semibold text-[1.63rem] my-[2rem] pl-[1.25rem] bg-white rounded-[1.25rem] shadow-md w-[61.25rem] h-[7rem]">
              <button onClick={handleAccountBarModal}>계정 설정</button>
              <p className="mr-5">{email}</p>
              {isAccountBarModalOpen && <AccountBarModal />}
            </div>
          </AccountBarButton>
          <WithdrawalButton>
            <div className="flex items-center justify-start  font-semibold text-[1.63rem] my-[2rem] pl-[1.25rem] bg-white rounded-[1.25rem] shadow-md w-[61.25rem] h-[7rem]">
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
