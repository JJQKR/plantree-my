'use client';

import React, { useRef, useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';
import { useRouter } from 'next/navigation';
import { useDeletePage } from '@/lib/hooks/usePages';
import useEditModeStore from '@/stores/editMode.store';

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
    // setIsEditMode(!isEditMode);
  };

  return (
    <div className="bg-white w-full h-[430px]">
      <div className="flex justify-between mb-4 mt-[52px]">
        <div>
          <label htmlFor="title" className="block m-2">
            제목:
            <input
              id="title"
              type="text"
              className="border w-[80%] text-[1.3rem] ml-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!isEditMode}
            />
          </label>
          {isEditMode ? (
            <label className="block m-2">
              노트 배경 색상:
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="ml-2 p-1 border"
                disabled={!isEditMode}
              />
            </label>
          ) : null}
        </div>
        <div>
          <label htmlFor="date" className="block m-2">
            날짜:
            <input
              id="date"
              type="date"
              className="border w-[60%] h-[2rem] text-[0.9rem] ml-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={!isEditMode}
            />
          </label>
          {isEditMode ? (
            <label className="block m-2">
              텍스트 색상:
              <input
                type="color"
                value={globalTextColor}
                onChange={(e) => setGlobalTextColor(e.target.value)}
                className="ml-2 p-1 border"
                disabled={!isEditMode}
              />
            </label>
          ) : null}
        </div>
      </div>
      <div
        ref={editableDivRef}
        contentEditable={isEditMode}
        className="border p-4 w-[43rem] h-[53rem] overflow-hidden mb-1 mt-5 ml-4 mr-3"
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
      {isEditMode ? (
        <div>
          <button onClick={handleSaveOrUpdate} className="p-2 bg-blue-500 text-white rounded mr-2 mt-3">
            저장하기
          </button>
          <button onClick={handleDelete} className="p-2 bg-red-500 text-white rounded mr-2">
            삭제하기
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default BlankNote;
