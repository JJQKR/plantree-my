'use client';

import BlankNote from '@/components/molecules/parchment/BlankNote';
import LineNote from '@/components/molecules/parchment/LineNote';
import TenMinPlanner from '@/components/molecules/parchment/TenMinPlanner';
import { usePageToDiaryId } from '@/lib/hooks/usePages';
import { PageType } from '@/stores/pages.store';
import useParchmentModalStore from '@/stores/parchment.modal.store';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

interface DiaryContentsProps {
  diaryId: string;
  pageIndex: number;
}

const DiaryContents = ({ diaryId, pageIndex }: DiaryContentsProps) => {
  const { data: pages, isPending } = usePageToDiaryId(diaryId);
  const router = useRouter();
  const { toggleParchmentOptionModal } = useParchmentModalStore((state) => state);

  useEffect(() => {}, []);

  const handleEditMode = ({ id, style }: { id: string; style: string }) => {
    const url = `/member/diary/${diaryId}/parchment/${id}?style=${encodeURIComponent(style)}`;
    router.push(url);
  };

  const showContent = (page: PageType) => {
    return (
      <div key={page.id} className="mx-auto mt-[2rem] w-[46rem] h-[70rem] bg-transparent ">
        {/* <button
          onClick={() => {}}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-[2rem] flex items-center justify-center z-10"
        >
          &times;
        </button> */}
        <button
          className="bg-blue-300"
          onClick={() => {
            handleEditMode({ id: page.content_id, style: page.parchment_style });
          }}
        >
          수정하기
        </button>
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

  if (isPending) {
    // TODO: skeleton
    return '로딩중';
  }

  return (
    <div className="flex">
      <div className="  flex items-center justify-center">
        {pages?.[pageIndex] ? (
          <div className='relative w-[48.8rem] h-[72rem] bg-white shadow-lg p-2"'>
            {showContent(pages[pageIndex])}
            <div className="absolute bottom-[2rem] left-[2rem] text-gray-800 text-3xl px-2 py-1 rounded">
              {pages.indexOf(pages[pageIndex]) + 1}
            </div>
          </div>
        ) : (
          <div
            className="w-[45.8rem] h-[72rem] flex items-center justify-center cursor-pointer"
            onClick={toggleParchmentOptionModal}
          >
            <span className="text-[#9E9E9E] text-[3rem]">+ 속지 추가</span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-center">
        {pages?.[pageIndex + 1] ? (
          <div className='relative w-[48.8rem] h-[72rem] bg-white shadow-lg p-2"'>
            {showContent(pages[pageIndex + 1])}
            <div className="absolute bottom-[2rem] right-[2rem] text-gray-800 text-3xl px-2 py-1 rounded">
              {pages.indexOf(pages[pageIndex + 1]) + 1}
            </div>
          </div>
        ) : pages?.[pageIndex] ? (
          <div
            className="w-[45.8rem] h-[72rem] flex items-center justify-center cursor-pointer"
            onClick={toggleParchmentOptionModal}
          >
            <span className="text-[#9E9E9E] text-4xl">+ 속지 추가</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

// BEFORE
// const DiaryContents = () => {
//   const { pageIndex, pages, removePage } = usePageStore((state) => state);
//   const { toggleParchmentOptionModal } = useParchmentModalStore((state) => state);

//   // const handleDeletePage = async (deletedPage: AddPageType) => {
//   //   const confirmDelete = confirm('이 페이지를 삭제하시겠습니까?');
//   //   if (!confirmDelete) return;
//   //   try {
//   //     deletePage(deletedPage.id);
//   //     const updatePromises = pages
//   //       ?.filter((page) => page.index > deletedPage.index)
//   //       .map(async (page) => {
//   //         return updatePage({
//   //           id: page.id,
//   //           updatePage: {
//   //             ...page,
//   //             index: page.index - 1
//   //           }
//   //         });
//   //       });
//   //     if (updatePromises && updatePromises.length > 0) {
//   //       await Promise.all(updatePromises);
//   //     }
//   //   } catch (error) {
//   //     console.error('Error during update:', error);
//   //   }
//   // };

//   const handleDeletePage = (deletePageId: string) => {
//     const confirmDelete = confirm('이 페이지를 삭제하시겠습니까?');
//     if (!confirmDelete) return;
//     removePage(deletePageId);
//   };

//   const showContent = (page: PageType) => {
//     return (
//       <div key={page.id} className="relative w-[45.8rem] h-[60rem] bg-white shadow-lg p-2">
//         <button
//           onClick={() => handleDeletePage(page.id)}
//           className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-[2rem] flex items-center justify-center z-10"
//         >
//           &times;
//         </button>
//         {page.parchment_style === 'tenMinPlanner' ? (
//           <TenMinPlanner id={page.content_id} />
//         ) : page.parchment_style === 'lineNote' ? (
//           <LineNote />
//         ) : page.parchment_style === 'blankNote' ? (
//           <BlankNote />
//         ) : (
//           <img className="w-full h-full object-cover" />
//         )}
//         <div className="absolute top-2 left-2 text-gray-800 text-3xl px-2 py-1 rounded">
//           Page {pages.indexOf(page) + 1}
//         </div>
//       </div>
//     );
//   };

//   if (!pages) {
//     return <div>No pages available.</div>;
//   }

//   return (
//     <div className="grid grid-cols-2">
//       <div className="border-r border-gray-300 h-[60rem] flex items-center justify-center">
//         {pages[pageIndex] ? (
//           showContent(pages[pageIndex])
//         ) : (
//           <div
//             className="w-[45.8rem] h-[60rem] flex items-center justify-center border-2 border-dashed border-gray-600 cursor-pointer"
//             onClick={toggleParchmentOptionModal}
//           >
//             <span className="text-gray-600 text-4xl">+ 속지 추가</span>
//           </div>
//         )}
//       </div>
//       <div className="flex items-center justify-center">
//         {pages[pageIndex + 1] ? (
//           showContent(pages[pageIndex + 1])
//         ) : pages[pageIndex] ? (
//           <div
//             className="w-[45.8rem] h-[60rem] flex items-center justify-center border-2 border-dashed border-gray-600 cursor-pointer"
//             onClick={toggleParchmentOptionModal}
//           >
//             <span className="text-gray-600 text-4xl">+ 속지 추가</span>
//           </div>
//         ) : null}
//       </div>
//     </div>
//   );
// };

export default DiaryContents;
