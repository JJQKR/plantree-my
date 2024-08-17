import BlankNote from '@/components/molecules/parchment/BlankNote';
import LineNote from '@/components/molecules/parchment/LineNote';
import TenMinPlanner from '@/components/molecules/parchment/TenMinPlanner';
import { PageType } from '@/stores/pages.store';
import { FaRegEdit } from 'react-icons/fa';
import React from 'react';
import { usePageToDiaryId } from '@/lib/hooks/usePages';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

interface ShowContentsProps {
  page: PageType;
  diaryId: string;
}

const ParchmentContent = ({ page, diaryId }: ShowContentsProps) => {
  const { data: pages, isPending } = usePageToDiaryId(diaryId);
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
  if (isPending) <div>로딩중...</div>;
  if (!pages) return null;
  if (!page) return null;
  const diaryIndex = pages?.indexOf(page) + 1;

  return (
    <div key={page.id} className="mx-auto w-full h-full">
      <div className="bg-[#EDF1E6] w-full h-[4.8rem] py-[1.2rem] px-[1.5rem] flex flex-row justify-between border-x-[0.1rem] border-t-[0.1rem] border-[#C7D2B0] ">
        <div className="text-[1.8rem] text-[#C7D2B0] font-[600]">
          {diaryIndex} Page_{pageStyle()}
        </div>
        <button
          className="text-[2.4rem] text-[#496E00]"
          onClick={() => {
            handleEditMode({ id: page.content_id, style: page.parchment_style });
          }}
        >
          <FaRegEdit />
        </button>
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
