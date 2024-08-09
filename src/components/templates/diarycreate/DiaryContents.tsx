'use client';

import { AddPageType } from '@/api/pages.api';
import BlankNote from '@/components/molecules/parchment/BlankNote';
import LineNote from '@/components/molecules/parchment/LineNote';
import TenMinPlanner from '@/components/molecules/parchment/TenMinPlanner';
import usePageStore, { PageType } from '@/stores/pages.store';
import useParchmentModalStore from '@/stores/parchment.modal.store';
import React from 'react';

const DiaryContents = () => {
  const { pageIndex, pages, removePage } = usePageStore((state) => state);
  const { toggleParchmentOptionModal } = useParchmentModalStore((state) => state);

  // const handleDeletePage = async (deletedPage: AddPageType) => {
  //   const confirmDelete = confirm('이 페이지를 삭제하시겠습니까?');
  //   if (!confirmDelete) return;
  //   try {
  //     deletePage(deletedPage.id);
  //     const updatePromises = pages
  //       ?.filter((page) => page.index > deletedPage.index)
  //       .map(async (page) => {
  //         return updatePage({
  //           id: page.id,
  //           updatePage: {
  //             ...page,
  //             index: page.index - 1
  //           }
  //         });
  //       });
  //     if (updatePromises && updatePromises.length > 0) {
  //       await Promise.all(updatePromises);
  //     }
  //   } catch (error) {
  //     console.error('Error during update:', error);
  //   }
  // };

  const handleDeletePage = (deletePageId: string) => {
    const confirmDelete = confirm('이 페이지를 삭제하시겠습니까?');
    if (!confirmDelete) return;
    console.log(deletePageId);
    removePage(deletePageId);
  };

  const showContent = (page: PageType) => (
    <div key={page.id} className="relative w-[45.8rem] h-[67.6rem] bg-white shadow-lg p-2  ">
      <button
        onClick={() => handleDeletePage(page.id)}
        className="absolute top-2 right-2 bg-red-400 text-white rounded-full w-[2rem] flex items-center justify-center z-10"
      >
        &times;
      </button>
      {page.parchment_style === 'tenMinPlanner' ? (
        <TenMinPlanner />
      ) : page.parchment_style === 'lineNote' ? (
        <LineNote />
      ) : page.parchment_style === 'BlankNote' ? (
        <BlankNote />
      ) : (
        <img className="w-full h-full object-cover" />
      )}
      <div className="absolute top-2 left-2 text-gray-800 text-3xl px-2 py-1 rounded">
        Page {pages.indexOf(page) + 1}
      </div>
    </div>
  );

  if (!pages) {
    return <div>No pages available.</div>;
  }

  return (
    <div className="grid grid-cols-2">
      <div className="border-r border-gray-300 h-[67.63rem] flex items-center justify-center">
        {pages[pageIndex] ? (
          showContent(pages[pageIndex])
        ) : (
          <div
            className="w-[45.8rem] h-[60rem] flex items-center justify-center border-2 border-dashed border-gray-600 cursor-pointer"
            onClick={toggleParchmentOptionModal}
          >
            <span className="text-gray-600 text-4xl">+ 속지 추가</span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-center">
        {pages[pageIndex + 1] ? (
          showContent(pages[pageIndex + 1])
        ) : pages[pageIndex] ? (
          <div
            className="w-[45.8rem] h-[67.6rem] flex items-center justify-center border-2 border-dashed border-gray-600 cursor-pointer"
            onClick={toggleParchmentOptionModal}
          >
            <span className="text-gray-600 text-4xl">+ 속지 추가</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DiaryContents;
