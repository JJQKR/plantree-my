import { CreateDiaryButtonProps } from '@/types/main';
import React from 'react';

const CreateDiaryButton: React.FC<CreateDiaryButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick} // 버튼 클릭 시 onClick 함수 실행
      className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-700 transition duration-300"
    >
      새 다이어리 생성
    </button>
  );
};

export default CreateDiaryButton;
