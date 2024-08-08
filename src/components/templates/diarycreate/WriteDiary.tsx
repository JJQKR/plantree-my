'use client';
import useUserStore from '@/stores/user.store';
import React, { useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { IoIosSave } from 'react-icons/io';
import { useCreateDiary, useDeleteDiary, useDiariesToUserId, useDiary, useUpdateDiary } from '@/lib/hooks/useDiaries';
import { useParams, useRouter } from 'next/navigation';
import DiaryContents from './DiaryContents';
import usePageStore from '@/stores/pages.store';
import useParchmentModalStore from '@/stores/parchment.modal.store';
import { useCreatePage, useDeletePage, useDeletePages, usePageToDiaryId, useUpdatePage } from '@/lib/hooks/usePages';
import useDiaryStore from '@/stores/diary.store';
import { AddDiaryType } from '@/api/diaries.api';
import { AddPageType, UpdatePageType } from '@/api/pages.api';
import { useDiaryCoverStore } from '@/stores/diarycover.store';
import { getCover } from '@/services/diarycover.service';
import { useDeleteTenMinPlanners } from '@/lib/hooks/useTenMinPlanner';

type ParamTypes = {
  [key: string]: string;
  diaryId: string;
};

const WriteDiary = () => {
  const router = useRouter();
  const { diaryId } = useParams<ParamTypes>();

  // const [diaryName, setDiaryName] = useState('');
  const { userId } = useUserStore((state) => state);
  const { diary, setDiary } = useDiaryStore((state) => state);
  const { pageIndex, setPageIndex, pages, setPages } = usePageStore((state) => state);
  const { toggleParchmentOptionModal } = useParchmentModalStore((state) => state);
  const { coverTitle } = useDiaryCoverStore((state) => state);

  // db diaries 테이블과 상호작용
  const { data: dbDiary, isPending: isDbDiaryPending, isError: isDbDiaryError } = useDiary(diaryId);
  const { data: dbDiaries } = useDiariesToUserId(userId);
  const { mutate: createDbDiary } = useCreateDiary();
  const { mutate: updateDbDiary } = useUpdateDiary();
  const { mutate: deleteDbDiary } = useDeleteDiary();

  // db pages 테이블과 상호작용
  const { data: dbPages } = usePageToDiaryId(diaryId);
  const { mutate: createDbPage } = useCreatePage();
  const { mutate: updateDbPage } = useUpdatePage();
  const { mutate: deleteDbPage } = useDeletePage();
  const { mutate: deleteDbPages } = useDeletePages();

  // db ten_min_planner 테이블과 상호작용
  const { mutate: deleteDbTenMinPlanners } = useDeleteTenMinPlanners();

  // 다이어리 가져오기 : db diary 가져오기, db page 가져오기
  useEffect(() => {
    setDiary(dbDiary as AddDiaryType);

    const sortedPages = (dbPages ?? []).sort((a, b) => a.index - b.index);
    setPages(sortedPages);
  }, [dbPages, dbDiary]);

  // console.log(dbDiary);

  // 로그인이 되어있지 않다면 로그인 해달라는 문구를 리턴합니다.
  if (!userId) {
    return <div>로그인 해주세요.</div>;
  }

  if (isDbDiaryPending) {
    return <div>로딩중~</div>;
  }
  if (isDbDiaryError) {
    return <div> 오류가 발생했습니다. </div>;
  }

  if (!dbPages) return;

  // 다이어리를 삭제 :  db diary 삭제 , db pages 삭제
  const deleteDiary = () => {
    const confirmDeleteDiary = confirm('정말 다이어리를 삭제하시겠습니까? 되돌릴 수 없습니다.');
    if (confirmDeleteDiary) {
      deleteDbDiary(diaryId);
      deleteDbPages(diaryId);
      console.log(diaryId);
      pages.map((page) => {
        if (page.parchment_style === 'ten_min_planner') {
          deleteDbTenMinPlanners(diaryId);
        }
        return;
      });

      alert('다이어리가 삭제 되었습니다.');
      router.replace('/member/hub');
    }
  };

  console.log(pages);

  // 다이어리 저장 : db diaries 생성, 업데이트 , db pages 생성, 업데이트
  const savePages = () => {
    const confirmSavePage = confirm('정말 다이어리를 저장하시겠습니까?');
    if (confirmSavePage) {
      const currentPageIds = pages.map((page) => page.id);

      // 데이터베이스에 저장된 페이지를 업데이트하거나 삭제합니다.
      dbPages.forEach((dbPage) => {
        if (!currentPageIds.includes(dbPage.id)) {
          deleteDbPage(dbPage.id); // 페이지 삭제
        } else {
          // const pagesToUpdate: AddPageType[] = [];
          const pageToUpdate = pages.find((p) => p.id === dbPage.id);

          if (pageToUpdate) {
            const updatedPage = { ...pageToUpdate, index: pages.indexOf(pageToUpdate) };
            updateDbPage({ id: dbPage.id, updatePage: updatedPage });
          }
        }
      });

      // 새 페이지를 데이터베이스에 추가합니다.
      pages.forEach((page, index) => {
        // const index = pages.indexOf(page);
        console.log(page.id, index);
        const pageForStorage = { ...page, index };

        if (!dbPages.some((p) => p.id === page.id)) {
          createDbPage(pageForStorage);
        }
      });

      // // 상태 초기화 및 리디렉션
      setPages([]);
      setDiary(null);
      router.push('/member/hub');
    }
  };

  // 앞페이지로 이동합니다.
  const handlePrevPage = () => {
    if (pageIndex > 1) {
      setPageIndex(pageIndex - 2);
    } else if (pageIndex === 1) {
      setPageIndex(0); // 첫 페이지로 이동하려는 경우
    }
  };

  // 뒷페이지로 이동합니다.
  const handleNextPage = () => {
    if (pageIndex + 2 < pages.length) {
      setPageIndex(pageIndex + 2);
    } else if (pages[pageIndex]) {
      if (confirm('더이상 페이지가 없습니다. 추가하시겠습니까?')) {
        toggleParchmentOptionModal(); // 함수 호출을 활성화
      }
    }
  };

  return (
    <div className="flex flex-row items-center">
      <div onClick={handlePrevPage}>
        <IoIosArrowBack />
      </div>
      <div>
        <div className="flex flex-row justify-between ">
          <div className="flex flex-row">
            <IoIosArrowBack />
            <h2>{coverTitle}</h2>
          </div>
          <div className="flex flex-row gap-3">
            <div onClick={deleteDiary}>
              <RiDeleteBin5Line />
            </div>
            <div onClick={savePages}>
              <IoIosSave />
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          <div className="w-[91.6rem] h-[60rem] border-2 border-gray-500">
            <DiaryContents />
          </div>
        </div>
      </div>
      <div onClick={handleNextPage}>
        <IoIosArrowForward />
      </div>
    </div>
  );
};
export default WriteDiary;
