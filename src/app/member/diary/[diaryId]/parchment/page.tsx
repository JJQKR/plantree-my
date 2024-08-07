'use client';
import DiaryParchmentPage from '@/components/templates/diarycreate/DiaryParchmentPage';
import React from 'react';
// import BottomSheet from '@/components/molecules/bottomsheet/BottomSheet';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import useBottomSheetStore from '@/stores/bottomsheet.store';
import ParchmentOptionsModal from '@/components/molecules/bottomsheet/ParchmentOptionsModal';
import WriteDiary from '@/components/templates/diarycreate/WriteDiary';

const DiaryParchment = () => {
  // const { bottomSheetList, isSheetOpen, toggleSheet, moveCard } = useBottomSheetStore();

  return (
    <div className="relative">
      <WriteDiary />
      {/* <DiaryParchmentPage /> */}
      {/* <DndProvider backend={HTML5Backend}>
        <BottomSheet
          isOpen={isSheetOpen}
          onToggle={toggleSheet}
          bottomSheetList={bottomSheetList}
          moveCard={moveCard}
        />
      </DndProvider> */}
      <ParchmentOptionsModal />
    </div>
  );
};

export default DiaryParchment;
