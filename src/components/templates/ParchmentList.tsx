'use client';

import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';
import { RiDeleteBin5Line } from 'react-icons/ri';
import DiaryContents from './diarycreate/DiaryContents';
import { useEffect, useState } from 'react';
import { getCover } from '@/services/diarycover.service';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/supabase/client';
import useParchmentModalStore from '@/stores/parchment.modal.store';
import { useDeletePages, usePageToDiaryId } from '@/lib/hooks/usePages';
import { useDeleteDiary } from '@/lib/hooks/useDiaries';
import usePageStore from '@/stores/pages.store';
import useEditModeStore from '@/stores/editMode.store';

// const isParchmentStyle = (value: 'tenMinPlanner' | 'lineNote' | 'blankNote') => {
//   return ['tenMinPlanner', 'lineNote', 'blankNote'].includes(value);
// };

type ParchmentType = 'tenMinPlanner' | 'lineNote' | 'blankNote';

const changeDbName = (parchmentStyle: ParchmentType) => {
  const dbTableName = {
    tenMinPlanner: 'ten_min_planner',
    lineNote: 'line_note',
    blankNote: 'blank_note'
  };
  return dbTableName[parchmentStyle];
};

export default function ParchmentList() {
  const router = useRouter();
  const { diaryId } = useParams<{ diaryId: string }>();
  const [coverTitle, setCoverTitle] = useState('');
  const { toggleParchmentOptionModal } = useParchmentModalStore((state) => state);
  const { pages, setPages } = usePageStore((state) => state);
  const { data: dbPages, isPending, isError } = usePageToDiaryId(diaryId);
  const { mutate: deleteDbPages } = useDeletePages();
  const { mutate: deleteDbDiary } = useDeleteDiary();
  const { offEditMode } = useEditModeStore((state) => state);

  // 커버 타이틀 가져오는 코드
  useEffect(() => {
    if (diaryId) {
      const getCoverTitle = async () => {
        const diaryCover = await getCover(diaryId);
        setCoverTitle(diaryCover.cover_title);
      };
      getCoverTitle();
    }
    offEditMode();
  }, [diaryId]);

  // 현재 페이지 index
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // 다이어리를 삭제 :  db diary 삭제 , db pages 삭제 , db cover 삭제, db Parchments 삭제
  const deleteDiary = async () => {
    const confirmDeleteDiary = confirm('정말 다이어리를 삭제하시겠습니까? 되돌릴 수 없습니다.');
    if (confirmDeleteDiary) {
      deleteDbDiary(diaryId);
      deleteDbPages(diaryId);
      await supabase.from('diary_covers').delete().eq('diary_id', diaryId);

      const deletionPromises = pages.map((page) => {
        const tableName = changeDbName(page.parchment_style as ParchmentType) as
          | 'ten_min_planner'
          | 'line_note'
          | 'blank_note';
        return supabase.from(tableName).delete().eq('diary_id', diaryId);
      });

      await Promise.all(deletionPromises);

      alert('다이어리가 삭제 되었습니다.');
      router.replace('/member/hub');
    }
  };

  // 허브로 이동합니다.
  const goHub = () => {
    router.push('/member/hub');
  };

  // 다이어리 표지 수정페이지로 이동합니다.
  const goDiaryCoverPage = () => {
    router.push(`/member/diary/${diaryId}/cover`);
  };

  // 앞페이지로 이동합니다.
  const handlePrevPage = () => {
    if (currentPageIndex > 1) {
      setCurrentPageIndex(currentPageIndex - 2);
    } else if (currentPageIndex === 1) {
      setCurrentPageIndex(0); // 첫 페이지로 이동하려는 경우
    }
  };

  // 뒷페이지로 이동합니다.
  const handleNextPage = () => {
    console.log({ currentPageIndex });
    if (currentPageIndex + 2 < dbPages!.length) {
      setCurrentPageIndex(currentPageIndex + 2);
    } else if (dbPages![currentPageIndex]) {
      if (confirm('더이상 페이지가 없습니다. 추가하시겠습니까?')) {
        toggleParchmentOptionModal();
      }
    }
  };

  if (isPending) {
    <div>로딩중</div>;
  }
  if (isError) return;

  return (
    <div className="flex flex-row items-center bg-green-400">
      <div onClick={handlePrevPage}>
        <IoIosArrowBack />
      </div>
      <div>
        <div className="flex flex-row justify-between ">
          <div className="flex flex-row" onClick={goHub}>
            <IoIosArrowBack />
            <h2>{coverTitle}</h2>
          </div>
          <div className="flex flex-row gap-3">
            <div onClick={goDiaryCoverPage}>표지 수정하러 가기</div>
            <div onClick={deleteDiary}>
              <RiDeleteBin5Line />
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          <div className="w-[91.6rem] h-[60rem] border-2 border-gray-500">
            <DiaryContents diaryId={diaryId} pageIndex={currentPageIndex} />
          </div>
        </div>
      </div>
      <div onClick={handleNextPage}>
        <IoIosArrowForward />
      </div>
    </div>
  );
}
