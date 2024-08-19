import React, { useRef } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import BottomSheetCard from './BottomSheetCard';
import { UpdatePageType } from '@/api/pages.api';
import useParchmentModalStore from '@/stores/parchment.modal.store';
import { usePageToDiaryId } from '@/lib/hooks/usePages';
import { FaChevronUp } from 'react-icons/fa6';
import { FaChevronDown } from 'react-icons/fa6';
import { FaPlus } from 'react-icons/fa6';
import { FaChevronLeft } from 'react-icons/fa6';
import { FaChevronRight } from 'react-icons/fa6';

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
  const { diaryId } = useParams<ParamTypes>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: pages, isPending } = usePageToDiaryId(diaryId);

  const { toggleParchmentOptionModal } = useParchmentModalStore((state) => state);

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

  const handleAddPageModal = () => {
    toggleParchmentOptionModal();
  };

  return (
    <div
      className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 sm:w-[42.8rem] w-[118rem] sm:h-[4.5rem] h-[5.5rem] bg-[#EDF1E6] border-[0.15rem] border-[#B0DBB1] shadow-lg rounded-t-2xl transition-transform duration-300 ${
        isOpen ? 'translate-y-0' : 'sm:translate-y-[4rem] translate-y-[5rem]'
      } z-20`} // z-index 설정
    >
      <div className="flex justify-center">
        <div
          className="absolute top-[-3rem] w-[11.4rem] h-[3rem] bg-[#EDF1E6] border-[0.15rem] border-x-[#B0DBB1] border-t-[#B0DBB1] border-b-[#EDF1E6] rounded-t-[1rem] cursor-pointer flex items-end justify-center z-50"
          onClick={onToggle}
        >
          <span className="sm:text-[1.3rem] text-[1.5rem] flex items-center">
            {isOpen ? (
              <div className="flex flex-row gap-[0.4rem]  text-[#6D8B33] font-[700]">
                <FaChevronDown />
                목차
              </div>
            ) : (
              <div className="flex flex-row items-center gap-[0.4rem] text-[#6D8B33] font-[700]">
                <FaChevronUp />
                목차
              </div>
            )}
          </span>
        </div>
      </div>
      <div className="relative flex justify-center">
        <button
          className="absolute left-0 top-[2.5rem] ml-[1rem] text-[2rem] transform -translate-y-1/2 "
          onClick={scrollLeft}
        >
          <FaChevronLeft />
        </button>
        <div
          ref={scrollRef}
          className="flex sm:w-[36rem] w-[111rem] py-4 text-center overflow-hidden overflow-x-auto sm:gap-[0.8rem] gap-[1rem] "
        >
          <div className="flex flex-row sm:gap-[0.8rem] gap-[1rem]">
            {pages?.map((page) => {
              return (
                <BottomSheetCard key={page.id} page={page} moveCard={moveCard} onToggle={onToggle} pages={pages} />
              );
            })}
          </div>
          <div
            onClick={handleAddPageModal}
            className="border-[#6D8B33] border-[0.1rem] rounded-[0.4rem] p-4 sm:w-[5.5rem] w-[6.5rem] sm:h-[3rem] h-[3.6rem] flex-none cursor-pointer z-30 flex items-center justify-center" // z-index 설정
          >
            <div className="sm:text-[1.2rem] text-[1.5rem] h-[1.8rem] font-[700] flex flex-row justify-end items-center text-[#6D8B33] ">
              <FaPlus />
              <div className=" sm:h-[1.4rem]">추가</div>
            </div>
          </div>
        </div>
        <button
          className="absolute right-0 mr-[1rem] top-[2.5rem] text-[2rem] transform -translate-y-1/2 "
          onClick={scrollRight}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default BottomSheet;
