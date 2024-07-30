'use client';
import React from 'react';
import DiaryCoverPage from '@/components/templates/DiaryCoverPage';
import BottomSheet from '@/components/molecules/BottomSheet';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import useBottomSheetStore from '@/stores/bottomsheet.store';

const DiaryEdit: React.FC = () => {
  const { bottomSheetList, isSheetOpen, toggleSheet, moveCard } = useBottomSheetStore();

  return (
    <div className="relative">
      <DiaryCoverPage />
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

export default DiaryEdit;
