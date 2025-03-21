'use client';

import React, { useEffect, useState } from 'react';
import BottomSheet from '@/components/molecules/bottomsheet/BottomSheet';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import useBottomSheetStore from '@/stores/bottomsheet.store';
import ParchmentOptionsModal from '@/components/molecules/bottomsheet/ParchmentOptionsModal';
import PcParchmentPageFrame from '@/components/templates/ParchmentPage/PcParchmentPageFrame';
import MoParchmentPageFrame from '@/components/templates/ParchmentPage/MoParchmentPageFrame';

/**
 * 투두리스트
 * 1. 속지 뷰 & 추가 페이지 만들기 (/member/diary/[diaryId]/parchment)
 *    - page
 *    - 속지 추가 -> contentId & parchmentStyle에 맞게 추가
 *    - contentId & parchmentStyle -> 실제 내용도 가져와야 함
 * 2. 편집모드 -> 상세페이지 이동 (/member/diary/[diaryId]/parchment/[id]?style=tenMinPlanner)
 *    - contentId & parchmentStyle => tenMinPlanner or ~ or ~
 *    - 없으면 해당 속지가 없습니다. 경고 -> 속지 뷰 & 추가 페이지로 강제 이동
 *     - 저장 클릭 시 contentId & parchmentStyle 일치하는 놈의 데이터를 변경하고 & 속지 뷰 & 추가 페이지로 이동
 */

const DiaryParchment = () => {
  const { bottomSheetList, isSheetOpen, toggleSheet, moveCard } = useBottomSheetStore();
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative">
      {windowWidth < 768 ? <MoParchmentPageFrame /> : <PcParchmentPageFrame />}
      <DndProvider backend={HTML5Backend}>
        <BottomSheet
          isOpen={isSheetOpen}
          onToggle={toggleSheet}
          bottomSheetList={bottomSheetList}
          moveCard={moveCard}
        />
      </DndProvider>
      <ParchmentOptionsModal />
    </div>
  );
};

export default DiaryParchment;
