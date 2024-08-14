'use client';

import React, { useRef, useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDeletePage } from '@/lib/hooks/usePages';
import useEditModeStore from '@/stores/editMode.store';
import { FaSave } from 'react-icons/fa';
import { FaTrashAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
  // const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [originalContent, setOriginalContent] = useState({
    bgColor: '#ffffff',
    globalTextColor: '#000000',
    content: '',
    date: '',
    title: ''
  });
  const [diaryId, setDiaryId] = useState('');
  const { mutate: deletePage, isPending, isError } = useDeletePage();
  const { isEditMode } = useEditModeStore((state) => state);

  const searchParams = useSearchParams();
  const index = searchParams.get('index');
  const style = searchParams.get('style');

  const router = useRouter();

  const editableDivRef = useRef<HTMLDivElement>(null);
  const maxHeight = 1000;
  const [selectedDate, setSelectedDate] = useState(new Date());

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
  };

  const handleEditModeToggle = () => {
    if (isEditMode) {
      setBgColor(originalContent.bgColor);
      setGlobalTextColor(originalContent.globalTextColor);
      setContent(originalContent.content);
      setDate(originalContent.date);
      setTitle(originalContent.title);
    } else {
      setOriginalContent({
        bgColor: bgColor,
        globalTextColor: globalTextColor,
        content: content,
        date: date,
        title: title
      });
    }
  };

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
    <div className={` w-[50rem] ${isEditMode ? 'h-[75rem]' : 'h-[70.2rem]'}`}>
      <div className="mx-auto w-[50rem] ">
        {isEditMode ? (
          <div className="bg-[#EDF1E6] w-full h-full py-[1.2rem] px-[2rem] flex flex-row justify-between">
            <div className="text-[1.8rem] text-[#496E00] font-[600]">
              {index} Page_{changeStyleName()}
            </div>
            <div className="flex justify-between items-center w-[6rem] h-[2.4rem]">
              <button className="text-[2.4rem] text-[#496E00]" onClick={handleSaveOrUpdate}>
                <FaSave />
              </button>
              <button className="text-[2.4rem] text-[#496E00]" onClick={handleDelete}>
                <FaTrashAlt />
              </button>
            </div>
          </div>
        ) : null}
      </div>
      <div className="flex flex-wrap justify-center h-[70.2rem] p-[2rem]">
        <div className="flex flex-wrap justify-center">
          <div className="flex justify-between flex-wrap ">
            <div className="flex justify-between w-[22rem]">
              <label className="flex w-[10rem] h-[2.2rem] justify-between items-center">
                <p className="text-forestGreen font-semibold text-[1.2rem]">배경 색상</p>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-[4.2rem] h-[2.2rem] bg-transparent border-none"
                  disabled={!isEditMode}
                />
              </label>

              <label className="flex w-[11rem] h-[2.2rem] justify-between items-center">
                <p className="text-forestGreen font-semibold text-[1.2rem]">텍스트 색상</p>
                <input
                  type="color"
                  value={globalTextColor}
                  onChange={(e) => setGlobalTextColor(e.target.value)}
                  className="w-[4.2rem] h-[2.2rem] bg-transparent border-none "
                  disabled={!isEditMode}
                />
              </label>
            </div>
            <div className="flex justify-between items-center w-[46rem] h-[1.9rem]">
              <div className="flex flex-col w-[30rem] border-b-2 pb-1">
                <label htmlFor="title" className="flex items-center">
                  <p className="text-forestGray font-semibold text-[1.5rem]">TITLE</p>
                  <input
                    id="title"
                    type="text"
                    className="w-full h-full text-[1.5rem] bg-transparent border-none ml-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={!isEditMode}
                  />
                </label>
              </div>

              <div className="flex flex-col w-[14.5rem] border-b-2 pb-1">
                <label htmlFor="date" className="flex items-center">
                  <p className="text-forestGray font-semibold text-[1.5rem]">DATE</p>
                  <div className="relative ml-2">
                    <DatePicker
                      selected={date ? new Date(date) : null}
                      onChange={(date) => setDate(date ? date.toISOString().split('T')[0] : '')}
                      dateFormat="yyyy/MM/dd"
                      className="w-full h-full text-[1.5rem] bg-transparent border-none placeholder-[#181818]"
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
            className="border p-4 w-[43rem] h-[53rem] overflow-hidden mb-1 "
            style={{
              color: globalTextColor,
              fontSize: '16px',
              backgroundColor: bgColor,
              overflowY: 'hidden',
              wordBreak: 'break-all',
              whiteSpace: 'pre-wrap',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 10)',
              borderRadius: '8px'
            }}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default BlankNote;
