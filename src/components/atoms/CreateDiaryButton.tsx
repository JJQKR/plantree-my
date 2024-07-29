import { CreateDiaryButtonProps } from '@/types/main';
import React from 'react';
import { BsFeather } from 'react-icons/bs';

const CreateDiaryButton: React.FC<CreateDiaryButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick} // 버튼 클릭 시 onClick 함수 실행
      className="px-4 py-2 bg-green-700 font-bold text-white w-[270px] text-[25px] rounded-lg shadow hover:bg-blue-700 transition-all duration-200 flex items-center"
    >
      새 다이어리 생성
      <BsFeather className="ml-4 " />
    </button>
  );
};

export default CreateDiaryButton;
