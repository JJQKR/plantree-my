import React from 'react';
import useMyModalStore from '@/stores/my.modal.store';
import BadgeCards from './BadgeCards';
import FetchDiaryCount from '@/lib/utils/FetchDiaryCount';
import FetchMembershipDays from '@/lib/utils/FetchMembershipDays';
import ObtainedBadgesCount from '../atoms/ObtainedBadges';
import { totalBadges } from '../atoms/TotalBadges';
import { FaTimes } from 'react-icons/fa';

const BadgeModal: React.FC = () => {
  const { isBadgeModalOpen, toggleBadgeModal } = useMyModalStore((state) => state);

  const handleBackGroundClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      toggleBadgeModal();
    }
  };

  if (!isBadgeModalOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50"
        onClick={handleBackGroundClick}
      >
        <div className="bg-white p-[4rem] sm:px-[2.4rem] sm:py-[1.6rem] rounded-[2rem] sm:rounded-[1.8rem] w-[94.8rem] h-[81.2rem] sm:w-[38rem] sm:h-[79.805rem]">
          <div onClick={(e) => e.stopPropagation()} className="h-full">
            <div className="flex justify-stretch items-center mb-[1.4rem] sm:mb-[0.2rem]">
              <h2 className="font-semibold text-[2.8rem] sm:text-[1.8rem] ml-[1rem]">도전과제</h2>
              <p className="font-semibold text-[2rem] sm:text-[1.3rem] ml-[1.6rem] sm:ml-[0.8rem] mt-[0.3rem] sm:mt-[0.1rem]">
                <ObtainedBadgesCount /> / {totalBadges.length}
              </p>
              <button
                className="text-[#008A02] ml-[65.5rem] sm:ml-[18.8rem] font-bold text-[2.75rem] sm:text-[1.65rem]"
                onClick={toggleBadgeModal}
                type="button"
              >
                <FaTimes />
              </button>
            </div>
            <BadgeCards />
          </div>
        </div>
      </div>
      <FetchDiaryCount />
      <FetchMembershipDays />
    </>
  );
};

export default BadgeModal;
