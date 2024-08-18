import { CreateDiaryButtonProps } from '@/types/main';
import React from 'react';
import { FaPlus } from 'react-icons/fa';

const CreateDiaryButton: React.FC<CreateDiaryButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center md:w-[27rem] md:text-[2.5rem] md:px-[2rem] md:py-[0.5rem] px-4 py-4 bg-green-700 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition-all duration-200"
    >
      <FaPlus className="ml-[0.1rem] text-[2.5rem] md:mr-[1rem]" />
      <span className="hidden md:inline">새 다이어리 생성</span>
    </button>
  );
};

export default CreateDiaryButton;
