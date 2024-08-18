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
      <div className="w-[128rem] h-[178rem] sm:w-[42.8rem] sm:h-[107.7rem] grid grid-cols-1 justify-items-center max-w-[128rem] sm:max-w-[48rem] mt-[8rem] sm:mt-[4.8rem]">
        <div className="w-[98rem] h-[147.5rem] sm:w-[38rem] sm:h-[87.635]">
          <div className="flex flex-row w-[98rem] h-[3.5rem] sm:w-[38rem] sm:h-[2.5rem] text-[2.8rem] sm:text-[2rem] mt-[6.808rem] mb-[2.4rem] sm:mt-[4.8rem] sm:mb-[1.6rem] text-black font-bold">
            <button onClick={toBack} className="items-center">
              <FaChevronLeft className="text-[3.2rem] sm:text-[2rem] text-[#008A02] mt-[0.5rem] mr-[1.2rem] sm:mt-[0.2rem] sm:mr-[0.6rem]" />
            </button>
            <h2>마이페이지</h2>
          </div>
          <div className="w-[98rem] h-[62.8rem] sm:w-[38rem] sm:h-[28.3rem] mt-[2.4rem] mb-[2.4rem] sm:mt-[1.6rem] sm:mb-[1.6rem]">
            <GrowthSummary />
            <GardenCarousel />
          </div>
          <div className="w-[98rem] h-[43rem] sm:w-[38rem] sm:h-[29.735rem] bg-white rounded-[2rem] shadow-md mt-0 py-[3.2rem] px-[4rem] sm:py-[1.6rem] sm:px-[2.4rem]">
            <div className="flex justify-stretch mb-[1.2rem]">
              <h3 className="font-semibold text-[2.4rem] sm:text-[1.8rem] h-[3.3rem] sm:h-[2.3rem]">도전과제</h3>
              <p className="text-[1.8rem] sm:text-[1.3rem] mt-[0.4rem] ml-[1.2rem] font-semibold">
                <ObtainedBadgesCount /> / {totalBadges.length}
              </p>
              <button
                className="font-semibold text-[#008A02] text-[1.6rem] ml-[61rem] sm:ml-[10rem] sm:text-[1.2rem] hover:underline"
                onClick={handleToggleBadgeModal}
              >
                모든 배지 확인하기
              </button>

              {/* <div className="flex justify-stretch items-center mb-[1.4rem]">
                <h2 className="font-semibold text-[2.8rem] ml-[1rem]">도전과제</h2>
                <p className="font-semibold ml-[1.6rem]">
                  <ObtainedBadgesCount /> / {totalBadges.length}
                </p>
              </div> */}

              {isBadgeModalOpen && <BadgeModal />}
            </div>
            <BadgeCollection />
          </div>

          <div className="flex items-center justify-between font-semibold text-[2.4rem] sm:text-[1.8rem] my-[2.4rem] pl-[2.8rem] sm:my-[2rem] sm:pl-[2.4rem] bg-white rounded-[2rem] shadow-md w-[98rem] h-[8.6rem] sm:w-[38rem] sm:h-[6.3rem]">
            <p>계정 정보</p>
            <p className="text-[2rem] sm:text-[1.5rem] mr-[2.4rem] sm:mr-[2.4rem]">{email}</p>
            {/* {isAccountBarModalOpen && <AccountBarModal />} */}
          </div>

          <NicknameButton>
            <button
              onClick={handleToggleNicknameModal}
              className="flex items-center justify-between  font-semibold text-[2.4rem] sm:text-[1.8rem] my-[2.4rem] pl-[2.8rem] sm:my-[2rem] sm:pl-[2.4rem] bg-white rounded-[2rem] shadow-md w-[98rem] h-[8.6rem] sm:w-[38rem] sm:h-[6.3rem]"
            >
              <div>닉네임 변경</div>
              <div className="text-[#008A02]">
                <FaChevronRight className="text-[3.2rem] mr-[2.8rem] sm:text-[2.4rem] sm:mr-[2.4rem]" />
              </div>
              {isNicknameModalOpen && <NicknameModal />}
            </button>
          </NicknameButton>
          <WithdrawalButton>
            <button
              onClick={handleToggleWithdrawalModal}
              className="flex items-center justify-between font-semibold text-[2.4rem] sm:text-[1.8rem] my-[2.4rem] pl-[2.8rem] sm:my-[2rem] sm:pl-[2.4rem] bg-white rounded-[2rem] shadow-md w-[98rem] h-[8.6rem] sm:w-[38rem] sm:h-[6.3rem]"
            >
              <div>회원 탈퇴</div>
              <div className="text-[#008A02]">
                <FaChevronRight className="text-[3.2rem] mr-[2.8rem] sm:text-[2.4rem] sm:mr-[2.4rem]" />
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
