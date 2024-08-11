'use client';

import useMyModalStore from '@/stores/my.modal.store';
import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/supabase/client';
import useUserStore from '@/stores/user.store'; // 유저 상태 관리 스토어 추가

const NicknameModal: React.FC = () => {
  const { isNicknameModalOpen, toggleNicknameModal } = useMyModalStore((state) => state);
  const { nickname, setNickname } = useUserStore((state) => state);
  // 유저 상태 관리 스토어에서 닉네임 가져오기
  const nicknameRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const {
          data: { user },
          error: userError
        } = await supabase.auth.getUser();
        if (userError) throw userError;

        if (user) {
          const { data, error } = await supabase.from('users').select('nickname').eq('id', user.id).single();
          if (error) {
            console.error('닉네임 페치 실패:', error);
          } else {
            console.log('닉네임 페치 성공:', data.nickname);
            if (data.nickname !== null) {
              setNickname(data.nickname); // 전역 상태에 닉네임 설정
            }
          }
        }
      } catch (error) {
        console.error('유저 가져오기 실패:', error);
      }
    };

    fetchNickname();
  }, [setNickname]);

  const handleBackGroundClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      toggleNicknameModal();
    }
  };

  const handleNicknameSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (nicknameRef.current) {
      const newNickname = nicknameRef.current.value.trim();
      if (newNickname.length < 2 || newNickname.length > 9) {
        setError('닉네임은 최소 2글자, 최대 9글자입니다.');
        return;
      }

      try {
        const {
          data: { user },
          error: userError
        } = await supabase.auth.getUser();
        if (userError) throw userError;

        if (user) {
          const { error } = await supabase.auth.updateUser({ data: { display_name: newNickname } });
          if (error) {
            console.error('닉네임 업데이트 실패:', error);
          } else {
            console.log('닉네임 업데이트 성공:', newNickname);
            setNickname(newNickname); // 전역 상태에 닉네임 업데이트
            toggleNicknameModal();
          }
        }
      } catch (error) {
        console.error('닉네임 업데이트 중 오류 발생:', error);
      }
    }
  };

  return (
    <>
      {isNicknameModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          // onClick={handleBackGroundClick}
        >
          <div className="bg-white p-[2.5rem] rounded-[10px] w-[31.25rem] h-[17.25rem]">
            <div onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-[1.75rem]">
                <h1 className="text-[1.63rem] font-bold text-left text-black">닉네임 변경</h1>
                <button className="text-black" onClick={toggleNicknameModal} type="button">
                  &#10005;
                </button>
              </div>
              <form className="flex flex-col" onSubmit={handleNicknameSubmit}>
                <input
                  type="text"
                  placeholder="새 닉네임 입력"
                  className="mb-[1.75rem] p-3 border rounded-[5px] w-full text-black text-[1.13rem]"
                  ref={nicknameRef}
                  defaultValue={nickname ?? ''}
                />
                {error && <p className="text-red-500">{error}</p>}
                <div className="flex flex-col mb-[2.5rem]">
                  <button
                    type="submit"
                    className="w-full h-[3.25rem] text-white text-[1.13rem] rounded-[5px] mb-[2.5rem]"
                    style={{ backgroundColor: '#9E9E9E' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#008A02')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#9E9E9E')}
                  >
                    변경하기
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NicknameModal;
