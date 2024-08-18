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
    return '로딩중';
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
