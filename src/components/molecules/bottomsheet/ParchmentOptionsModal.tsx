'use client';
import React, { useEffect, useState } from 'react';
import uuid from 'react-uuid';
import { useParams } from 'next/navigation';
import usePageStore, { PageType } from '@/stores/pages.store';
import useParchmentModalStore from '@/stores/parchment.modal.store';
import { ParchmentType, parchments } from '@/lib/utils/parchment';
import useTenMinPlannerStore from '@/stores/tenMinPlanner.store';
import useUserStore from '@/stores/user.store';
import { useCreatePage, usePageToDiaryId } from '@/lib/hooks/usePages';
import { useCreateTenMinPlanner } from '@/lib/hooks/useTenMinPlanner';
import { supabase } from '@/supabase/client';
import useBottomSheetStore from '@/stores/bottomsheet.store';

type ParamTypes = {
  [key: string]: string;
  diaryId: string;
};

const ParchmentOptionsModal: React.FC = () => {
  const { diaryId } = useParams<ParamTypes>();
  const { isParchmentOptionModalOpen, toggleParchmentOptionModal } = useParchmentModalStore((state) => state);
  // const { addPage, pages, setPageIndex } = usePageStore((state) => state);
  const { addTenMinPlanner } = useTenMinPlannerStore();
  const { userId } = useUserStore((state) => state);
  const { mutate: createPage } = useCreatePage();
  const { data: pages } = usePageToDiaryId(diaryId);
  const { mutate: createTenMinPlanner } = useCreateTenMinPlanner();
  const { currentPageIndex, setCurrentPageIndex } = usePageStore((state) => state);
  const { activeCardIndices, setActiveCardIndices } = useBottomSheetStore((state) => state);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // * 4개 이상의 파치먼트 옵션이 생기면 생성
  // const [currentOptionPage, setCurrentOptionPage] = useState(0);

  // parchment 옵션을 클릭하면 생성되는 페이지
  const handleAddPage = async (parchment: ParchmentType) => {
    const pageId = uuid();
    const contentId = uuid();

    // function getNextIndex(pages: PageType[]) {
    //   const maxIndex = pages.reduce((max: number, page: PageType) => {
    //     return page.index > max ? page.index : max;
    //   }, 0);

    //   return maxIndex + 1;
    // }

    const newPage = {
      id: pageId,
      content_id: contentId,
      parchment_style: parchment.parchmentStyle,
      diary_id: diaryId,
      index: pages ? pages.length + 1 : 0
    };

    createPage(newPage);

    const currentIndex = (index: number) => {
      if (index === 1) {
        return index - 1;
      } else if (index % 2 === 0) {
        return index - 2;
      } else {
        return index - 1;
      }
    };

    setCurrentPageIndex(currentIndex(newPage.index));
    if (windowWidth < 768) {
      setActiveCardIndices([currentIndex(newPage.index)]);
    } else {
      setActiveCardIndices([currentIndex(newPage.index), currentIndex(newPage.index) + 1]);
    }

    if (parchment.parchmentStyle === 'tenMinPlanner') {
      const newTenMinPlanner = {
        id: contentId,
        date: null,
        d_day_date: '',
        d_day: '',
        goal: '',
        memo: '',
        timetable: {},
        diary_id: diaryId,
        user_id: userId,
        todo_list: []
      };
      // await supabase.from('ten_min_planner').insert(newTenMinPlanner);
      createTenMinPlanner(newTenMinPlanner);
    } else if (parchment.parchmentStyle === 'lineNote') {
      const newLineNote = {
        id: contentId,
        user_id: userId,
        line_color: '',
        line_thickness: 0,
        bg_color: '',
        global_text_color: '',
        lines: Array.from({ length: 20 }, () => ({ text: '', fontSize: 16, textColor: '#000000' })),
        diary_id: diaryId
      };
      await supabase.from('line_note').insert(newLineNote);
    } else if (parchment.parchmentStyle === 'blankNote') {
      const newBlankNote = {
        id: contentId,
        user_id: userId,
        content: '',
        bgColor: '',
        globalTextColor: '',
        date: null,
        title: '',
        diary_id: diaryId
      };
      await supabase.from('blank_note').insert(newBlankNote);
    }

    // DB에 속지 추가
    // contentId
    // 그냥 추가
    addTenMinPlanner({
      id: contentId,
      date: '',
      d_day_date: '',
      d_day: '',
      goal: '',
      memo: '',
      timetable: {},
      diary_id: diaryId,
      user_id: userId,
      todo_list: []
    });
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
      {windowWidth < 768 ? (
        <div
          className="bg-white rounded-[2rem]  w-[38rem] h-[56.7rem] py-[2rem] px-[2.4rem] flex flex-col gap-[0.8rem]"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-[2.2rem] font-[600]">속지 추가</h2>
          <div className="grid grid-cols-2 gap-[1rem] ">
            {parchments.map((parchment) => (
              <div
                key={parchment.id}
                className="w-[16rem] h-[24rem] border-[0.15rem] border-[#008A02] cursor-pointer relative flex items-end justify-center"
                onClick={() => handleAddPage(parchment)}
              >
                <div className="absolute top-[1.2rem] h-[2.5rem] bg-[#008A02] rounded-[0.4rem] flex justify-center items-center text-white">
                  <div className=" h-[2.2rem] px-[0.85rem] text-[1.4rem]">{parchment.name}</div>
                </div>
                <img src={parchment.url} alt={`Page ${parchment.id}`} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className="bg-white rounded-[2rem]  w-[77.9rem] h-[47.25rem] p-[4rem] flex flex-col gap-[2rem]"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-[2.8rem] font-[600]">속지 선택</h2>
          <div className="flex flex-row justify-center gap-[1rem] ">
            {parchments.map((parchment) => (
              <div
                key={parchment.id}
                className="w-[22.5rem] h-[33.75rem] border-[0.2rem] border-[#008A02] cursor-pointer relative flex items-end justify-center"
                onClick={() => handleAddPage(parchment)}
              >
                <div className="absolute top-[1.2rem] h-[2.5rem] bg-[#008A02] rounded-[0.4rem] flex justify-center items-center text-white">
                  <div className=" h-[2.2rem] px-[1.2rem] text-[1.8rem]">{parchment.name}</div>
                </div>
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
      )}
    </div>
  );
};

export default ParchmentOptionsModal;
