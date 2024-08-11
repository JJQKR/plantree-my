'use client';

import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { IoIosSave } from 'react-icons/io';
import DiaryContents from './diarycreate/DiaryContents';
import { useEffect, useState } from 'react';
import { getCover } from '@/services/diarycover.service';
import { useParams } from 'next/navigation';

export default function ParchmentList() {
  // 커버 타이틀 가져오는 코드
  const [coverTitle, setCoverTitle] = useState('');
  const { diaryId } = useParams<{ diaryId: string }>();
  useEffect(() => {
    if (diaryId) {
      const getCoverTitle = async () => {
        const diaryCover = await getCover(diaryId);
        setCoverTitle(diaryCover.cover_title);
      };
      getCoverTitle();
    }
  }, [diaryId]);

  // 현재 페이지 index
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // 0. 속지 추가 UI를 먼저 만든다. V
  // 0-1. url의 diaryId를 이용해서 cover 뒤져서 cover 타이틀 가져온다. V
  // 페이지 추가 시 DB에 page 데이터 & 속지테이블(tenMinPlanner V , 무지 V, 줄글 V)

  // 이미 존재하는 page들을 가져와야 함 V
  // 편집 모드 버튼 클릭 시 상세페이지 이동 V
  // 상세페이지에서 컴포넌트 수정
  // 속지리스트 -> 수정이 안되게
  // page의 contentId와 parchme         ntStyle에 따라 또 DB에서 가져와야 함 => 속지 내부 데이터를 가져온다. => 나중에
  return (
    // 1. 속지 여러 개를 담는 큰 박스 만든다
    // 2. 속지 하나하나의 div
    // 3. 추가 버튼 시 modal 띄우고
    // 4. 모달에서 선택하면 해당하는 데이터가 비어있는 컴포넌트를 뒤에 추가한다.
    <div className="flex flex-row items-center">
      <div onClick={() => {}}>
        <IoIosArrowBack />
      </div>
      <div>
        <div className="flex flex-row justify-between ">
          <div className="flex flex-row">
            <IoIosArrowBack />
            <h2>{coverTitle}</h2>
          </div>
          <div className="flex flex-row gap-3">
            <div onClick={() => {}}>
              <RiDeleteBin5Line />
            </div>
            <div onClick={() => {}}>
              <IoIosSave />
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          <div className="w-[91.6rem] h-[60rem] border-2 border-gray-500">
            <DiaryContents diaryId={diaryId} pageIndex={currentPageIndex} />
          </div>
        </div>
      </div>
      <div onClick={() => {}}>
        <IoIosArrowForward />
      </div>
    </div>
  );
}
