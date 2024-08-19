import BlankNote from '@/components/molecules/parchment/BlankNote';
import LineNote from '@/components/molecules/parchment/LineNote';
import TenMinPlanner from '@/components/molecules/parchment/TenMinPlanner';
import { PageType } from '@/stores/pages.store';
import { FaRegEdit } from 'react-icons/fa';
import React from 'react';
import { useDeletePage, usePageToDiaryId } from '@/lib/hooks/usePages';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { FaTrashAlt } from 'react-icons/fa';
import { useDeleteTenMinPlanner, useTenMinPlanner } from '@/lib/hooks/useTenMinPlanner';
import { supabase } from '@/supabase/client';

interface ShowContentsProps {
  page: PageType;
  diaryId: string;
}

const ParchmentContent = ({ page, diaryId }: ShowContentsProps) => {
  const { data: pages, isPending } = usePageToDiaryId(diaryId);
  const { mutate: deleteDbPage } = useDeletePage();
  const { mutate: deleteDbTenMinPlanner } = useDeleteTenMinPlanner();
  const router = useRouter();

  const pageStyle = () => {
    if (page.parchment_style === 'tenMinPlanner') {
      return '10분플래너';
    } else if (page.parchment_style === 'lineNote') {
      return '줄글노트';
    } else if (page.parchment_style === 'blankNote') {
      return '무지노트';
    } else {
      return '';
    }
  };

  const handleEditMode = ({ id, style }: { id: string; style: string }) => {
    const url = `/member/diary/${diaryId}/parchment/${id}?style=${encodeURIComponent(style)}&index=${diaryIndex}`;
    Swal.fire({
      title: `${pageStyle()}를 수정하시겠습니까?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '예',
      cancelButtonText: '아니오'
    }).then((result) => {
      if (result.isConfirmed) {
        router.push(url);
      }
    });
  };

  const deletePage = (style: string) => {
    Swal.fire({
      title: `${pageStyle()}를 삭제하시겠습니까?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '예',
      cancelButtonText: '아니오'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteDbPage(page.content_id);
        if (style === 'tenMinPlanner') {
          deleteDbTenMinPlanner(page.content_id);
        } else if (style === 'lineNote') {
          supabase.from('line_note').delete().eq('id', page.content_id);
        } else if (style === 'blankNote') {
          supabase.from('blank_note').delete().eq('id', page.content_id);
        }
      }
    });
  };

  if (isPending) <div>로딩중...</div>;
  if (!pages) return null;
  if (!page) return null;
  const diaryIndex = pages?.indexOf(page) + 1;

  return (
    <div key={page.id} className="mx-auto w-full ">
      <div className="bg-[#EDF1E6] w-full  sm:h-[3.1rem] h-[4.8rem] sm:py-[0.8rem] py-[1.2rem] sm:px-[1.3rem] px-[1.5rem] flex flex-row justify-between border-x-[0.1rem] border-t-[0.1rem] border-[#C7D2B0] ">
        <div className="sm:text-[1.2rem] text-[1.62rem] text-[#C7D2B0] font-[600]">
          {diaryIndex} Page_{pageStyle()}
        </div>
        <div className="flex gap-[1rem]">
          <button
            className="sm:text-[1.6rem] text-[2.16rem] text-[#496E00]  hover:text-black"
            onClick={() => {
              handleEditMode({ id: page.content_id, style: page.parchment_style });
            }}
          >
            <FaRegEdit />
          </button>
          <button
            className="sm:text-[1.6rem] text-[2.16rem] text-[#496E00]  hover:text-black"
            onClick={() => deletePage(page.parchment_style)}
          >
            <FaTrashAlt />
          </button>
        </div>
      </div>
      {page.parchment_style === 'tenMinPlanner' ? (
        <TenMinPlanner id={page.content_id} />
      ) : page.parchment_style === 'lineNote' ? (
        <LineNote id={page.content_id} />
      ) : page.parchment_style === 'blankNote' ? (
        <BlankNote id={page.content_id} />
      ) : null}
    </div>
  );
};

export default ParchmentContent;
