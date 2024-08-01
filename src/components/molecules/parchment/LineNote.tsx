'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface NoteLine {
  text: string;
  fontSize: number;
  textColor: string;
}

interface LineNoteProps {
  className?: string;
}

const Notebook: React.FC<LineNoteProps> = ({ className }) => {
  const [lines, setLines] = useState<NoteLine[]>(
    Array.from({ length: 15 }, () => ({ text: '', fontSize: 16, textColor: '#000000' }))
  );
  const [lineColor, setLineColor] = useState('#000000');
  const [lineThickness, setLineThickness] = useState(1);
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

  useEffect(() => {
    inputRefs.current.forEach((input, index) => {
      if (input) {
        const inputWidth = input.offsetWidth;
        const textWidth = measureTextWidth(lines[index].text, lines[index].fontSize);
        if (textWidth > inputWidth) {
          handleTextChange(index, lines[index].text);
        }
      }
    });
  }, [lines, measureTextWidth, handleTextChange]);

  return (
    <div className={`${className}`}>
      <div className="flex justify-between mb-4 bg-white">
        <div>
          <label className="block m-2">
            줄 색상:
            <input
              type="color"
              value={lineColor}
              onChange={(e) => setLineColor(e.target.value)}
              className="ml-2 p-1 border"
            />
          </label>
          <label className="block m-2">
            줄 굵기:
            <select
              value={lineThickness}
              onChange={(e) => setLineThickness(parseInt(e.target.value))}
              className="ml-2 p-1 border"
            >
              <option value="1">Thin</option>
              <option value="2">Medium</option>
              <option value="3">Thick</option>
            </select>
          </label>
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
      </div>
      <div
        className="border p-4 w-[495px]"
        style={{
          backgroundColor: bgColor,
          minHeight: '480px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 1)',
          borderRadius: '8px'
        }}
      >
        <div className="relative w-full overflow-hidden" style={{ height: `${lines.length * 30}px` }}>
          {lines.map((line, index) => (
            <div
              key={index}
              className={`relative`}
              style={{ height: '30px', borderBottom: `${lineThickness}px solid ${lineColor}` }}
            >
              <input
                type="text"
                value={line.text}
                onChange={(e) => handleTextChange(index, e.target.value)}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                className="absolute top-0 left-0 w-full border-none outline-none bg-transparent"
                style={{
                  fontSize: `${line.fontSize}px`,
                  color: globalTextColor
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notebook;
