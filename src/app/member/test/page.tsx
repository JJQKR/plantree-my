'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase/client';
import useDiaryStore from '@/stores/diary.store';

const CreateDiaryPage: React.FC = () => {
  // 상태 정의
  const [diaryName, setDiaryName] = useState<string>(''); // 다이어리 이름 상태
  const [error, setError] = useState<string | null>(null); // 에러 메시지 상태
  const [success, setSuccess] = useState<string | null>(null); // 성공 메시지 상태
  const router = useRouter();

  // Zustand store에서 필요한 상태와 함수 가져오기
  const { setDiaryId, addDiary, fetchDiaries } = useDiaryStore((state) => ({
    setDiaryId: state.setDiaryId,
    addDiary: state.addDiary,
    fetchDiaries: state.fetchDiaries
  }));

  // 컴포넌트가 마운트되었을 때 실행되는 useEffect
  useEffect(() => {
    const checkSession = async () => {
      // 현재 세션 가져오기
      const {
        data: { session }
      } = await supabase.auth.getSession();
      if (!session) {
        setError('로그인되어 있지 않습니다.');
      }
    };
    checkSession();
  }, []);

  // 다이어리 생성 핸들러
  const handleCreateDiary = async () => {
    // 다이어리 이름이 비어있는 경우
    if (!diaryName.trim()) {
      setError('다이어리 이름을 입력해 주세요.');
      return;
    }

    // 현재 세션 및 사용자 정보 가져오기
    const {
      data: { session }
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) {
      setError('사용자가 로그인되어 있지 않습니다.');
      return;
    }

    try {
      // 사용자의 다이어리 개수 가져오기
      const { count } = await supabase.from('diaries').select('*', { count: 'exact' }).eq('user_id', user.id);

      // 새로운 다이어리 삽입
      const { data: newDiary, error: insertError } = await supabase
        .from('diaries')
        .insert({
          created_at: new Date().toISOString(),
          user_id: user.id,
          bookshelf_order: count || 0,
          name: diaryName
        })
        .select()
        .single();

      if (insertError) throw insertError;

      if (newDiary) {
        // Zustand store에 새 다이어리 추가 및 목록 새로고침
        setDiaryId(newDiary.id);
        addDiary(newDiary);
        await fetchDiaries();
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
        onChange={(e) => setDiaryName(e.target.value)}
        placeholder="다이어리 이름"
        className="mb-2 p-2 border rounded w-full text-black"
      />
      <button onClick={handleCreateDiary} className="p-2 bg-blue-500 text-white rounded">
        생성하기
      </button>
      {error && <div className="mt-2 text-red-500">{error}</div>}
      {success && <div className="mt-2 text-green-500">{success}</div>}
    </div>
  );
};

export default CreateDiaryPage;
