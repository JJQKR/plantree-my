import useColorStore from '@/stores/color.stor';
import useMyModalStore from '@/stores/my.modal.store';
import React, { useState } from 'react';
import { FaCircle } from 'react-icons/fa';

const ColorModal = () => {
  const { toggleTenMinPlanerColorModal } = useMyModalStore((state) => state);
  const { saveColor, color: newColor } = useColorStore((state) => state);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      toggleTenMinPlanerColorModal();
    }
  };

  const selectColor = (color: string) => {
    saveColor(color);
    toggleTenMinPlanerColorModal();
  };
  console.log(newColor);
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
          <div className="text-red-300">
            <FaCircle size={50} onClick={() => selectColor('red-300')} />
          </div>
          <div className="text-amber-200">
            <FaCircle size={50} onClick={() => selectColor('amber-200')} />
          </div>
          <div className="text-green-300">
            <FaCircle size={50} onClick={() => selectColor('green-200')} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorModal;
