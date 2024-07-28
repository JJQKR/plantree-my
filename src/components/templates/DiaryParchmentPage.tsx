'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDiaryCoverStore } from '@/stores/diarycover.store';
import { addCover } from '@/services/cover.service';

const dummyData = [
  'https://via.placeholder.com/384x600?text=Page+1',
  'https://via.placeholder.com/384x600?text=Page+2',
  'https://via.placeholder.com/384x600?text=Page+3',
  'https://via.placeholder.com/384x600?text=Page+4',
  'https://via.placeholder.com/384x600?text=Page+5',
  'https://via.placeholder.com/384x600?text=Page+6',
  'https://via.placeholder.com/384x600?text=Page+7'
];

const addParchmentPages = [
  'https://via.placeholder.com/384x600?text=New+Page+1',
  'https://via.placeholder.com/384x600?text=New+Page+2',
  'https://via.placeholder.com/384x600?text=New+Page+3',
  'https://via.placeholder.com/384x600?text=New+Page+4',
  'https://via.placeholder.com/384x600?text=New+Page+5',
  'https://via.placeholder.com/384x600?text=New+Page+6'
];

const DiaryParchmentPage: React.FC = () => {
  const router = useRouter();
  const { coverData } = useDiaryCoverStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState(dummyData);
  const [showPageOptions, setShowPageOptions] = useState(false);
  const [currentOptionPage, setCurrentOptionPage] = useState(0);

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
    if (currentPage < pages.length - 2) {
      setCurrentPage(currentPage + 2);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 2);
    }
  };

  const handleAddPage = (newPageUrl: string) => {
    setPages([...pages, newPageUrl]);
    setShowPageOptions(false);
  };

  const handleAddPageClick = () => {
    setShowPageOptions(true);
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

  const closeModal = () => {
    setShowPageOptions(false);
  };

  useEffect(() => {
    if (showPageOptions) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [showPageOptions]);

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="flex flex-grow">
        <div className="w-1/2 border-r border-gray-300 flex items-center justify-center">
          <div className="w-11/12 h-11/12 bg-white shadow-lg p-2">
            <img src={pages[currentPage]} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="w-1/2 flex items-center justify-center">
          <div className="w-11/12 h-11/12 bg-white shadow-lg p-2">
            {currentPage + 1 < pages.length ? (
              <img src={pages[currentPage + 1]} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div
                  className="w-96 h-24 flex items-center justify-center border-2 border-dashed border-gray-400 cursor-pointer"
                  onClick={handleAddPageClick}
                >
                  <span className="text-gray-400 text-4xl">+ 속지 추가</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between m-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded transition duration-300"
        >
          이전
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage >= pages.length - 2}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded transition duration-300"
        >
          다음
        </button>
      </div>
      <button
        onClick={handleFinalSave}
        className="m-4 px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded transition duration-300"
      >
        저장
      </button>

      {showPageOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={closeModal}>
          <div className="bg-white p-4 rounded shadow-lg w-[85%] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-4 text-lg font-semibold">속지 선택</h2>
            <div className="grid grid-cols-4 gap-4">
              {addParchmentPages.slice(currentOptionPage, currentOptionPage + 4).map((url, index) => (
                <div key={index} className="border p-2 cursor-pointer" onClick={() => handleAddPage(url)}>
                  <img src={url} />
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
      )}
    </div>
  );
};

export default DiaryParchmentPage;
