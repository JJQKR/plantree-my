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

// const isParchmentStyle = (value: 'tenMinPlanner' | 'lineNote' | 'blankNote') => {
//   return ['tenMinPlanner', 'lineNote', 'blankNote'].includes(value);
// };

type DbTableType = 'ten_Min_planner' | 'line_note' | 'blank_note';

const changeDbName = (parchmentStyle: 'tenMinPlanner' | 'lineNote' | 'blankNote') => {
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

  // 커버 타이틀 가져오는 코드
  useEffect(() => {
    if (diaryId) {
      const getCoverTitle = async () => {
        const diaryCover = await getCover(diaryId);
        setCoverTitle(diaryCover.cover_title);
      };
      getCoverTitle();
      if (dbPages) {
        setPages(dbPages);
      }
    }
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
        // if (isParchmentStyle(page.parchment_style)) {
        const tableName = changeDbName(page.parchment_style as 'tenMinPlanner' | 'lineNote' | 'blankNote') as
          | 'ten_min_planner'
          | 'line_note'
          | 'blank_note';
        return supabase.from(tableName).delete().eq('diary_id', diaryId);
        // }
      });

      await Promise.all(deletionPromises);

      // pages?.map((page) => {
      //   if (page.parchment_style === 'ten_min_planner') {
      //     supabase.from('ten_min_planner').delete().eq('diary_id', diaryId);
      //   } else if (page.parchment_style === 'line_note') {
      //     supabase.from('line_note').delete().eq('diary_id', diaryId);
      //   } else if (page.parchment_style === 'blank_note') {
      //     supabase.from('blank_note').delete().eq('diary_id', diaryId);
      //   } else {
      //     return;
      //   }
      // });

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
    if (currentPageIndex + 2 < pages!.length) {
      setCurrentPageIndex(currentPageIndex + 2);
    } else if (pages![currentPageIndex]) {
      if (confirm('더이상 페이지가 없습니다. 추가하시겠습니까?')) {
        toggleParchmentOptionModal(); // 함수 호출을 활성화
      }
    }
  };

  if (isPending) {
    <div>로딩중</div>;
  }
  if (isError) return;

  // 0. 속지 추가 UI를 먼저 만든다. V
  // 0-1. url의 diaryId를 이용해서 cover 뒤져서 cover 타이틀 가져온다. V
  // 페이지 추가 시 DB에 page 데이터 & 속지테이블(tenMinPlanner V , 무지 V, 줄글 V)

  // 이미 존재하는 page들을 가져와야 함 V
  // 편집 모드 버튼 클릭 시 상세페이지 이동 V
  // 상세페이지에서 컴포넌트 수정 V
  // 속지리스트 -> 수정이 안되게
  // page의 contentId와 parchmentStyle에 따라 또 DB에서 가져와야 함 => 속지 내부 데이터를 가져온다. => 나중에 V
  return (
    // 1. 속지 여러 개를 담는 큰 박스 만든다
    // 2. 속지 하나하나의 div
    // 3. 추가 버튼 시 modal 띄우고
    // 4. 모달에서 선택하면 해당하는 데이터가 비어있는 컴포넌트를 뒤에 추가한다.
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
