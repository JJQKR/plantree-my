import React from 'react';
import { useRouter } from 'next/navigation';
import { useDiaryCoverStore } from '@/stores/diarycover.store';
import { addCover } from '@/services/cover.service';
import useBottomSheetStore from '@/stores/bottomsheet.store';

const DiaryParchmentPage = () => {
  const router = useRouter();
  const { coverData, pages, setPages, currentPage, setCurrentPage } = useDiaryCoverStore();
  const setBottomSheetList = useBottomSheetStore((state) => state.setBottomSheetList);

  const handleDeletePage = (pageIndex: number) => {
    const newPages = [...pages];
    newPages.splice(pageIndex, 1);
    setPages(newPages);

    const reorderedBottomSheetList = newPages.map((page, index) => ({
      id: page.id,
      title: `Page ${index + 1}`,
      content: page.url
    }));
    setBottomSheetList(reorderedBottomSheetList);
  };

  const handleFinalSave = async () => {
    if (!coverData) {
      console.error('커버 데이터가 없습니다.');
      return;
    }

    try {
      const response = await addCover(coverData);
      console.log('Cover 저장 성공:', response);
    } catch (error) {
      console.error('Cover 저장 실패:', error);
    }

    router.push('/member');
  };

  const handleNextPage = () => {
    if (currentPage < pages.length) {
      setCurrentPage(currentPage + 2);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 2);
    }
  };

  const handleAddPageClick = () => {
    useDiaryCoverStore.getState().togglePageOptions();
  };

  const renderPage = (pageUrl: string | undefined, pageIndex: number) => (
    <div key={pageIndex} className="relative w-[512px] h-[800px] bg-white shadow-lg p-2">
      <button
        onClick={() => handleDeletePage(pageIndex)}
        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
      >
        &times;
      </button>
      <img src={pageUrl} className="w-full h-full object-cover" />
      <div className="absolute top-2 left-2 text-gray-800 text-3xl px-2 py-1 rounded">Page {pageIndex + 1}</div>
    </div>
  );

  return (
    <div className="flex flex-col overflow-hidden px-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="border-r border-gray-300 flex items-center justify-center">
          {pages[currentPage] ? (
            renderPage(pages[currentPage].url, currentPage)
          ) : (
            <div
              className="w-[512px] h-[800px] flex items-center justify-center border-2 border-dashed border-gray-600 cursor-pointer"
              onClick={handleAddPageClick}
            >
              <span className="text-gray-600 text-4xl">+ 속지 추가</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center">
          {pages[currentPage + 1] ? (
            renderPage(pages[currentPage + 1].url, currentPage + 1)
          ) : pages[currentPage] ? (
            <div
              className="w-[512px] h-[800px] flex items-center justify-center border-2 border-dashed border-gray-600 cursor-pointer"
              onClick={handleAddPageClick}
            >
              <span className="text-gray-600 text-4xl">+ 속지 추가</span>
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex justify-between my-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded transition duration-300"
        >
          이전
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage >= pages.length}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded transition duration-300"
        >
          다음
        </button>
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleFinalSave}
          className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded transition duration-300"
        >
          다이어리 저장
        </button>
      </div>
    </div>
  );
};

export default DiaryParchmentPage;
