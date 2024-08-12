// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useDiaryCoverStore } from '@/stores/diarycover.store';
// import { addCover, deleteCover, updateCover } from '@/services/diarycover.service';
// import LineNote from '@/components/molecules/parchment/LineNote';
// import useUserStore from '@/stores/user.store';
// import { supabase } from '@/supabase/client';

// import TenMinPlanner from '@/components/molecules/parchment/TenMinPlanner';
// import { useDeletePage, usePageToDiaryId, useUpdatePage } from '@/lib/hooks/usePages';
// import { AddPageType } from '@/api/pages.api';
// import { useCreateDiary, useDiariesToUserId, useDiary, useUpdateDiary } from '@/lib/hooks/useDiaries';
// import { UpdateDiaryType } from '@/api/diaries.api';
// import BlankNote from '@/components/molecules/parchment/BlankNote';

// type ParamTypes = {
//   [key: string]: string;
//   diaryId: string;
// };

// const DiaryParchmentPage = () => {
//   const router = useRouter();
//   const { diaryId } = useParams<ParamTypes>();

//   const { currentPage, setCurrentPage, coverTitle } = useDiaryCoverStore();
//   const { userId } = useUserStore((state) => state);

//   const [isEditMode, setIsEditMode] = useState<boolean>(false);

//   const { mutate: deletePage } = useDeletePage();
//   const { mutate: updatePage } = useUpdatePage();
//   const { data: pages, isLoading, error } = usePageToDiaryId(diaryId);
//   const { mutate: createDiary } = useCreateDiary();
//   const { mutate: updateDiary } = useUpdateDiary();
//   const { data: diaries } = useDiariesToUserId(userId);
//   const { data: diary } = useDiary(diaryId);

//   if (!userId) {
//     return <div>로그인 해주세요.</div>;
//   }

//   const handleDeletePage = async (deletedPage: AddPageType) => {
//     const confirmDelete = confirm('이 페이지를 삭제하시겠습니까?');
//     if (!confirmDelete) return;
//     try {
//       deletePage(deletedPage.id);
//       const updatePromises = pages
//         ?.filter((page) => page.index > deletedPage.index)
//         .map(async (page) => {
//           return updatePage({
//             id: page.id,
//             updatePage: {
//               ...page,
//               index: page.index - 1
//             }
//           });
//         });
//       if (updatePromises && updatePromises.length > 0) {
//         await Promise.all(updatePromises);
//       }
//     } catch (error) {
//       console.error('Error during update:', error);
//     }
//   };

//   const handleFinalSave = async () => {
//     const maxOrder =
//       diaries?.reduce((max: number, diary: UpdateDiaryType) => Math.max(max, diary.bookshelf_order), 0) || 0;
//     const newOrder = maxOrder + 1;

//     const newDiary = {
//       id: diaryId,
//       user_id: userId,
//       bookshelf_order: newOrder,
//       name: coverTitle
//     };

//     try {
//       if (diary) {
//         updateDiary({ id: diaryId, updateDiary: newDiary });

//         alert('diary 업데이트 성공!');
//       } else {
//         createDiary(newDiary);

//         alert('diary 저장 성공!');
//       }
//       router.push('/member/hub');
//     } catch (error) {
//       console.error('diary 저장 실패:', error);
//       alert('diary 저장 실패');
//     }
//   };

//   const handlePrevPage = () => {
//     const prevPageIndex = currentPage - 2;
//     if (prevPageIndex >= 0) {
//       setCurrentPage(prevPageIndex);
//     }
//   };

//   const handleAddPageClick = () => {
//     useDiaryCoverStore.getState().togglePageOptions();
//   };

//   const handleDeleteDiary = async () => {
//     if (!confirm('다이어리를 삭제하시겠습니까?')) {
//       return;
//     }

//     try {
//       alert('삭제 성공');
//       router.push('/member');
//     } catch (error) {
//       console.error('삭제 실패:', error);
//       alert('삭제 실패');
//     }
//   };

//   const renderPage = (page: AddPageType) => (
//     <div key={page.id} className="relative w-[512px] h-[800px] bg-white shadow-lg p-2">
//       <button
//         onClick={() => handleDeletePage(page)}
//         className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
//       >
//         &times;
//       </button>
//       <div className="absolute top-2 left-2 text-gray-800 text-3xl px-2 py-1 rounded">Page {page.index}</div>
//       {page.parchment_style === 'tenMinPlanner' ? (
//         <TenMinPlanner />
//       ) : page.parchment_style === 'lineNote' ? (
//         <LineNote userId={userId} className="w-full max-w-screen-md max-h-screen overflow-auto mt-20" />
//       ) : page.parchment_style === 'blankNote' ? (
//         <BlankNote diaryId={diaryId} userId={userId} pageId={page.id} />
//       ) : (
//         <img className="w-full h-full object-cover" />
//       )}
//     </div>
//   );

//   const confirmSave = async () => {
//     const confirmSave = confirm(isEditMode ? '다이어리를 수정 하시겠습니까?' : '다이어리를 저장 하시겠습니까?');
//     if (confirmSave) {
//       await handleFinalSave();
//     }
//   };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error loading pages. Please try again later.</div>;
//   }

//   if (!pages) {
//     return <div>No pages available.</div>;
//   }

//   if (!userId) {
//     return <div>Please log in.</div>;
//   }

//   const handleNextPage = () => {
//     const nextPageIndex = currentPage + 2;
//     if (nextPageIndex < pages.length) {
//       setCurrentPage(nextPageIndex);
//     }
//   };
//   return (
//     <div className="flex flex-col overflow-hidden px-4">
//       <div className="flex justify-between mt-2">
//         <button
//           onClick={handlePrevPage}
//           disabled={currentPage === 0}
//           className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded transition duration-300"
//         >
//           이전
//         </button>
//         <button
//           onClick={handleNextPage}
//           disabled={currentPage >= pages.length - 1}
//           className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded transition duration-300"
//         >
//           다음
//         </button>
//       </div>
//       <div className="flex justify-end my-2">
//         <button
//           onClick={confirmSave}
//           className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded transition duration-300"
//         >
//           {isEditMode ? '다이어리 수정' : '저장하기'}
//         </button>
//         {!isEditMode && (
//           <button
//             onClick={handleDeleteDiary}
//             className="ml-2 px-2 py-1 bg-red-500 hover:bg-red-600 text-white font-semibold rounded transition duration-300"
//           >
//             다이어리 삭제
//           </button>
//         )}
//       </div>
//       <div className="grid grid-cols-2 gap-4">
//         <div className="border-r border-gray-300 flex items-center justify-center">
//           {pages[currentPage] ? (
//             renderPage(pages[currentPage])
//           ) : (
//             <div
//               className="w-[512px] h-[800px] flex items-center justify-center border-2 border-dashed border-gray-600 cursor-pointer"
//               onClick={handleAddPageClick}
//             >
//               <span className="text-gray-600 text-4xl">+ 속지 추가</span>
//             </div>
//           )}
//         </div>

//         <div className="flex items-center justify-center">
//           {pages[currentPage + 1] ? (
//             renderPage(pages[currentPage + 1])
//           ) : pages[currentPage] ? (
//             <div
//               className="w-[512px] h-[800px] flex items-center justify-center border-2 border-dashed border-gray-600 cursor-pointer"
//               onClick={handleAddPageClick}
//             >
//               <span className="text-gray-600 text-4xl">+ 속지 추가</span>
//             </div>
//           ) : null}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DiaryParchmentPage;
