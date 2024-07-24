import useMyModalStore from '@/stores/my.modal.store';
import React from 'react';

const BadgeModal: React.FC = () => {
  const { isBadgeModalOpen, toggleBadgeModal } = useMyModalStore((state) => state);

  return (
    <>
      <div className="bg-slate-500" onClick={toggleBadgeModal}></div>
      <div onClick={(e) => e.stopPropagation}>BadgeModal</div>
    </>
  );
};

export default BadgeModal;
