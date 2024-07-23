import useMyModalStore from '@/stores/my.modal.store';
import React from 'react';

const BasicModal = () => {
  const { isBadgeModalOpen, toggleBadgeModal } = useMyModalStore((state) => state);

  return (
    <>
      <div className="bg-slate-500" onClick={toggleBadgeModal}></div>
      <div onDoubleClick={(e) => e.stopPropagation}>BasicModal</div>
    </>
  );
};

export default BasicModal;
