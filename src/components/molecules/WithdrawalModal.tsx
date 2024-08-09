'use client';

import useMyModalStore from '@/stores/my.modal.store';
import { supabase } from '@/supabase/client';
import React, { useState } from 'react';
import useUserStore from '@/stores/user.store';

const WithdrawalModal: React.FC = () => {
  const { nickname, membershipDays } = useUserStore((state) => state);
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

      // 타입을 무시하기 위해 as any 사용
      const { error: deleteUserError } = await (supabase.rpc as any)('delete_user_account', {});

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
        <div className="bg-white p-9 rounded-[10px] style={{ width: '20em' }}">
          <div onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <div className="text-xl font-bold text-left">회원 탈퇴</div>
              <button className="text-black" onClick={toggleWithdrawalModal} type="button">
                &#10005;
              </button>
            </div>
            <div className="text-lg font-bold mb-4">
              <p>{nickname} 님은</p>
              <p>플랜트리와 {membershipDays}일 동안 기록을 키워나갔어요.</p>

              <p>정말 탈퇴하시겠어요?</p>
              <div className="my-3">
                <p>아래 텍스트를 입력해주세요.</p>
              </div>
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
                <button
                  className="px-4 py-2 w-full text-white rounded"
                  type="submit"
                  disabled={loading}
                  style={{ backgroundColor: '#9E9E9E' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#8A0000')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#9E9E9E')}
                >
                  {loading ? '탈퇴 중...' : '탈퇴하기'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WithdrawalModal;
