'use client';

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
import { FaChevronCircleRight } from 'react-icons/fa';
import { FaChevronCircleLeft } from 'react-icons/fa';
import useBottomSheetStore from '@/stores/bottomsheet.store';
import Swal from 'sweetalert2';
import PcParchmentCase from './PcParchmentCase';
import MoParchmentCase from './MoParchmentCase';

type ParchmentType = 'tenMinPlanner' | 'lineNote' | 'blankNote';

const changeDbName = (parchmentStyle: ParchmentType) => {
  const dbTableName = {
    tenMinPlanner: 'ten_min_planner',
    lineNote: 'line_note',
    blankNote: 'blank_note'
  };
  return dbTableName[parchmentStyle];
};

export default function ParchmentPageFrame() {
  const router = useRouter();
  const { diaryId } = useParams<{ diaryId: string }>();
  const [coverTitle, setCoverTitle] = useState('');
  const { toggleParchmentOptionModal } = useParchmentModalStore((state) => state);
  const { data: pages, isPending, isError } = usePageToDiaryId(diaryId);
  const { mutate: deleteDbPages } = useDeletePages();
  const { mutate: deleteDbDiary } = useDeleteDiary();
  const { offEditMode } = useEditModeStore((state) => state);
  const { currentPageIndex, setCurrentPageIndex } = usePageStore((state) => state);
  const { setActiveCardIndices } = useBottomSheetStore((state) => state);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
  const goToHub = () => {
    router.push('/member/hub');
  };

  // 다이어리 표지 수정페이지로 이동합니다.
  const goToDiaryCoverPage = () => {
    router.push(`/member/diary/${diaryId}/cover`);
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

  const addPage = () => {
    toggleParchmentOptionModal();
  };

  if (isPending) {
    return <div>로딩중</div>;
  }
  if (isError) {
    return <div>오류 발생</div>;
  }

  return (
    <div className="flex flex-row items-center justify-center w-[37.8rem] md:w-[128rem] mt-[9.9rem]">
      <div
        onClick={handlePrevPage}
        className={`text-[2rem] md:text-[3.2rem] cursor-pointer ${
          currentPageIndex < 2 ? 'text-[#BEBEBE]' : 'text-[#008A02]'
        }`}
      >
        <FaChevronCircleLeft />
      </div>
      <div className="w-[37.8rem] md:w-[90rem] md:mx-[4.3rem]">
        <div className="flex flex-col gap-[1.2rem] md:flex-row md:justify-between ">
          <div className="flex flex-row w-[72rem]">
            <span
              className="flex flex-row text-[2.4rem] md:text-[3.5rem] w-[2.4rem] md:w-[4.8rem] items-center justify-center cursor-pointer text-[#008A02]"
              onClick={goToHub}
            >
              <FaChevronLeft />
            </span>
            <span className="text-[2rem] md:text-[3.2rem] w-[50rem] px-[1rem] font-[600]">{coverTitle}</span>
          </div>
          <div className="flex flex-row gap-3 justify-end ">
            <button
              onClick={addPage}
              className="w-[5.5rem] h-[2.8rem] md:w-[9.2rem] md:h-[4.8rem] border-[0.1rem] rounded-[0.8rem] md:rounded-[1rem] border-[#565656] text-[#565656] text-[1.1rem] md:text-[1.6rem] cursor-pointer"
            >
              속지추가
            </button>
            <button
              onClick={goToDiaryCoverPage}
              className="w-[5.5rem] h-[2.8rem] md:w-[9.2rem] md:h-[4.8rem] border-[0.1rem] rounded-[0.8rem] md:rounded-[1rem] border-[#008A02] text-[#008A02] text-[1.1rem] md:text-[1.6rem] cursor-pointer"
            >
              표지수정
            </button>
            <button
              onClick={deleteDiary}
              className=" w-[7.6rem] text-[1.1rem] md:text-[1.6rem] md:w-[12.3rem] h-[2.8rem] md:h-[4.8rem] border-[0.1rem] cursor-pointer rounded-[0.8rem] md:rounded-[1rem] border-[#D90000] text-[#D90000]"
            >
              다이어리 삭제
            </button>
          </div>
        </div>
        <div className="flex flex-row items-center justify-center">
          {windowWidth > 767 ? (
            <div className="w-[90rem] h-[69.5rem] mx-[3.24rem] my-[3.87rem]">
              <PcParchmentCase diaryId={diaryId} currentPageIndex={currentPageIndex} />
            </div>
          ) : (
            <div className="w-[32.5rem] h-[50rem] mx-[0.8rem] my-[2.4rem] ">
              <MoParchmentCase diaryId={diaryId} currentPageIndex={currentPageIndex} />
            </div>
          )}
        </div>
      </div>
      <div
        onClick={handleNextPage}
        className={`text-[2rem] md:text-[3.2rem] ${
          currentPageIndex + 2 < pages!.length ? 'text-[#008A02]' : 'text-[#BEBEBE]'
        } cursor-pointer`}
      >
        <FaChevronCircleRight />
      </div>
    </div>
  );
}
