'use client';

import { usePageToDiaryId } from '@/lib/hooks/usePages';
import useParchmentModalStore from '@/stores/parchment.modal.store';
import React from 'react';
import ShowContents from './ShowContents';
import { FaPlus } from 'react-icons/fa';

interface DiaryContentsProps {
  diaryId: string;
  currentPageIndex: number;
}

const DiaryContents = ({ diaryId, currentPageIndex }: DiaryContentsProps) => {
  const { data: pages, isPending } = usePageToDiaryId(diaryId);
  const { toggleParchmentOptionModal } = useParchmentModalStore((state) => state);

  if (isPending) {
    // TODO: skeleton
    return '로딩중';
  }

  return (
    <div className="flex">
      <div className="  flex items-center justify-center">
        {pages?.[currentPageIndex] ? (
          <div className=" w-[45rem] h-[67.5rem] bg-white shadow-lg">
            <ShowContents page={pages[currentPageIndex]} diaryId={diaryId} />
          </div>
        ) : (
          <div
            className="w-[45rem] h-[67.5rem] border-dashed bg-[#EDF1E6] border-[0.1rem] border-[#ABBC8A] flex items-center justify-center cursor-pointer"
            onClick={toggleParchmentOptionModal}
          >
            <span className="text-[#ABBC8A] text-[2.7rem] flex flex-row items-center gap-[1rem]">
              <FaPlus /> 속지 추가
            </span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-center">
        {pages?.[currentPageIndex + 1] ? (
          <div className="w-[45rem] h-[67.5rem] bg-white shadow-lg">
            <ShowContents page={pages[currentPageIndex + 1]} diaryId={diaryId} />
          </div>
        ) : pages?.[currentPageIndex] ? (
          <div
            className="w-[45rem] h-[67.5rem] border-dashed bg-[#EDF1E6] border-[0.1rem] border-[#ABBC8A] flex items-center justify-center cursor-pointer"
            onClick={toggleParchmentOptionModal}
          >
            <span className="text-[#ABBC8A] text-[2.7rem] flex flex-row items-center gap-[1rem]">
              <FaPlus /> 속지 추가
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DiaryContents;
