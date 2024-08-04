'use client';
import React, { useState } from 'react';
import { useDiaryCoverStore } from '@/stores/diarycover.store';
import useBottomSheetStore from '@/stores/bottomsheet.store';
import uuid from 'react-uuid';
import { useCreatePage } from '@/lib/hooks/usePages';
import { useParams } from 'next/navigation';
import usePageStore from '@/stores/pages.store';

type ParchmentType = {
  id: number;
  parchmentStyle: string;
  url: string;
};

type ParamTypes = {
  [key: string]: string;
  diaryId: string;
};

const parchments = [
  { id: 1, parchmentStyle: 'tenMinPlanner', url: '/images/tenMinPlanner.png' },
  { id: 2, parchmentStyle: 'lineNote', url: '/images/lineNote.png' },
  { id: 3, parchmentStyle: 'BlankNote', url: 'https://via.placeholder.com/384x600?text=New+Page+3' }
];

const ParchmentOptionsModal: React.FC = () => {
  const { showPageOptions, togglePageOptions } = useDiaryCoverStore();
  const { addPage, temporaryPages } = usePageStore((state) => state);
  const [currentOptionPage, setCurrentOptionPage] = useState(0);
  const { mutate: createPage } = useCreatePage();
  const { diaryId } = useParams<ParamTypes>();

  const handleAddPage = (parchment: ParchmentType) => {
    const newPage = {
      id: uuid(),
      content_id: uuid(),
      parchment_style: parchment.parchmentStyle,
      index: temporaryPages.length + 1,
      diary_id: diaryId
    };

    addPage(newPage);
    togglePageOptions();
    createPage(newPage);
  };

  const handleNextOptionPage = () => {
    if (currentOptionPage < parchments.length - 4) {
      setCurrentOptionPage(currentOptionPage + 4);
    }
  };

  const handlePrevOptionPage = () => {
    if (currentOptionPage > 0) {
      setCurrentOptionPage(currentOptionPage - 4);
    }
  };

  if (!showPageOptions) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={togglePageOptions}>
      <div className="bg-white p-4 rounded shadow-lg w-[85%] max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-lg font-semibold">속지 선택</h2>
        <div className="grid grid-cols-4 gap-4">
          {parchments.slice(currentOptionPage, currentOptionPage + 4).map((parchment) => (
            <div key={parchment.id} className="border p-2 cursor-pointer" onClick={() => handleAddPage(parchment)}>
              <img src={parchment.url} alt={`Page ${parchment.id}`} />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrevOptionPage}
            disabled={currentOptionPage === 0}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded transition duration-300"
          >
            이전
          </button>
          <button
            onClick={handleNextOptionPage}
            disabled={currentOptionPage >= parchments.length - 2}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded transition duration-300"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParchmentOptionsModal;
