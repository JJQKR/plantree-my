import useMyModalStore from '@/stores/my.modal.store';
import React, { useState } from 'react';

const WithdrawalModal: React.FC = () => {
  const { isWithdrawalModalOpen, toggleWithdrawalModal } = useMyModalStore((state) => state);

  const handleBackGroundClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      toggleWithdrawalModal();
    }
  };

  const [goodbye, setGoodbye] = useState('');
  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        onClick={handleBackGroundClick}
      >
        <div className="bg-white p-4 rounded">
          <div onClick={(e) => e.stopPropagation()}>
            <div className="text-xl font-bold mb-4">
              <p>정말 탈퇴하시겠어요?</p>
              <p>아래 텍스트를 입력해주세요.</p>
            </div>
            <input
              type="text"
              placeholder="플랜트리잘있어"
              className="mb-4 p-2 border rounded w-full text-black"
              value={goodbye}
              onChange={(e) => setGoodbye(e.target.value)}
            />

            <div className="flex flex-col gap-2">
              <form className="flex flex-col gap-2">
                <button className="px-4 py-2 bg-red-400 w-full text-white rounded" onSubmit={toggleWithdrawalModal}>
                  탈퇴하기
                </button>
              </form>
              <button className="px-4 py-2 bg-red-400 w-full text-white rounded" onClick={toggleWithdrawalModal}>
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default WithdrawalModal;
