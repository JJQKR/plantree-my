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
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        onClick={handleBackGroundClick}
      >
        <div className="bg-white p-4 rounded">
          <div onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">내가 획득한 배지들이 쫙 보여요</h2>

            <div className="flex flex-col-3 jutify-between">
              <BadgeCard />
              <BadgeCard />
              <BadgeCard />
            </div>
            <button className="px-4 py-2 bg-gray-500 text-white rounded" onClick={toggleBadgeModal}>
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BadgeModal;
