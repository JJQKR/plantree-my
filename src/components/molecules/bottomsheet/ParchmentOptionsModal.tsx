'use client';
import React, { useState } from 'react';
import uuid from 'react-uuid';
import { useParams } from 'next/navigation';
import usePageStore from '@/stores/pages.store';
import useParchmentModalStore from '@/stores/parchment.modal.store';
import { ParchmentType, parchments } from '@/lib/utils/parchment';

type ParamTypes = {
  [key: string]: string;
  diaryId: string;
};

const ParchmentOptionsModal: React.FC = () => {
  const { diaryId } = useParams<ParamTypes>();
  const { isParchmentOptionModalOpen, toggleParchmentOptionModal } = useParchmentModalStore((state) => state);
  const { addPage, pages, setPageIndex } = usePageStore((state) => state);

  // * 4개 이상의 파치먼트 옵션이 생기면 생성
  // const [currentOptionPage, setCurrentOptionPage] = useState(0);

  // parchment 옵션을 클릭하면 생성되는 페이지
  const handleAddPage = (parchment: ParchmentType) => {
    const newPage = {
      id: uuid(),
      content_id: uuid(),
      parchment_style: parchment.parchmentStyle,
      diary_id: diaryId
    };

    addPage(newPage);
    toggleParchmentOptionModal();
  };

  if (!isParchmentOptionModalOpen) return null;

  // * 4개 이상의 파치먼트 옵션이 생기면 생성
  // const handleNextOptionPage = () => {
  //   if (currentOptionPage < parchments.length - 4) {
  //     setCurrentOptionPage(currentOptionPage + 4);
  //   }
  // };

  // * 4개 이상의 파치먼트 옵션이 생기면 생성
  // const handlePrevOptionPage = () => {
  //   if (currentOptionPage > 0) {
  //     setCurrentOptionPage(currentOptionPage - 4);
  //   }
  // };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={toggleParchmentOptionModal}
    >
      <div className="bg-white p-4 rounded shadow-lg w-[85%] max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-lg font-semibold">속지 선택</h2>
        <div className="grid grid-cols-4 gap-4">
          {parchments.map((parchment) => (
            <div key={parchment.id} className="border p-2 cursor-pointer" onClick={() => handleAddPage(parchment)}>
              <img src={parchment.url} alt={`Page ${parchment.id}`} />
            </div>
          ))}
          {/* 4개 이상의 파치먼트 옵션이 생기면 생성
           {parchments.slice(currentOptionPage, currentOptionPage + 4).map((parchment) => (
            <div key={parchment.id} className="border p-2 cursor-pointer" onClick={() => handleAddPage(parchment)}>
              <img src={parchment.url} alt={`Page ${parchment.id}`} />
            </div>
          ))} */}
        </div>
        {/*  4개 이상의 파치먼트 옵션이 생기면 생성

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
        </div> */}
      </div>
    </div>
  );
};

export default ParchmentOptionsModal;
