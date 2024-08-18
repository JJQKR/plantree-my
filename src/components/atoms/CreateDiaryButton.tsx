import { CreateDiaryButtonProps } from '@/types/main';
import React from 'react';
import { FaPlus } from 'react-icons/fa';

const CreateDiaryButton: React.FC<CreateDiaryButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center text-[2.5rem] px-[2rem] py-[0.5rem] sm:px-4 sm:py-4 bg-green-700 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition-all duration-200"
    >
      <FaPlus className="sm:ml-[0.1rem] sm:text-[2.5rem] mr-[0.1rem]" />
      <span className="sm:hidden inline">새 다이어리 생성</span>
    </button>
  );
};

export default CreateDiaryButton;
