'use client';

import React, { useRef, useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDeletePage, usePageToDiaryId, usePages, useUpdatePage } from '@/lib/hooks/usePages';
import useEditModeStore from '@/stores/editMode.store';
import { FaSave } from 'react-icons/fa';
import { FaTrashAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AddPageType } from '@/api/pages.api';

interface BlankNoteProps {
  id: string;
}

const BlankNote = ({ id }: BlankNoteProps) => {
  const [bgColor, setBgColor] = useState('#ffffff');
  const [globalTextColor, setGlobalTextColor] = useState('#000000');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [currentHeight, setCurrentHeight] = useState(0);
  const [originalContent, setOriginalContent] = useState({
    bgColor: '#ffffff',
    globalTextColor: '#000000',
    content: '',
    date: '',
    title: ''
  });
  const [diaryId, setDiaryId] = useState('');
  const { data: pages } = usePageToDiaryId(diaryId);
  const { mutate: deletePage, isPending, isError } = useDeletePage();
  const { mutate: updateDbPage } = useUpdatePage();
  const { isEditMode } = useEditModeStore((state) => state);

  const searchParams = useSearchParams();
  const index = Number(searchParams.get('index'));
  const style = searchParams.get('style');

  const router = useRouter();

  const editableDivRef = useRef<HTMLDivElement>(null);
  const maxHeight = 1000;

  useEffect(() => {
    fetchDiaryData();
  }, []);

  useEffect(() => {
    if (editableDivRef.current && editableDivRef.current.innerText !== content) {
      editableDivRef.current.innerText = content;
    }
  }, [content]);

  useEffect(() => {
    if (editableDivRef.current) {
      setCurrentHeight(editableDivRef.current.scrollHeight);
    }
  }, []);

  const fetchDiaryData = async () => {
    const { data, error } = await supabase.from('blank_note').select('*').eq('id', id).maybeSingle();

    if (error) {
      console.error('데이터 불러오기 오류:', error);
      return;
    }

    if (data) {
      setBgColor(data.bgColor ?? '#ffffff');
      setGlobalTextColor(data.globalTextColor ?? '#000000');
      setContent(data.content ?? '');
      setDate(data.date ?? '');
      setTitle(data.title ?? '');
      setOriginalContent({
        bgColor: data.bgColor ?? '#ffffff',
        globalTextColor: data.globalTextColor ?? '#000000',
        content: data.content ?? '',
        date: data.date ?? '',
        title: data.title ?? ''
      });
      // setIsEditMode(false);
      setDiaryId(data.diary_id ?? '');
    } else {
      setBgColor('#ffffff');
      setGlobalTextColor('#000000');
      setContent('');
      setDate('');
      setTitle('');
      // setIsEditMode(true);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const target = e.currentTarget as HTMLDivElement;
    const newHeight = target.scrollHeight;
    setCurrentHeight(newHeight);

    if (newHeight > maxHeight) {
      alert('마지막 줄 입니다.');
      target.innerText = content;
      setCurrentHeight(editableDivRef.current?.scrollHeight || 0);
    } else {
      setContent(target.innerText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (currentHeight >= maxHeight && e.key !== 'Backspace' && e.key !== 'Delete') {
      e.preventDefault();
    }
  };

  const handleSaveOrUpdate = async () => {
    if (!date) {
      alert('날짜를 입력해주세요.');
      return;
    }
    if (!title) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!content) {
      alert('내용을 입력해주세요.');
      return;
    }

    const newData = {
      id: id,
      date: date,
      title: title,
      content: content,
      bgColor: bgColor,
      globalTextColor: globalTextColor
    };

    await supabase.from('blank_note').update(newData).eq('id', id);

    alert('내용이 저장되었습니다.');
    router.replace(`/member/diary/${diaryId}/parchment`);
  };

  if (isPending) {
    return (
      <div>
        <div className="fixed inset-0 flex items-center justify-center w-screen h-screen bg-[#F9FCF9]">
          <img src="/images/loading.gif" alt="Loading" width={150} height={150} />
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    if (confirm('내용을 삭제 하시겠습니까?')) {
      const { error: blankNoteError } = await supabase.from('blank_note').delete().eq('id', id);
      deletePage(id);
      if (blankNoteError) {
        alert('삭제 중 오류가 발생했습니다: ' + blankNoteError.message);
      } else if (isError) {
        alert('삭제 중 오류가 발생했습니다');
      } else {
        alert('삭제되었습니다!');
        router.push(`/member/diary/${diaryId}/parchment`);
      }
    }
    pages?.map((p: AddPageType) => {
      if (p.content_id !== id && p.index > index) {
        updateDbPage({ id: p.id, updatePage: { ...p, index: p.index - 1 } });
      }
    });
  };

  // const handleEditModeToggle = () => {
  //   if (isEditMode) {
  //     setBgColor(originalContent.bgColor);
  //     setGlobalTextColor(originalContent.globalTextColor);
  //     setContent(originalContent.content);
  //     setDate(originalContent.date);
  //     setTitle(originalContent.title);
  //   } else {
  //     setOriginalContent({
  //       bgColor: bgColor,
  //       globalTextColor: globalTextColor,
  //       content: content,
  //       date: date,
  //       title: title
  //     });
  //   }
  // };

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
    <div
      className={`sm:w-[32.5rem] w-[45rem] ${
        isEditMode ? 'sm:h-[48.7rem] h-[67.5rem]' : 'sm:h-[45.6rem] h-[63.2rem]'
      } bg-white border-[0.1rem] border-[#C7D2B0]`}
    >
      <div className="mx-auto w-full">
        {isEditMode ? (
          <div className="bg-[#EDF1E6] w-full sm:h-[3.1rem] h-[4.3rem] sm:pt-[0.8rem] pt-[1.1rem] sm:px-[1.5rem] px-[1.35rem] border-b-[0.1rem] border-[#C7D2B0] flex flex-row justify-between items-center">
            <div className="sm:text-[1.2rem] text-[1.62rem] text-[#496E00] font-[600]">
              {index} Page_{changeStyleName()} (수정중)
            </div>
            <div>
              <button
                className="sm:text-[1.6rem] text-[2.16rem] text-[#496E00] hover:text-black mr-[1.08rem]"
                onClick={handleSaveOrUpdate}
                title="클릭해서 저장!"
              >
                <FaSave />
              </button>
              <button
                className="sm:text-[1.6rem] text-[2.16rem] text-[#496E00] hover:text-black"
                onClick={handleDelete}
                title="클릭하면 삭제!"
              >
                <FaTrashAlt />
              </button>
            </div>
          </div>
        ) : (
          <div className="sm:h-[3.1rem] h-[4.32rem]"></div>
        )}
      </div>
      <div className="mt-[1.3rem] mx-auto sm:w-[29.9rem] w-[41.4rem] sm:h-[43rem] h-[59.58rem]">
        <div className="flex flex-col sm:gap-[1.56rem] gap-[2.16rem]">
          {isEditMode ? (
            <div className="flex justify-between sm:w-[14.3rem] w-[19.8rem] ">
              <label className="flex sm:w-[5.5rem] w-[10rem] sm:h-[1.43rem] h-[1.98rem] justify-between items-center">
                <p className="text-forestGreen font-[600] sm:text-[0.78rem] w-[5rem] text-[1.08rem]">배경 색상</p>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="square-color-input"
                  disabled={!isEditMode}
                />
              </label>
              <label className="flex sm:w-[6.5rem] w-[12rem] sm:h-[1.43rem] h-[1.98rem] justify-between items-center">
                <p className="text-forestGreen font-[600] w-[6.5rem] sm:text-[0.78rem] text-[1.08rem] ">텍스트 색상</p>
                <input
                  type="color"
                  value={globalTextColor}
                  onChange={(e) => setGlobalTextColor(e.target.value)}
                  className="square-color-input "
                  disabled={!isEditMode}
                />
              </label>
            </div>
          ) : null}
          <div className="flex justify-between items-center">
            <div className="flex flex-col sm:w-[19.7rem] w-[27rem] border-b-[0.27rem] sm:h-[1.72rem] h-[2.42rem]">
              <label htmlFor="title" className="flex items-center sm:gap-[0.26rem] gap-[0.36rem]">
                <p className="text-forestGray font-[600] sm:text-[0.97rem] text-[1.35rem] ">TITLE</p>
                <input
                  id="title"
                  type="text"
                  className="w-full h-full sm:text-[0.97rem] text-[1.35rem] bg-transparent border-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={!isEditMode}
                  placeholder="제목을 입력해주세요"
                />
              </label>
            </div>
            <div className="flex flex-col sm:w-[9.44rem] w-[13.05rem] border-b-[0.27rem] sm:h-[1.72rem] h-[2.42rem]">
              <label htmlFor="date" className="flex items-center sm:gap-[0.26rem] gap-[0.36rem]">
                <p className="text-forestGray font-[600] sm:text-[0.97rem] text-[1.35rem]">DATE</p>
                <div className="relative">
                  <DatePicker
                    selected={date ? new Date(date) : null}
                    onChange={(date) => setDate(date ? date.toISOString().split('T')[0] : '')}
                    dateFormat="yyyy/MM/dd"
                    className="w-full h-full sm:text-[0.97rem] text-[1.5rem] bg-transparent border-none placeholder-[#181818]"
                    disabled={!isEditMode}
                    placeholderText="연도-월-일"
                  />
                </div>
              </label>
            </div>
          </div>
        </div>
        <div
          ref={editableDivRef}
          contentEditable={isEditMode}
          className="p-[0.9rem] sm:mt-[1.56rem] mt-[2.16rem] sm:w-[30rem] w-[41.4rem] sm:h-[36.5rem] h-[51.5rem] overflow-hidden sm:text-[1rem] text-[1.44rem] overflow-y-hidden break-all whitespace-pre-wrap"
          style={{
            color: globalTextColor,
            backgroundColor: bgColor
          }}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
        ></div>
      </div>
    </div>
  );
};

export default BlankNote;
