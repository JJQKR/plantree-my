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
// import AccountBarButton from '@/components/atoms/AccountBarButton';
import useUserStore from '@/stores/user.store';
// import AccountBarModal from '@/components/molecules/AccountBarModal';
import { FaChevronLeft } from 'react-icons/fa';
import { FaChevronRight } from 'react-icons/fa';

const MyPage: React.FC = () => {
  const {
    isBadgeModalOpen,
    toggleBadgeModal,
    isNicknameModalOpen,
    toggleNicknameModal,
    isWithdrawalModalOpen,
    toggleWithdrawalModal
    // isAccountBarModalOpen,
    // toggleAccountBarModal
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

  // const handleAccountBarModal = () => {
  //   toggleAccountBarModal();
  // };

  const { email } = useUserStore((state) => state);
  const toBack = () => {
    window.history.back();
  };

  return (
    <>
      <div className="w-[128rem] h-[188rem] grid grid-cols-1 justify-items-center max-w-[128rem] ">
        <div className="w-[98rem] h-[158.2rem]">
          <div className="flex flex-row w-[98rem] h-[4.8rem] text-[3.2rem] mt-[6.4rem] mb-0 text-black font-bold">
            <button onClick={toBack} className="items-center">
              <FaChevronLeft className="text-[4rem] mr-[1.2rem]" />
            </button>
            <h2>마이페이지</h2>
          </div>
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

          <div className="flex items-center justify-between  font-semibold text-[2.8rem] my-[3.2rem] pl-[4rem] bg-white rounded-[2rem] shadow-md w-[98rem] h-[9.9rem]">
            <p>계정 설정</p>
            <p className="mr-[4rem]">{email}</p>
            {/* {isAccountBarModalOpen && <AccountBarModal />} */}
          </div>

          <NicknameButton>
            <button
              onClick={handleToggleNicknameModal}
              className="flex items-center justify-between font-semibold text-[2.8rem] my-[3.2rem] pl-[4rem] bg-white rounded-[2rem] shadow-md w-[98rem] h-[9.9rem]
            "
            >
              <div>닉네임 변경</div>
              <div className="text-[#008A02]">
                <FaChevronRight className="text-[4rem] mr-[4rem]" />
              </div>
              {isNicknameModalOpen && <NicknameModal />}
            </button>
          </NicknameButton>
          <WithdrawalButton>
            <button
              onClick={handleToggleWithdrawalModal}
              className="flex items-center justify-between font-semibold text-[2.8rem] my-[3.2rem] pl-[4rem] bg-white rounded-[2rem] shadow-md w-[98rem] h-[9.9rem]"
            >
              <div>회원 탈퇴</div>
              <div className="text-[#008A02]">
                <FaChevronRight className="text-[4rem] mr-[4rem]" />
              </div>
              {isWithdrawalModalOpen && <WithdrawalModal />}
            </button>
          </WithdrawalButton>
        </div>
      </div>
    </>
  );
};

export default MyPage;
