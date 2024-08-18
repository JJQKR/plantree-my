'use client';

import useMyModalStore from '@/stores/my.modal.store';
import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/supabase/client';
import useUserStore from '@/stores/user.store'; // 유저 상태 관리 스토어 추가
import Swal from 'sweetalert2';

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

  // const handleBackGroundClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  //   if (e.target === e.currentTarget) {
  //     toggleNicknameModal();
  //   }
  // };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ') {
      e.preventDefault(); // 스페이스바의 기본 동작 방지
    }
  };

  const handleNicknameSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (nicknameRef.current) {
      const newNickname = nicknameRef.current.value.trim();
      if (newNickname.length < 2 || newNickname.length > 9) {
        Swal.fire({
          title: '변경 실패',
          text: '닉네임은 최소 2글자, 최대 9글자입니다.',
          icon: 'error',
          confirmButtonText: '확인'
        });

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
            Swal.fire({
              title: '변경 성공',
              text: '닉네임 변경에 성공했습니다!',
              icon: 'success',
              confirmButtonText: '확인'
            });
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
          onKeyDown={handleKeyDown}
        >
          <div className="bg-white rounded-[2rem] w-[46rem] h-[28.1rem] p-[4rem]" onClick={(e) => e.stopPropagation()}>
            <div onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-[2.4rem] h-[4rem]">닉네임 변경</h2>
                <button
                  className="text-[#008A02] font-bold text-[2.2rem] mb-[1rem]"
                  onClick={toggleNicknameModal}
                  type="button"
                >
                  &#10005;
                </button>
              </div>
              <p className="text-[1.8rem] mt-[0.6rem] mb-[1.6rem]">원하시는 닉네임을 입력 후 버튼을 눌러주세요.</p>
              <form className="flex flex-col" onSubmit={handleNicknameSubmit}>
                <input
                  type="text"
                  placeholder="새 닉네임 입력"
                  className="mb-[1rem] p-[1rem] border rounded-[1.2rem] h-[5.2rem] w-full text-black text-[1.8rem]"
                  ref={nicknameRef}
                  defaultValue={nickname ?? ''}
                />
                {error && <p className="text-red-500">{error}</p>}
                <div className="flex flex-col mb-[2.5rem]">
                  <button
                    type="submit"
                    className="w-full h-[5.2rem] bg-[#8AC98B] text-white text-[1.8rem] rounded-[1.2rem]"
                    style={{ backgroundColor: '##8AC98B' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#008A02')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#8AC98B')}
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
