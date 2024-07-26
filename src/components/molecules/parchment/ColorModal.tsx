import useMyModalStore from '@/stores/my.modal.store';
import React from 'react';
import { FaCircle } from 'react-icons/fa';

const ColorModal = () => {
  const { toggleTenMinPlanerColorModal } = useMyModalStore((state) => state);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      toggleTenMinPlanerColorModal();
    }
  };

  return (
    <div
      onClick={handleOutsideClick}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
    >
      <div className="relative bg-white rounded-[2.5rem] w-96 h-96 ">
        ColorModal
        <button onClick={toggleTenMinPlanerColorModal} className="absolute top-3 right-4 text-gray-500 p-1 text-2xl">
          ✕
        </button>
        <div className="flex flex-row">
          <FaCircle size={50} color="FFC5C5" />
          <FaCircle size={50} color="FDFFAB" />
          <FaCircle size={50} color="D8EFD3" />
        </div>
      </div>
    </div>
  );
};

export default ColorModal;
