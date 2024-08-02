'use client';

import React, { useRef, useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';

const BlankNote = () => {
  const [bgColor, setBgColor] = useState('#ffffff');
  const [globalTextColor, setGlobalTextColor] = useState('#000000');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [currentHeight, setCurrentHeight] = useState(0);
  const editableDivRef = useRef<HTMLDivElement>(null);
  const maxHeight = 400;

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

  const handleSave = () => {
    alert(
      `저장됨!\n날짜: ${date}\n제목: ${title}\n내용: ${content}\n배경 색상: ${bgColor}\n텍스트 색상: ${globalTextColor}`
    );
  };

  return (
    <div className="bg-white w-[512px] h-[600px] p-[2rem]" style={{ backgroundColor: bgColor }}>
      <div>
        <label htmlFor="date">날짜 : </label>
        <input
          id="date"
          type="date"
          className="border w-[7rem] text-[0.7rem]"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="flex flex-row w-full mb-2">
        <label htmlFor="title" className="w-[3rem]">
          제목:
        </label>
        <input
          id="title"
          type="text"
          className="border w-full text-[0.7rem]"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
          />
        </label>
        <label className="block m-2">
          전체 텍스트 색상:
          <input
            type="color"
            value={globalTextColor}
            onChange={(e) => setGlobalTextColor(e.target.value)}
            className="ml-2 p-1 border"
          />
        </label>
      </div>
      <div
        ref={editableDivRef}
        contentEditable
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
      <button onClick={handleSave} className="p-2 bg-blue-500 text-white rounded">
        저장
      </button>
    </div>
  );
};

export default BlankNote;
