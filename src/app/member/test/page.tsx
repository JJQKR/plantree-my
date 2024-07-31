'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase/client';
import useDiaryStore from '@/stores/diary.store';

const CreateDiaryPage: React.FC = () => {
  const [diaryName, setDiaryName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const { setDiaryId, addDiary, fetchDiaries } = useDiaryStore((state) => ({
    setDiaryId: state.setDiaryId,
    addDiary: state.addDiary,
    fetchDiaries: state.fetchDiaries
  }));

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      if (!session) {
        setError('로그인되어 있지 않습니다.');
      }
    };
    checkSession();
  }, []);

  const handleCreateDiary = async () => {
    if (!diaryName.trim()) {
      setError('다이어리 이름을 입력해 주세요.');
      return;
    }

    const {
      data: { session }
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) {
      setError('사용자가 로그인되어 있지 않습니다.');
      return;
    }

    try {
      const { count } = await supabase.from('diaries').select('*', { count: 'exact' }).eq('user_id', user.id);

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
        setDiaryId(newDiary.id);
        addDiary(newDiary); // 새로 생성한 다이어리 추가
        await fetchDiaries(); // 다이어리 목록 새로고침
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
