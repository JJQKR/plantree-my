'use client';

import { useSearchParams, useParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import TenMinPlanner from '../molecules/parchment/TenMinPlanner';
import LineNote from '../molecules/parchment/LineNote';
import BlankNote from '../molecules/parchment/BlankNote';
import useEditModeStore from '@/stores/editMode.store';
import { PageType } from '@/stores/pages.store';
import { FaRegEdit } from 'react-icons/fa';
import { usePage } from '@/lib/hooks/usePages';
import { FaTrashAlt } from 'react-icons/fa';
import { FaSave } from 'react-icons/fa';

const styleDbNames = {
  tenMinPlanner: 'ten_min_planner',
  lineNote: 'line_note',
  blankNote: 'blank_note'
};

// url에서 content_id(id) & style을 가져온다
// style을 보고 db를 정한 후 id를 이용하여 속지 데이터를 가져온다
// 컴포넌트에 데이터를 넣어준다
const EditParchment = () => {
  const searchParams = useSearchParams();
  const style = searchParams.get('style');
  const index = searchParams.get('index');
  const { id } = useParams<{ id: string }>();
  const { onEditMode } = useEditModeStore((state) => state);
  const { data: page } = usePage(id);

  useEffect(() => {
    onEditMode();
  }, []);

  const changeStyleName = () => {
    if (style === 'tenMinPlanner') {
      return '10분 플래너';
    } else if (style === 'lineNote') {
      return '줄글노트';
    } else if (style === 'stringNote') {
      return '무지노트';
    }
  };

  return (
    <div>
      <div key={page?.id} className="mx-auto w-full h-full">
        {/* <div className="bg-[#EDF1E6] w-full h-[4.8rem] py-[1.2rem] px-[1.5rem] flex flex-row justify-between">
          <div className="text-[1.8rem] text-[#496E00] font-[600]">
            {index} Page_{changeStyleName()}
          </div>
          <div className="flex flex-row gap-[1rem]">
            <span className="text-[2.4rem] text-[#496E00]">
              <FaSave />
            </span>
            <span className="text-[2.4rem] text-[#496E00]">
              <FaTrashAlt />
            </span>
          </div>
        </div> */}
      </div>
      {style === 'tenMinPlanner' ? (
        <TenMinPlanner id={id} />
      ) : style === 'lineNote' ? (
        <LineNote id={id} />
      ) : style === 'blankNote' ? (
        <BlankNote id={id} />
      ) : null}
    </div>
  );
};

export default EditParchment;
