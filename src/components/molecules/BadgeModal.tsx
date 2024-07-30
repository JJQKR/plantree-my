import BadgeCard from '@/components/atoms/BadgeCard';
import useMyModalStore from '@/stores/my.modal.store';
import React from 'react';

const BadgeModal: React.FC = () => {
  const { isBadgeModalOpen, toggleBadgeModal } = useMyModalStore((state) => state);

  const handleBackGroundClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      toggleBadgeModal();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={handleBackGroundClick}
      >
        <div className="bg-white p-4  rounded">
          <div onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">도전과제 확인 1/15</h2>
            <div className="grid grid-cols-3 gap-2 place-content-center h-[500px] overflow-y-auto">
              <BadgeCard />
              <BadgeCard />
              <BadgeCard />
              <BadgeCard />
              <BadgeCard />
              <BadgeCard />
              <BadgeCard />
              <BadgeCard />
              <BadgeCard />
              <BadgeCard />
              <BadgeCard />
              <BadgeCard />
              <BadgeCard />
              <BadgeCard />
              <BadgeCard />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BadgeModal;
