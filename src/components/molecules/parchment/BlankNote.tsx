import React, { useRef, useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';

type BlankNoteProps = {
  diaryId: string;
  userId: string;
  pageId: string;
};

const BlankNote: React.FC<BlankNoteProps> = ({ diaryId, userId, pageId }) => {
  const [bgColor, setBgColor] = useState('#ffffff');
  const [globalTextColor, setGlobalTextColor] = useState('#000000');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [currentHeight, setCurrentHeight] = useState(0);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [originalContent, setOriginalContent] = useState({
    bgColor: '#ffffff',
    globalTextColor: '#000000',
    content: '',
    date: '',
    title: ''
  });

  const editableDivRef = useRef<HTMLDivElement>(null);
  const maxHeight = 400;

  useEffect(() => {
    fetchDiaryData();
  }, [pageId]);

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
    const { data, error } = await supabase
      .from('blank_note')
      .select('*')
      .eq('diary_id', diaryId)
      .eq('page_id', pageId)
      .maybeSingle();

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
      setIsEditMode(false);
    } else {
      setBgColor('#ffffff');
      setGlobalTextColor('#000000');
      setContent('');
      setDate('');
      setTitle('');
      setIsEditMode(true);
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
      user_id: userId,
      date: date,
      title: title,
      content: content,
      bgColor: bgColor,
      globalTextColor: globalTextColor,
      diary_id: diaryId,
      page_id: pageId
    };

    let result;
    if (originalContent.content) {
      // 기존 데이터가 있으면 업데이트
      result = await supabase.from('blank_note').update(newData).eq('diary_id', diaryId).eq('page_id', pageId);
    } else {
      // 새 데이터면 삽입
      result = await supabase.from('blank_note').insert([newData]);
    }

    if (result.error) {
      alert((originalContent.content ? '수정' : '저장') + ' 중 오류가 발생했습니다: ' + result.error.message);
    } else {
      alert((originalContent.content ? '수정' : '저장') + '되었습니다!');
      setOriginalContent({
        bgColor: bgColor,
        globalTextColor: globalTextColor,
        content: content,
        date: date,
        title: title
      });
      setIsEditMode(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('내용을 삭제 하시겠습니까?')) {
      if (!pageId) return;

      const { error } = await supabase.from('blank_note').delete().eq('diary_id', diaryId).eq('page_id', pageId);

      if (error) {
        alert('삭제 중 오류가 발생했습니다: ' + error.message);
      } else {
        alert('삭제되었습니다!');
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
    setIsEditMode(!isEditMode);
  };

  return (
    <div className="bg-white w-full h-[600px] p-[2rem]" style={{ backgroundColor: bgColor }}>
      <div>
        <label htmlFor="date">날짜 : </label>
        <input
          id="date"
          type="date"
          className="border w-[7rem] text-[0.7rem]"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          disabled={!isEditMode}
        />
      </div>
      <div className="flex flex-row w-full mb=2">
        <label htmlFor="title" className="w-[3rem]">
          제목:
        </label>
        <input
          id="title"
          type="text"
          className="border w-full text-[0.7rem]"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={!isEditMode}
        />
      </div>
      <div>
        <label className="block m-2">
          줄노트 배경 색상:
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="ml-2 p-1 border"
            disabled={!isEditMode}
          />
        </label>
        <label className="block m-2">
          전체 텍스트 색상:
          <input
            type="color"
            value={globalTextColor}
            onChange={(e) => setGlobalTextColor(e.target.value)}
            className="ml-2 p-1 border"
            disabled={!isEditMode}
          />
        </label>
      </div>
      <div
        ref={editableDivRef}
        contentEditable={isEditMode}
        className="border w-full overflow-hidden mb-2"
        style={{
          height: `${maxHeight}px`,
          color: globalTextColor,
          fontSize: '16px',
          backgroundColor: bgColor,
          overflowY: 'hidden',
          wordBreak: 'break-all',
          whiteSpace: 'pre-wrap'
        }}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
      ></div>
      {isEditMode ? (
        <>
          <button onClick={handleSaveOrUpdate} className="p-2 bg-blue-500 text-white rounded mr-2">
            저장
          </button>
          {pageId && originalContent.content && (
            <button onClick={handleDelete} className="p-2 bg-red-500 text-white rounded mr-2">
              삭제
            </button>
          )}
          <button onClick={handleEditModeToggle} className="p-2 bg-gray-500 text-white rounded">
            편집 취소
          </button>
        </>
      ) : (
        <button onClick={handleEditModeToggle} className="p-2 bg-green-500 text-white rounded">
          편집 모드
        </button>
      )}
    </div>
  );
};

export default BlankNote;
