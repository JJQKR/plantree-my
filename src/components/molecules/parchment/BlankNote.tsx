'use client';

import React, { useCallback, useRef, useState } from 'react';

type Blank = {
  text: string;
  fontSize: number;
  textColor: string;
};

const BlankNote = () => {
  const [lines, setLines] = useState<Blank[]>(
    Array.from({ length: 15 }, () => ({ text: '', fontSize: 16, textColor: '#000000' }))
  );
  const [bgColor, setBgColor] = useState('#ffffff');
  const [globalTextColor, setGlobalTextColor] = useState('#000000');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const measureTextWidth = useCallback((text: string, fontSize: number) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      context.font = `${fontSize}px sans-serif`;
      return context.measureText(text).width;
    }
    return 0;
  }, []);

  const handleTextChange = useCallback(
    (index: number, newText: string) => {
      if (!inputRefs.current[index]) return;

      const inputWidth = inputRefs.current[index]!.offsetWidth;
      let textWidth = measureTextWidth(newText, lines[index].fontSize);

      const newLines = [...lines];
      newLines[index].text = newText;

      while (textWidth > inputWidth) {
        const overflowChar = newText.slice(-1);
        newText = newText.slice(0, -1);
        newLines[index].text = newText;
        textWidth = measureTextWidth(newText, lines[index].fontSize);

        const nextLineIndex = index + 1;
        if (nextLineIndex < newLines.length) {
          newLines[nextLineIndex].text = overflowChar + newLines[nextLineIndex].text;
          if (inputRefs.current[nextLineIndex]) {
            inputRefs.current[nextLineIndex]!.setSelectionRange(0, 0);
            inputRefs.current[nextLineIndex]!.focus();
          }
        } else {
          newLines.push({ text: overflowChar, fontSize: 16, textColor: globalTextColor });
        }
      }

      if (newText.length === 0 && index > 0) {
        const prevLineIndex = index - 1;
        newLines[prevLineIndex].text += newLines[index].text;
        if (index >= 15) {
          newLines.splice(index, 1);
        } else {
          newLines[index].text = '';
        }
        if (inputRefs.current[prevLineIndex]) {
          inputRefs.current[prevLineIndex]!.focus();
          inputRefs.current[prevLineIndex]!.setSelectionRange(
            newLines[prevLineIndex].text.length,
            newLines[prevLineIndex].text.length
          );
        }
      }

      setLines(newLines);
    },
    [lines, measureTextWidth, globalTextColor]
  );

  return (
    <div className="bg-white w-[512px] h-[800px] p-[2rem]" style={{ backgroundColor: bgColor }}>
      <div>
        <label htmlFor="date">날짜 : </label>
        <input id="date" type="date" className="border w-[7rem] text-[0.7rem]" />
      </div>
      <div className="flex flex-row w-full">
        <label htmlFor="title" className="w-[3rem]">
          제목:
        </label>
        <input id="title" type="text" className="border w-full text-[0.7rem]" />
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
      <div className=" border w-full overflow-hidden" style={{ height: `${lines.length * 30}px` }}>
        {lines.map((line, index) => (
          <div key={index} className="h-[30px]">
            <input
              type="text"
              value={line.text}
              onChange={(e) => handleTextChange(index, e.target.value)}
              className="w-full outline-none bg-transparent"
              style={{
                fontSize: `${line.fontSize}px`,
                color: globalTextColor
              }}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlankNote;
