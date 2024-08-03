import React from 'react';
import useMyModalStore from '@/stores/my.modal.store';
import BadgeCards from './BadgeCards';
import FetchDiaryCount from '@/lib/utils/FetchDiaryCount';
import FetchMembershipDays from '@/lib/utils/FetchMembershipDays';

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
        <div className="bg-white p-4 rounded-[10px] w-[500px] h-[500px]">
          <div onClick={(e) => e.stopPropagation()} className="h-full overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">도전과제 확인 1/9</h2>
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
