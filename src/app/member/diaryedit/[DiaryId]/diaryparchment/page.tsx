'use client';
import DiaryParchmentPage from '@/components/templates/DiaryParchmentPage';
import React from 'react';
import BottomSheet from '@/components/molecules/BottomSheet';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import useBottomSheetStore from '@/stores/bottomsheet.store';

const DiaryParchment = () => {
  const { bottomSheetList, isSheetOpen, toggleSheet, moveCard } = useBottomSheetStore();

  return (
    <div className="relative">
      <DiaryParchmentPage />
      <DndProvider backend={HTML5Backend}>
        <BottomSheet
          isOpen={isSheetOpen}
          onToggle={toggleSheet}
          bottomSheetList={bottomSheetList}
          moveCard={moveCard}
        />
      </DndProvider>
    </div>
  );
};

export default DiaryParchment;
