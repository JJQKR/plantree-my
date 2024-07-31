import useMyModalStore from '@/stores/my.modal.store';
import { supabase } from '@/supabase/client';
import React, { useState } from 'react';

const WithdrawalModal: React.FC = () => {
  const { isWithdrawalModalOpen, toggleWithdrawalModal } = useMyModalStore((state) => state);
  const handleBackGroundClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      toggleWithdrawalModal();
    }
  };

  const [goodbye, setGoodbye] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (goodbye !== '플랜트리잘있어') {
      alert('입력한 값이 일치하지 않습니다. 다시 시도해주세요.');
      return;
    }

    setLoading(true);

    try {
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        alert('사용자 정보를 찾을 수 없습니다.');
        setLoading(false);
        return;
      }

      const { error: deleteUserError } = await supabase.rpc('delete_user_account');

      if (deleteUserError) {
        alert('회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.');
      } else {
        alert('회원 탈퇴가 완료되었습니다.');
        toggleWithdrawalModal();
        // 추가로 로그아웃 처리
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('회원 탈퇴 중 오류 발생:', error);
      alert('회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={handleBackGroundClick}
      >
        <div className="bg-white p-4 rounded-[10px]">
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
              disabled={loading}
            />
            <div className="flex flex-col gap-2">
              <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <button className="px-4 py-2 bg-red-400 w-full text-white rounded" type="submit" disabled={loading}>
                  {loading ? '탈퇴 중...' : '탈퇴하기'}
                </button>
              </form>
              <button
                className="px-4 py-2 bg-red-400 w-full text-white rounded"
                onClick={toggleWithdrawalModal}
                disabled={loading}
              >
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
