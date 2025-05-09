'use client';

import useMyModalStore from '@/stores/my.modal.store';
import { supabase } from '@/supabase/client';
import React, { useState } from 'react';
import useUserStore from '@/stores/user.store';
import Swal from 'sweetalert2';
import { FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const WithdrawalModal: React.FC = () => {
  const { nickname, membershipDays } = useUserStore((state) => state);
  const { isWithdrawalModalOpen, toggleWithdrawalModal } = useMyModalStore((state) => state);
  // const handleBackGroundClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  //   if (e.target === e.currentTarget) {
  //     toggleWithdrawalModal();
  //   }
  // };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ') {
      e.preventDefault(); // 스페이스바의 기본 동작 방지
    }
  };

  const router = useRouter();
  const redirectToHome = () => {
    router.push('/');
  };

  const [goodbye, setGoodbye] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (goodbye !== '안녕플랜트리') {
      Swal.fire({
        title: '탈퇴 실패',
        text: '입력값이 일치하지 않습니다.',
        icon: 'error',
        confirmButtonText: '확인'
      });

      return;
    }

    setLoading(true);

    try {
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        Swal.fire({
          title: '탈퇴 실패',
          text: '사용자 정보를 찾을 수 없습니다.',
          icon: 'error',
          confirmButtonText: '확인'
        });

        return;
      }
      setLoading(false);

      // 타입을 무시하기 위해 as any 사용
      const { error: deleteUserError } = await (supabase.rpc as any)('delete_user_account', {});

      if (deleteUserError) {
        Swal.fire({
          title: '탈퇴 실패',
          text: '회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.',
          icon: 'error',
          confirmButtonText: '확인'
        });

        return;
      } else {
        Swal.fire({
          title: '탈퇴 완료',
          text: '회원 탈퇴가 완료되었습니다.',
          icon: 'success',
          confirmButtonText: '확인'
        });

        toggleWithdrawalModal();
        redirectToHome();
        // 추가로 로그아웃 처리
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('회원 탈퇴 중 오류 발생:', error);
      Swal.fire({
        title: '탈퇴 실패',
        text: '회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.',
        icon: 'error',
        confirmButtonText: '확인'
      });

      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isWithdrawalModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onKeyDown={handleKeyDown}
          // onClick={handleBackGroundClick}
        >
          <div className="bg-white p-[4rem] rounded-[2rem] w-[46rem] h-[38.5rem] sm:w-[38rem] sm:h-[30rem] sm:p-[2.4rem]">
            <div onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-[2.4rem] sm:text-[2rem] h-[4rem] sm:h-[2.5rem]">회원 탈퇴</h2>
                <button
                  className="text-[#008A02] font-bold text-[2.2rem] mb-[1.45rem]"
                  onClick={toggleWithdrawalModal}
                  type="button"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="flex-col text-start text-[1.8rem] sm:text-[1.6rem] font-semibold">
                <p>{nickname} 님은</p>
                <p>플랜트리와 {membershipDays}일 동안 함께 했어요.</p>
                <div className="">
                  <p>&#39;안녕플랜트리&#39;를 입력하시면 탈퇴됩니다.</p>
                </div>
                <p className="text-[#D90000] text-[1.64rem] sm:text-[1.53rem] mt-[1.2rem] sm:mt-[0.5rem]">
                  &#10033;이후 정보복구가 어려우니 미리 저장해주세요.
                </p>
              </div>

              <div className="flex flex-col">
                <form className="flex flex-col" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="안녕플랜트리"
                    className="mt-[2.4rem] sm:mt-[1.6rem] pl-[1rem] border rounded-[1.2rem] w-full h-[5.2rem] sm:h-[3.6rem] text-[1.8rem] sm:text-[1.6rem] text-black"
                    value={goodbye}
                    onChange={(e) => setGoodbye(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    className="w-full h-[5.2rem] sm:h-[3.6rem] text-[#720000] text-[1.8rem] sm:text-[1.6rem] rounded-[1.2rem] mt-[1.2rem] sm:mt-[0.8rem]"
                    style={{ backgroundColor: '#FFE5E5' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#D90000';
                      e.currentTarget.style.color = 'white'; // 텍스트 색깔을 white로 변경
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFE5E5';
                      e.currentTarget.style.color = '#720000'; // 텍스트 색깔을 #720000으로 변경
                    }}
                  >
                    탈퇴하기
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WithdrawalModal;
