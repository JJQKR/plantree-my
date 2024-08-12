'use client';
import React, { useState } from 'react';
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

  // * 4개 이상의 파치먼트 옵션이 생기면 생성
  // const [currentOptionPage, setCurrentOptionPage] = useState(0);

  // parchment 옵션을 클릭하면 생성되는 페이지
  const handleAddPage = async (parchment: ParchmentType) => {
    const pageId = uuid();
    const contentId = uuid();

    function getNextIndex(pages: PageType[]) {
      const maxIndex = pages.reduce((max: number, page: PageType) => {
        return page.index > max ? page.index : max;
      }, 0);

      return maxIndex + 1;
    }

    const newPage = {
      id: pageId,
      content_id: contentId,
      parchment_style: parchment.parchmentStyle,
      diary_id: diaryId,
      index: pages ? getNextIndex(pages) : 0
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
        lines: Array.from({ length: 16 }, () => ({ text: '', fontSize: 16, textColor: '#000000' })),
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
