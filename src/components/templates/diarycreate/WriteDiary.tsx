'use client';
import useUserStore from '@/stores/user.store';
import React, { useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { IoIosSave } from 'react-icons/io';
import { useCreateDiary, useDeleteDiary, useDiariesToUserId, useDiary, useUpdateDiary } from '@/lib/hooks/useDiaries';
import { useParams, useRouter } from 'next/navigation';
import DiaryContents from './DiaryContents';
import usePageStore from '@/stores/pages.store';
import useParchmentModalStore from '@/stores/parchment.modal.store';
import { useCreatePage } from '@/lib/hooks/usePages';

type ParamTypes = {
  [key: string]: string;
  diaryId: string;
};

const WriteDiary = () => {
  const router = useRouter();
  const { userId } = useUserStore((state) => state);
  const { diaryId } = useParams<ParamTypes>();
  const { data: diary } = useDiary(diaryId);
  const { data: diaries } = useDiariesToUserId(userId);
  const { mutate: deletePage } = useDeleteDiary();
  const { mutate: createDiary } = useCreateDiary();
  const { mutate: updateDiary } = useUpdateDiary();
  const { mutate: createPage } = useCreatePage();
  const [diaryName, setDiaryName] = useState('');
  const { pageIndex, setPageIndex, pages } = usePageStore((state) => state);
  const { toggleParchmentOptionModal } = useParchmentModalStore((state) => state);

  // diaries 테이블에서 다이어리 이름을 가져옵니다.
  useEffect(() => {
    setDiaryName(diary?.name || '');
  }, [diary]);

  // 로그인이 되어있지 않다면 로그인 해달라는 문구를 리턴합니다.
  if (!userId) {
    return <div>로그인 해주세요.</div>;
  }

  // diaries 테이블에서 다이어리를 삭제합니다.
  const deleteDiary = () => {
    const confirmDeleteDiary = confirm('정말 다이어리를 삭제하시겠습니까? 되돌릴 수 없습니다.');
    if (confirmDeleteDiary) {
      deletePage(diaryId);
      alert('다이어리가 삭제 되었습니다.');
      router.replace('/member/hub');
    }
  };

  // 다이어리 저장 : diaries 테이블에 생성,업데이트 합니다.
  // 다이어리 저장 : pages 테이블에 생성, 업데이트 합니다.
  const saveDiary = () => {
    const diaryOrder = diaries!.length + 1;

    const newDiary = {
      id: diaryId,
      user_id: userId,
      bookshelf_order: diaryOrder,
      name: diary?.name || ''
    };

    if (diary) {
      updateDiary({ id: diaryId, updateDiary: newDiary });
      alert('다이어리가 저장 되었습니다');
    } else {
      createDiary(newDiary);

      alert('다이어리가 저장 되었습니다');
    }
    router.push('/member/hub');
  };

  // 앞페이지로 이동합니다.
  const handlePrevPage = () => {
    if (pageIndex > 1) {
      setPageIndex(pageIndex - 2);
    } else if (pageIndex === 1) {
      setPageIndex(0); // 첫 페이지로 이동하려는 경우
    }
  };

  // 뒷페이지로 이동합니다.
  const handleNextPage = () => {
    if (pageIndex + 2 < pages.length) {
      setPageIndex(pageIndex + 2);
    } else if (pages[pageIndex]) {
      if (confirm('더이상 페이지가 없습니다. 추가하시겠습니까?')) {
        toggleParchmentOptionModal(); // 함수 호출을 활성화
      }
    }
  };

  return (
    <div className="flex flex-row items-center">
      <div onClick={handlePrevPage}>
        <IoIosArrowBack />
      </div>
      <div>
        <div className="flex flex-row justify-between ">
          <div className="flex flex-row">
            <IoIosArrowBack />
            <h2>{diaryName}</h2>
          </div>
          <div className="flex flex-row gap-3">
            <div onClick={deleteDiary}>
              <RiDeleteBin5Line />
            </div>
            <div onClick={saveDiary}>
              <IoIosSave />
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          <div className="w-[80rem] h-[40rem] border-2 border-gray-500">
            <DiaryContents />
          </div>
        </div>
      </div>
      <div onClick={handleNextPage}>
        <IoIosArrowForward />
      </div>
    </div>
  );
};

export default WriteDiary;
