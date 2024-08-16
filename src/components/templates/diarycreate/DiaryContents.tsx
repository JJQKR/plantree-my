'use client';

import { usePageToDiaryId } from '@/lib/hooks/usePages';
import useParchmentModalStore from '@/stores/parchment.modal.store';
import React from 'react';
import ShowContents from './ShowContents';
import { FaPlus } from 'react-icons/fa';

interface DiaryContentsProps {
  diaryId: string;
  currentPageIndex: number;
}

const DiaryContents = ({ diaryId, currentPageIndex }: DiaryContentsProps) => {
  const { data: pages, isPending } = usePageToDiaryId(diaryId);
  const { toggleParchmentOptionModal } = useParchmentModalStore((state) => state);

  // const handleEditMode = ({ id, style }: { id: string; style: string }) => {
  //   const url = `/member/diary/${diaryId}/parchment/${id}?style=${encodeURIComponent(style)}`;
  //   router.push(url);
  // };

  // const showContent = (page: PageType) => {
  //   console.log(currentPageIndex);
  //   return (
  //     <div key={page.id} className="mx-auto w-full h-full">
  //       <div className="bg-[#EDF1E6] w-full h-[4.8rem] py-[1.2rem] px-[1.5rem] flex flex-row justify-between">
  //         <div className="text-[1.8rem] text-[#C7D2B0] font-[600]">{pages!.indexOf(page) + 1} Page</div>
  //         <button
  //           className="text-[2.4rem] text-[#496E00]"
  //           onClick={() => {
  //             handleEditMode({ id: page.content_id, style: page.parchment_style });
  //           }}
  //         >
  //           <FaRegEdit />
  //         </button>
  //       </div>

  //       {page.parchment_style === 'tenMinPlanner' ? (
  //         <TenMinPlanner id={page.content_id} />
  //       ) : page.parchment_style === 'lineNote' ? (
  //         <LineNote id={page.content_id} />
  //       ) : page.parchment_style === 'blankNote' ? (
  //         <BlankNote id={page.content_id} />
  //       ) : null}
  //     </div>
  //   );
  // };

  if (isPending) {
    // TODO: skeleton
    return '로딩중';
  }

  return (
    <div className="flex">
      <div className="  flex items-center justify-center">
        {pages?.[currentPageIndex] ? (
          <div className=" w-[50rem] h-[75rem] bg-white shadow-lg">
            <ShowContents page={pages[currentPageIndex]} diaryId={diaryId} />
          </div>
        ) : (
          <div
            className="w-[50rem] h-[75rem] border-dashed bg-[#EDF1E6] border-[0.1rem] border-[#ABBC8A] flex items-center justify-center cursor-pointer"
            onClick={toggleParchmentOptionModal}
          >
            <span className="text-[#ABBC8A] text-[3rem] flex flex-row items-center gap-[1.1rem]">
              <FaPlus /> 속지 추가
            </span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-center">
        {pages?.[currentPageIndex + 1] ? (
          <div className="w-[50rem] h-[75rem] bg-white shadow-lg">
            <ShowContents page={pages[currentPageIndex + 1]} diaryId={diaryId} />
          </div>
        ) : pages?.[currentPageIndex] ? (
          <div
            className="w-[50rem] h-[75rem] border-dashed bg-[#EDF1E6] border-[0.1rem] border-[#ABBC8A] flex items-center justify-center cursor-pointer"
            onClick={toggleParchmentOptionModal}
          >
            <span className="text-[#ABBC8A] text-[3rem] flex flex-row items-center gap-[1.1rem]">
              <FaPlus /> 속지 추가
            </span>
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
