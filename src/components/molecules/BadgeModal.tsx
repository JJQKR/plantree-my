import React from 'react';
import useMyModalStore from '@/stores/my.modal.store';
import BadgeCards from './BadgeCards';
import FetchDiaryCount from '@/lib/utils/FetchDiaryCount';
import FetchMembershipDays from '@/lib/utils/FetchMembershipDays';
import ObtainedBadgesCount from '../atoms/ObtainedBadges';
import { totalBadges } from '../atoms/TotalBadges';

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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={handleBackGroundClick}
      >
        <div className="bg-white p-[2.5rem] rounded-[2rem] w-[94.8rem] h-[81.2rem]">
          <div onClick={(e) => e.stopPropagation()} className="h-full overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-[2.8rem] ml-[2rem] h-[4rem] mb-[1rem]">
                도전과제 <ObtainedBadgesCount /> / {totalBadges.length}
              </h2>
              <button
                className="text-[#008A02] font-bold text-[2.8rem] pt-[1.5rem] mb-[3.2rem] mr-[2rem]"
                onClick={toggleBadgeModal}
                type="button"
              >
                &#10005;
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
