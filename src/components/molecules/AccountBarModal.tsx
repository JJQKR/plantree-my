'use client';

import useMyModalStore from '@/stores/my.modal.store';
import React, { useEffect, useState } from 'react'; // useEffect를 여기서 명시적으로 import
import { supabase } from '@/supabase/client';
import useUserStore from '@/stores/user.store'; // 유저 상태 관리 스토어 추가

const AccountBarModal: React.FC = () => {
  const { isAccountBarModalOpen, toggleAccountBarModal } = useMyModalStore((state) => state);
  const { email, setEmail, provider, setProvider } = useUserStore((state) => state);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const {
          data: { user },
          error: userError
        } = await supabase.auth.getUser();
        if (userError) throw userError;

        if (user) {
          if (user.email) {
            setEmail(user.email); // 전역 상태에 이메일 설정
          }
          if (user.app_metadata && user.app_metadata.provider) {
            setProvider(user.app_metadata.provider); // 전역 상태에 제공자 설정
          }
        }
      } catch (error) {
        console.error('유저 가져오기 실패:', error);
      }
    };

    fetchUserInfo();
  }, [setEmail, setProvider]);

  const handleBackGroundClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      toggleAccountBarModal();
    }
  };

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault(); // 폼의 기본 동작을 막음
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('로그아웃 실패:', error);
    } else {
      setIsLoggedIn(false);
      window.location.href = '/'; // 홈 페이지로 리다이렉션
    }
  };

  return (
    <>
      {isAccountBarModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleBackGroundClick}
        >
          <div className="bg-white p-[4rem] rounded-[2rem] w-[46rem] h-[29.9rem]">
            <div onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center">
                <h2 className="text-[2.8rem] font-bold text-left text-black">계정 정보</h2>
                <button
                  className="text-[#008A02] font-bold text-[2.8rem]"
                  onClick={toggleAccountBarModal}
                  type="button"
                >
                  &#10005;
                </button>
              </div>
              <div className="flex flex-col my-[2rem]">
                <p className="text-black text-[2.4rem] font-normal">계정 : {email}</p>
                <p className="text-black text-[2.4rem] font-normal ">로그인 경로 : {provider}</p>
                <div className="flex flex-col gap-2">
                  <form onSubmit={handleLogout}>
                    <button
                      type="submit"
                      className="w-full h-[5.2rem] mt-[2.4rem] text-white text-[1.8rem] rounded-[1.2rem]"
                      style={{ backgroundColor: '#9E9E9E' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#D90000';
                        e.currentTarget.style.color = 'white'; // 텍스트 색깔을 white로 변경
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFE5E5';
                        e.currentTarget.style.color = '#720000'; // 텍스트 색깔을 #720000으로 변경
                      }}
                    >
                      로그아웃
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountBarModal;
