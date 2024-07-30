'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase/client';
import useDiaryStore from '@/stores/diary.store'; // Zustand store import

const CreateDiaryPage: React.FC = () => {
  const [diaryName, setDiaryName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const setDiaryId = useDiaryStore((state) => state.setDiaryId); // Zustand store의 setDiaryId 함수 가져오기

  useEffect(() => {
    // 사용자 로그인 세션을 확인하는 함수
    const checkSession = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login'); // 로그인되어 있지 않으면 로그인 페이지로 리다이렉트
      }
    };

    checkSession();
  }, [router]);

  // 다이어리 생성 핸들러
  const handleCreateDiary = async () => {
    if (!diaryName.trim()) {
      setError('다이어리 이름을 입력해 주세요.'); // 다이어리 이름이 비어있는 경우 에러 메시지 설정
      return;
    }

    const {
      data: { session }
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) {
      setError('사용자가 로그인되어 있지 않습니다.'); // 로그인되지 않은 경우 에러 메시지 설정
      return;
    }

    try {
      const { count } = await supabase.from('diaries').select('*', { count: 'exact' }).eq('user_id', user.id);

      const { data: newDiary, error: insertError } = await supabase
        .from('diaries')
        .insert({
          created_at: new Date().toISOString(), // 현재 시간으로 다이어리 생성일 설정
          user_id: user.id,
          bookshelf_order: count || 0, // 현재 사용자의 다이어리 수를 기반으로 순서 설정
          name: diaryName
        })
        .select()
        .single(); // 새로운 다이어리 데이터 가져오기

      if (insertError) throw insertError;

      if (newDiary) {
        setDiaryId(newDiary.id); // Zustand store에 다이어리 ID 저장
      }

      setSuccess('다이어리가 성공적으로 생성되었습니다!');
      setDiaryName('');
      setTimeout(() => {
        router.push('/member');
      }, 1000);
    } catch (error) {
      console.error('다이어리 생성 실패:', error);
      setError('다이어리 생성에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">다이어리 생성</h1>
      <input
        type="text"
        value={diaryName}
        onChange={(e) => setDiaryName(e.target.value)} // 입력 필드 값 변경 시 상태 업데이트
        placeholder="다이어리 이름"
        className="mb-2 p-2 border rounded w-full text-black"
      />
      <button
        onClick={handleCreateDiary} // 버튼 클릭 시 다이어리 생성 핸들러 호출
        className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition duration-300"
      >
        새 다이어리 생성
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>} {/* 에러 메시지 표시 */}
      {success && <p className="text-green-500 mt-2">{success}</p>} {/* 성공 메시지 표시 */}
    </div>
  );
};

export default CreateDiaryPage;
