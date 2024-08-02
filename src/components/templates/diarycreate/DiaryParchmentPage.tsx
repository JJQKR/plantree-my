'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDiaryCoverStore } from '@/stores/diarycover.store';
import { addCover, deleteCover, updateCover } from '@/services/diarycover.service';
import useBottomSheetStore from '@/stores/bottomsheet.store';
import TenMinplanner from '@/components/molecules/parchment/TenMinPlanner';
import LineNote from '@/components/molecules/parchment/LineNote';
import useUserStore from '@/stores/user.store';
// import { addParchment, deleteParchment, updateParchment } from '@/services/diaryparchment.service';
import { supabase } from '@/supabase/client';

const DiaryParchmentPage = () => {
  const router = useRouter();
  const { pages, setPages, currentPage, setCurrentPage } = useDiaryCoverStore();
  const setBottomSheetList = useBottomSheetStore((state) => state.setBottomSheetList);
  const userId = useUserStore((state) => state.userId);
  const { diaryId } = useParams();

  const diaryIdString = Array.isArray(diaryId) ? diaryId[0] : diaryId;

  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // useEffect(() => {
  //   setIsEditMode(pages.length > 0);
  // }, [pages]);

  if (!userId) {
    return <div>로그인 해주세요.</div>;
  }

  const handleDeletePage = (pageIndex: number) => {
    const confirmDelete = confirm('이 페이지를 삭제하시겠습니까?');
    if (!confirmDelete) return;

    const newPages = [...pages];
    newPages.splice(pageIndex, 1);
    setPages(newPages);

    const reorderedBottomSheetList = newPages.map((page, index) => ({
      id: page.id,
      title: `Page ${index + 1}`,
      content: page.url
    }));
    setBottomSheetList(reorderedBottomSheetList);
  };

  const handleFinalSave = async () => {
    const { coverData } = useDiaryCoverStore.getState();

    if (!coverData) {
      console.error('커버 데이터가 없습니다.');
      return;
    }

    try {
      if (isEditMode) {
        await updateCover(diaryIdString, coverData);
        // await updateParchment(diaryIdString, parchmentData);
        alert('Diary 업데이트 성공!');
      } else {
        await addCover(coverData);
        // await addParchment(parchmentData);
        alert('Diary 저장 성공!');
      }
      router.push('/member');
    } catch (error) {
      console.error('Diary 저장 실패:', error);
      alert('diary 저장 실패');
    }
  };

  const handleNextPage = () => {
    if (currentPage + 1 < pages.length && pages[currentPage] && pages[currentPage + 1]) {
      setCurrentPage(currentPage + 2);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 2);
    }
  };

  const handleAddPageClick = () => {
    useDiaryCoverStore.getState().togglePageOptions();
  };

  const handleDeleteDiary = async () => {
    if (!confirm('다이어리를 삭제하시겠습니까?')) {
      return;
    }

    let coverImage: string | null | undefined;
    try {
      const coverImageUrl = coverImage;
      const fileName = coverImageUrl ? coverImageUrl.split('/').pop() : null;

      //Parchment 삭제
      // const parchmentResult = await deleteParchment(diaryIdString);
      // if (parchmentResult.error) {
      //   console.error('Parchment 삭제 실패:', parchmentResult.error);
      //   alert('Parchment 삭제 실패');
      //   return;
      // }

      const coverResult = await deleteCover(diaryIdString);
      if (coverResult.error) {
        console.error('Cover 삭제 실패:', coverResult.error);
        alert('Cover 삭제 실패');
        return;
      }

      if (fileName) {
        const { error: deleteError } = await supabase.storage.from('cover_img').remove([fileName]);
        if (deleteError) {
          console.error('이미지 파일 삭제 실패:', deleteError);
          alert('이미지 파일 삭제 실패');
          return;
        }
      }

      alert('삭제 성공');
      router.push('/member');
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제 실패');
    }
  };

  const renderPage = (pageUrl: string | undefined, pageIndex: number) => (
    <div key={pageIndex} className="relative w-[512px] h-[800px] bg-white shadow-lg p-2">
      <button
        onClick={() => handleDeletePage(pageIndex)}
        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
      >
        &times;
      </button>
      <div className="absolute top-2 left-2 text-gray-800 text-3xl px-2 py-1 rounded">Page {pageIndex + 1}</div>

      {pageUrl ===
      'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzA3MDlfNjkg%2FMDAxNjg4OTE0NTM5NDIy.BqIsAefGkbiPvhFb1AOv_2jHyDJBKHFoKK4b0EBOCQEg.WcVvf2YLvLnup2mXQSXuapJMZrWvXmo0hY15gB0SHJ4g.JPEG.simone18%2FIMG_3596.JPG&type=a340' ? (
        <TenMinplanner />
      ) : pageUrl ===
        'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAxNzA0MDNfMTYg%2FMDAxNDkxMTQ3OTg5MTE0.LgXNxgiumuZL55kTdDozdNvqDeTJCN7Blm2b8ANfrNQg.Q81ksE4O3Q-DxFw8K_MtLZ_mRosfRL0m-UCLE8Axglsg.JPEG.ut_era%2F%25BC%25F6%25C7%25D0%25B3%25EB%25C6%25AE_6mm_png.png&type=a340' ? (
        <LineNote userId={userId} className="w-full max-w-screen-md max-h-screen overflow-auto mt-20" />
      ) : (
        <img src={pageUrl} className="w-full h-full object-cover" />
      )}
    </div>
  );

  const confirmSave = async () => {
    const confirmSave = confirm(isEditMode ? '다이어리를 수정 하시겠습니까?' : '다이어리를 저장 하시겠습니까?');
    if (confirmSave) {
      await handleFinalSave();
    }
  };

  return (
    <div className="flex flex-col overflow-hidden px-4">
      <div className="flex justify-between mt-2">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded transition duration-300"
        >
          이전
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage + 1 >= pages.length || !pages[currentPage] || !pages[currentPage + 1]}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded transition duration-300"
        >
          다음
        </button>
      </div>
      <div className="flex justify-end my-2">
        <button
          onClick={confirmSave}
          className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded transition duration-300"
        >
          {isEditMode ? '다이어리 수정' : '저장하기'}
        </button>
        {!isEditMode && (
          <button
            onClick={handleDeleteDiary}
            className="ml-2 px-2 py-1 bg-red-500 hover:bg-red-600 text-white font-semibold rounded transition duration-300"
          >
            다이어리 삭제
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="border-r border-gray-300 flex items-center justify-center">
          {pages[currentPage] ? (
            renderPage(pages[currentPage].url, currentPage)
          ) : (
            <div
              className="w-[512px] h-[800px] flex items-center justify-center border-2 border-dashed border-gray-600 cursor-pointer"
              onClick={handleAddPageClick}
            >
              <span className="text-gray-600 text-4xl">+ 속지 추가</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center">
          {pages[currentPage + 1] ? (
            renderPage(pages[currentPage + 1].url, currentPage + 1)
          ) : pages[currentPage] ? (
            <div
              className="w-[512px] h-[800px] flex items-center justify-center border-2 border-dashed border-gray-600 cursor-pointer"
              onClick={handleAddPageClick}
            >
              <span className="text-gray-600 text-4xl">+ 속지 추가</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DiaryParchmentPage;
