'use client';

import { usePageToDiaryId } from '@/lib/hooks/usePages';
import React from 'react';
import ParchmentContent from './ParchmentContent';

interface DiaryContentsProps {
  diaryId: string;
  currentPageIndex: number;
}

const MoParchmentCase = ({ diaryId, currentPageIndex }: DiaryContentsProps) => {
  const { data: pages, isPending, isError } = usePageToDiaryId(diaryId);

  if (isPending) {
    // TODO: skeleton
    return (
      <div className="fixed inset-0 flex items-center justify-center w-screen h-screen bg-[#F9FCF9]">
        <img src="/images/loading.gif" alt="Loading" width={150} height={150} />
      </div>
    );
  }
  if (isError) return;

  return (
    <div className="flex">
      <div className="  flex items-center justify-center">
        <div className=" w-[32.5rem] h-[48rem] bg-white shadow-md">
          <ParchmentContent page={pages![currentPageIndex]} diaryId={diaryId} />
        </div>
      </div>
    </div>
  );
};

export default MoParchmentCase;
