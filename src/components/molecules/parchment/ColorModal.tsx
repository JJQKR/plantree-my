`use Client`;

import useMyModalStore from '@/stores/my.modal.store';
import useTodoListStore from '@/stores/todoList.stor';
import React, { useState } from 'react';
import { FaCircle } from 'react-icons/fa';

const ColorModal = () => {
  const { todoId, changeTodoColor } = useTodoListStore();
  const { toggleTenMinPlanerColorModal } = useMyModalStore((state) => state);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      toggleTenMinPlanerColorModal();
    }
  };

  const selectColor = (newColor: string) => {
    changeTodoColor(todoId, newColor);
    toggleTenMinPlanerColorModal();
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
          <div className="text-[#FFCBCB] border-2 rounded-full border-gray-300">
            <FaCircle size={50} onClick={() => selectColor('pink')} />
          </div>
          <div className="text-[#FDFFAB] border-2 rounded-full border-gray-300">
            <FaCircle size={50} onClick={() => selectColor('lemon')} />
          </div>
          <div className="text-[#A1EEBD] border-2 rounded-full border-gray-300">
            <FaCircle size={50} onClick={() => selectColor('greentee')} />
          </div>
          <div className="text-[#7BD3EA] border-2 rounded-full border-gray-300">
            <FaCircle size={50} onClick={() => selectColor('sky')} />
          </div>
          <div className="text-transparent border-2 rounded-full border-gray-300">
            <FaCircle size={50} onClick={() => selectColor('transparent')} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorModal;
