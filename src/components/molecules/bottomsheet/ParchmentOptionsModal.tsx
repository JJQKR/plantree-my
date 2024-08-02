'use client';
import React, { useState } from 'react';
import { useDiaryCoverStore } from '@/stores/diarycover.store';
import useBottomSheetStore from '@/stores/bottomsheet.store';
import uuid from 'react-uuid';

const addParchmentPages = [
  'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzA3MDlfNjkg%2FMDAxNjg4OTE0NTM5NDIy.BqIsAefGkbiPvhFb1AOv_2jHyDJBKHFoKK4b0EBOCQEg.WcVvf2YLvLnup2mXQSXuapJMZrWvXmo0hY15gB0SHJ4g.JPEG.simone18%2FIMG_3596.JPG&type=a340',
  'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAxNzA0MDNfMTYg%2FMDAxNDkxMTQ3OTg5MTE0.LgXNxgiumuZL55kTdDozdNvqDeTJCN7Blm2b8ANfrNQg.Q81ksE4O3Q-DxFw8K_MtLZ_mRosfRL0m-UCLE8Axglsg.JPEG.ut_era%2F%25BC%25F6%25C7%25D0%25B3%25EB%25C6%25AE_6mm_png.png&type=a340',
  'https://via.placeholder.com/384x600?text=New+Page+3',
  'https://via.placeholder.com/384x600?text=New+Page+4',
  'https://via.placeholder.com/384x600?text=New+Page+5',
  'https://via.placeholder.com/384x600?text=New+Page+6'
];

const ParchmentOptionsModal: React.FC = () => {
  const { showPageOptions, togglePageOptions, addPage, pages } = useDiaryCoverStore();
  const addPageToBottomSheet = useBottomSheetStore((state) => state.addPageToBottomSheet);
  const [currentOptionPage, setCurrentOptionPage] = useState(0);

  const handleAddPage = (newPageUrl: string) => {
    // const id = String(Date.now() + Math.random());
    const id = uuid();
    const pageIndex = addPage(newPageUrl);
    const title = `Page ${pageIndex + 1}`;
    const content = newPageUrl;

    addPageToBottomSheet(id, title, content);
    togglePageOptions();
  };

  const handleNextOptionPage = () => {
    if (currentOptionPage < addParchmentPages.length - 4) {
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
          {addParchmentPages.slice(currentOptionPage, currentOptionPage + 4).map((url, index) => (
            <div key={index} className="border p-2 cursor-pointer" onClick={() => handleAddPage(url)}>
              <img src={url} alt={`Page ${index}`} />
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
            disabled={currentOptionPage >= addParchmentPages.length - 4}
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
