import React, { useRef } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import BottomSheetCard from './BottomSheetCard';
import { UpdatePageType } from '@/api/pages.api';
import useParchmentModalStore from '@/stores/parchment.modal.store';
import { usePageToDiaryId } from '@/lib/hooks/usePages';
import { FaChevronUp } from 'react-icons/fa6';
import { FaChevronDown } from 'react-icons/fa6';

type BottomSheetProps = {
  isOpen: boolean;
  onToggle: () => void;
  bottomSheetList: UpdatePageType[];
  moveCard: (dragIndex: number, hoverIndex: number) => void;
};

type ParamTypes = {
  [key: string]: string;
  diaryId: string;
};

const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onToggle, bottomSheetList, moveCard }) => {
  const router = useRouter();
  const { diaryId } = useParams<ParamTypes>();
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: pages, isPending } = usePageToDiaryId(diaryId);

  const { toggleParchmentOptionModal } = useParchmentModalStore((state) => state);

  // const scrollLeft = () => {
  //   if (scrollRef.current) {
  //     scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  //   }
  // };

  // const scrollRight = () => {
  //   if (scrollRef.current) {
  //     scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  //   }
  // };

  const handleAddPageModal = () => {
    toggleParchmentOptionModal();
  };

  return (
    <div
      className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[118rem] h-48 bg-[#E6F3E6] border-[0.15rem] border-[#B0DBB1] shadow-lg rounded-t-2xl transition-transform duration-300 ${
        isOpen ? 'translate-y-0' : 'translate-y-44'
      } z-20`} // z-index 설정
    >
      <div className="flex justify-center">
        <div
          className="absolute top-[-25px] w-[11.4rem] h-[2.5rem] bg-[#E6F3E6] border-[0.15rem] border-x-[#B0DBB1] border-t-[#B0DBB1] border-b-[#E6F3E6] rounded-t-[1rem] cursor-pointer flex items-center justify-center z-50"
          onClick={onToggle}
        >
          <span className="text-[2rem]">{isOpen ? <FaChevronDown /> : <FaChevronUp />}</span>
        </div>
      </div>
      <div className="relative">
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full shadow-md z-50"
          // onClick={scrollLeft}
        >
          ◀
        </button>
        <div ref={scrollRef} className="p-4 text-center overflow-x-auto flex space-x-4">
          <div className="flex flex-row gap-[1rem]">
            {pages?.map((page) => {
              return (
                <BottomSheetCard key={page.id} page={page} moveCard={moveCard} onToggle={onToggle} pages={pages} />
              );
            })}
          </div>

          <div
            onClick={handleAddPageModal}
            className="bg-gray-100 rounded-lg shadow-md p-4 w-32 h-40 flex-none cursor-pointer z-30" // z-index 설정
          >
            <h2 className="text-xl font-bold">+ 속지 추가</h2>
          </div>
        </div>
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full shadow-md z-50"
          // onClick={scrollRight}
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default BottomSheet;
