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
      <div className="w-[128rem] h-[178rem] grid grid-cols-1 justify-items-center max-w-[128rem] mt-[8rem]">
        <div className="w-[98rem] h-[147.5rem]">
          <div className="flex flex-row w-[98rem] h-[3.5rem] text-[2.8rem] mt-[6.808rem] mb-[2.4rem] text-black font-bold">
            <button onClick={toBack} className="items-center">
              <FaChevronLeft className="text-[3.2rem] text-[#008A02] mt-[0.5rem] mr-[1.2rem]" />
            </button>
            <h2>마이페이지</h2>
          </div>
          <div className="w-[98rem] h-[62.8rem] mt-[2.4rem] mb-[2.4rem]">
            <GrowthSummary />
            <GardenCarousel />
          </div>
          <div className="w-[98rem] h-[43rem] bg-white rounded-[2rem] shadow-md mt-0 py-[3.2rem] px-[4rem]">
            <div className="flex flex-row justify-between mb-[1.2rem]">
              <h3 className="font-semibold text-[2.4rem] h-[3.3rem]">
                도전과제 <ObtainedBadgesCount /> / {totalBadges.length}
              </h3>
              <button
                className="font-semibold text-[#008A02] text-[1.6rem] hover:underline"
                onClick={handleToggleBadgeModal}
              >
                모든 배지 확인하기
              </button>
              {isBadgeModalOpen && <BadgeModal />}
            </div>
            <BadgeCollection />
          </div>

          <div className="flex items-center justify-between  font-semibold text-[2.4rem] my-[2.4rem] pl-[2.8rem] bg-white rounded-[2rem] shadow-md w-[98rem] h-[8.6rem]">
            <p>계정 정보</p>
            <p className="text-[2rem] mr-[2.4rem]">{email}</p>
            {/* {isAccountBarModalOpen && <AccountBarModal />} */}
          </div>

          <NicknameButton>
            <button
              onClick={handleToggleNicknameModal}
              className="flex items-center justify-between  font-semibold text-[2.4rem] my-[2.4rem] pl-[2.8rem] bg-white rounded-[2rem] shadow-md w-[98rem] h-[8.6rem]"
            >
              <div>닉네임 변경</div>
              <div className="text-[#008A02]">
                <FaChevronRight className="text-[3.2rem] mr-[2.8rem]" />
              </div>
              {isNicknameModalOpen && <NicknameModal />}
            </button>
          </NicknameButton>
          <WithdrawalButton>
            <button
              onClick={handleToggleWithdrawalModal}
              className="flex items-center justify-between  font-semibold text-[2.4rem] my-[2.4rem] pl-[2.8rem] bg-white rounded-[2rem] shadow-md w-[98rem] h-[8.6rem] "
            >
              <div>회원 탈퇴</div>
              <div className="text-[#008A02]">
                <FaChevronRight className="text-[3.2rem] mr-[2.8rem]" />
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
