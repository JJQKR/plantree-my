'use client';

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
import { FaChevronLeft } from 'react-icons/fa6';
import { FaChevronRight } from 'react-icons/fa6';
import { FaBook } from 'react-icons/fa';
import useBottomSheetStore from '@/stores/bottomsheet.store';
import Swal from 'sweetalert2';

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
  const { data: pages, isPending, isError } = usePageToDiaryId(diaryId);
  const { mutate: deleteDbPages } = useDeletePages();
  const { mutate: deleteDbDiary } = useDeleteDiary();
  const { offEditMode } = useEditModeStore((state) => state);
  const { currentPageIndex, setCurrentPageIndex } = usePageStore((state) => state);
  const { activeCardIndices, setActiveCardIndices } = useBottomSheetStore((state) => state);

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
    setActiveCardIndices([0, 1]);
    setCurrentPageIndex(0);
  }, [diaryId]);

  // 다이어리를 삭제 :  db diary 삭제 , db pages 삭제 , db cover 삭제, db Parchments 삭제
  const deleteDiary = async () => {
    Swal.fire({
      title: '정말 다이어리를 삭제하시겠습니까?',
      text: '삭제된 내용은 되돌릴 수 없습니다!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '예',
      cancelButtonText: '아니오'
    }).then(async (result) => {
      if (result.isConfirmed) {
        deleteDbDiary(diaryId);
        deleteDbPages(diaryId);
        await supabase.from('diary_covers').delete().eq('diary_id', diaryId);

        const deletionPromises = pages!.map((page) => {
          const tableName = changeDbName(page.parchment_style as ParchmentType) as
            | 'ten_min_planner'
            | 'line_note'
            | 'blank_note';
          return supabase.from(tableName).delete().eq('diary_id', diaryId);
        });

        await Promise.all(deletionPromises);

        Swal.fire({
          title: '삭제 완료!',
          text: '다이어리가 성공적으로 삭제되었습니다.',
          icon: 'success',
          confirmButtonText: 'OK'
        });

        router.replace('/member/hub');
      }
    });
  };

  // 허브로 이동합니다.
  const goHub = () => {
    router.push('/member/hub');
  };

  // 다이어리 표지 수정페이지로 이동합니다.
  const goDiaryCoverPage = () => {
    Swal.fire({
      title: '다이어리 커버를 수정하시겠습니까?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '예',
      cancelButtonText: '아니오'
    }).then((result) => {
      if (result.isConfirmed) {
        router.push(`/member/diary/${diaryId}/cover`);
      }
    });
  };

  // 앞페이지로 이동합니다.
  const handlePrevPage = () => {
    if (currentPageIndex < 1) return;
    if (currentPageIndex % 2 !== 0) {
      setCurrentPageIndex(currentPageIndex - 3);
      setActiveCardIndices([currentPageIndex - 3, currentPageIndex - 2]);
    } else if (currentPageIndex % 2 === 0) {
      setCurrentPageIndex(currentPageIndex - 2);
      setActiveCardIndices([currentPageIndex - 2, currentPageIndex - 1]);
    }
  };

  // 뒷페이지로 이동합니다.
  const handleNextPage = () => {
    if (currentPageIndex + 2 < pages!.length) {
      if (currentPageIndex % 2 !== 0) {
        setCurrentPageIndex(currentPageIndex + 3);
        setActiveCardIndices([currentPageIndex + 3, currentPageIndex + 4]);
      } else if (currentPageIndex % 2 === 0) {
        setCurrentPageIndex(currentPageIndex + 2);
        setActiveCardIndices([currentPageIndex + 2, currentPageIndex + 3]);
      }
    } else if (pages![currentPageIndex]) {
      Swal.fire({
        title: '더이상 페이지가 없습니다. 추가하시겠습니까?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '예',
        cancelButtonText: '아니오'
      }).then((result) => {
        if (result.isConfirmed) {
          toggleParchmentOptionModal();
        }
      });
    }
  };

  if (isPending) {
    return <div>로딩중</div>;
  }
  if (isError) {
    return <div>오류 발생</div>;
  }

  return (
    <div className="flex flex-row items-center justify-center w-[128rem] ">
      <div onClick={handlePrevPage} className="text-[4.8rem] text-[#008A02] cursor-pointer">
        <FaChevronLeft />
      </div>
      <div className=" w-[100rem]">
        <div className="flex flex-row justify-between ">
          <div className="flex flex-row w-[72rem]">
            <span
              className="flex flex-row text-[3.5rem] w-[4.8rem] items-center justify-center cursor-pointer"
              onClick={goHub}
            >
              <FaChevronLeft />
            </span>
            <span className=" text-[3.2rem] w-[82rem] px-[1rem] font-[600]">{coverTitle}</span>
          </div>
          <div className="flex flex-row gap-3">
            <button
              onClick={goDiaryCoverPage}
              className=" w-[10.3rem] h-[5.2rem] border-[0.1rem] rounded-[1.2rem] border-[#008A02] text-[#008A02] text-[1.8rem] cursor-pointer"
            >
              표지수정
            </button>
            <button
              onClick={deleteDiary}
              className=" text-[1.8rem] w-[13.8rem] h-[5.2rem] border-[0.1rem] cursor-pointer rounded-[1.2rem] border-[#D90000] text-[#D90000]"
            >
              다이어리 삭제
            </button>
          </div>
        </div>
        <div className="flex flex-row items-center justify-center">
          <div className="w-[100rem] h-[75rem] mx-[3.6rem] my-[4.3rem]">
            <DiaryContents diaryId={diaryId} currentPageIndex={currentPageIndex} />
          </div>
        </div>
      </div>
      <div onClick={handleNextPage} className="text-[4.8rem] text-[#008A02] cursor-pointer">
        <FaChevronRight />
      </div>
    </div>
  );
}
