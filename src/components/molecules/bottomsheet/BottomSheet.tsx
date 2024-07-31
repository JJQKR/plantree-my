import React, { useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDiaryCoverStore } from '@/stores/diarycover.store';
import BottomSheetCard from './BottomSheetCard';

type BottomSheetProps = {
  isOpen: boolean;
  onToggle: () => void;
  bottomSheetList: { id: string; title: string; content: string }[];
  moveCard: (dragIndex: number, hoverIndex: number) => void;
};

const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onToggle, bottomSheetList, moveCard }) => {
  const router = useRouter();
  const { diaryId } = useParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  const togglePageOptions = useDiaryCoverStore((state) => state.togglePageOptions);
  const setCurrentPage = useDiaryCoverStore((state) => state.setCurrentPage);

  const handleCoverPageClick = () => {
    router.push(`/member/diaryedit/${diaryId}/diarycover`);
  };

  const handleCardClick = (index: number) => {
    setCurrentPage(index - (index % 2));
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const handleAddPageClick = () => {
    togglePageOptions();
  };

  return (
    <div
      className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 h-48 bg-white shadow-lg rounded-t-2xl transition-transform duration-300 ${
        isOpen ? 'translate-y-0' : 'translate-y-44'
      }`}
    >
      <div className="flex justify-center">
        <div
          className="absolute top-[-32px] w-28 h-8 bg-white rounded-t-xl cursor-pointer flex items-center justify-center z-50"
          onClick={onToggle}
        >
          <span>{isOpen ? '▼' : '▲'}</span>
        </div>
      </div>
      <div className="relative">
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full shadow-md z-50"
          onClick={scrollLeft}
        >
          ◀
        </button>
        <div ref={scrollRef} className="p-4 text-center overflow-x-auto flex space-x-4">
          <div
            onClick={handleCoverPageClick}
            className="bg-gray-100 rounded-lg shadow-md p-4 w-32 h-40 flex-none cursor-pointer"
          >
            <h2 className="text-xl font-bold">커버 페이지</h2>
          </div>
          {bottomSheetList.map((item, index) => (
            <BottomSheetCard
              key={item.id}
              id={item.id}
              title={`Page ${index + 1}`}
              content={item.content}
              index={index}
              moveCard={moveCard}
              onClick={() => handleCardClick(index)}
            />
          ))}
          <div
            onClick={handleAddPageClick}
            className="bg-gray-100 rounded-lg shadow-md p-4 w-32 h-40 flex-none cursor-pointer"
          >
            <h2 className="text-xl font-bold">+ 속지 추가</h2>
          </div>
        </div>
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full shadow-md z-50"
          onClick={scrollRight}
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default BottomSheet;
