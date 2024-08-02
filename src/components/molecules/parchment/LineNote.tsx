'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/supabase/client';
import { Json } from '@/types/supabase';
import { isNoteLineArray } from '@/stores/noteline.store';
import Swal from 'sweetalert2';

export interface NoteLine {
  text: string;
  fontSize: number;
  textColor: string;
}

interface LineNoteProps {
  userId: string;
  className?: string;
}

const LineNote: React.FC<LineNoteProps> = ({ userId }) => {
  const [lines, setLines] = useState<NoteLine[]>(
    Array.from({ length: 15 }, () => ({ text: '', fontSize: 16, textColor: '#000000' }))
  );
  const [lineColor, setLineColor] = useState('#000000');
  const [lineThickness, setLineThickness] = useState(1);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [globalTextColor, setGlobalTextColor] = useState('#000000');
  const [dataExists, setDataExists] = useState(false);
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
        }
      }

      if (newText.length === 0 && index > 0) {
        const prevLineIndex = index - 1;
        newLines[prevLineIndex].text += newLines[index].text;
        newLines[index].text = '';
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
    [lines, measureTextWidth]
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

  const saveData = useCallback(async () => {
    if (!userId) {
      console.error('userId is undefined');
      return;
    }

    console.log('Saving data with user_id:', userId);
    const { data, error } = await supabase.from('line_note').insert([
      {
        user_id: userId,
        line_color: lineColor,
        line_thickness: lineThickness,
        bg_color: bgColor,
        global_text_color: globalTextColor,
        lines: lines as unknown as Json
      }
    ]);

    if (error) {
      console.error('Error saving data:', error);
      Swal.fire({
        title: '저장 실패.',
        text: '속지를 저장하지 못했어요. 다시 시도해주세요!',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } else {
      console.log('Data saved:', data);
      setDataExists(true);
      Swal.fire({
        title: '저장 성공!',
        text: '속지를 성공적으로 저장했어요!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    }
  }, [userId, lineColor, lineThickness, bgColor, globalTextColor, lines]);

  const updateData = useCallback(async () => {
    if (!userId) {
      console.error('userId is undefined');
      return;
    }

    console.log('Updating data with user_id:', userId);
    const { data, error } = await supabase
      .from('line_note')
      .update({
        line_color: lineColor,
        line_thickness: lineThickness,
        bg_color: bgColor,
        global_text_color: globalTextColor,
        lines: lines as unknown as Json
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating data:', error);
      Swal.fire({
        title: '수정 실패!',
        text: '속지 수정에 실패했어요. 다시 시도해주세요!',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } else {
      console.log('Data updated:', data);
      Swal.fire({
        title: '수정 성공!',
        text: '속지를 성공적으로 수정했어요!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    }
  }, [userId, lineColor, lineThickness, bgColor, globalTextColor, lines]);

  const deleteData = useCallback(async () => {
    if (!userId) {
      console.error('userId is undefined');
      return;
    }

    Swal.fire({
      title: '정말 삭제하시겠어요?',
      text: '삭제된 속지는 되돌릴 수 없습니다!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'NO'
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log('Deleting data with user_id:', userId);
        const { data, error } = await supabase.from('line_note').delete().eq('user_id', userId);

        if (error) {
          console.error('Error deleting data:', error);
          Swal.fire({
            title: '삭제 실패!',
            text: '속지 삭제에 실패했어요! 다시 시도해주세요!',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        } else {
          console.log('Data deleted:', data);
          setLines(Array.from({ length: 15 }, () => ({ text: '', fontSize: 16, textColor: '#000000' })));
          setLineColor('#000000');
          setLineThickness(1);
          setBgColor('#ffffff');
          setGlobalTextColor('#000000');
          setDataExists(false);
          Swal.fire({
            title: '삭제 성공!',
            text: '속지를 성공적으로 삭제했어요!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        }
      }
    });
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) {
      console.error('userId is undefined');
      return;
    }

    const { data, error } = await supabase.from('line_note').select('*').eq('user_id', userId).maybeSingle();

    if (error) {
      console.error('Error loading data:', error);
      Swal.fire({
        title: '이런!',
        text: '데이터를 읽어오지 못했어요. 다시 시도해주세요!',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } else if (data) {
      setLineColor(data?.line_color || '#000000');
      setLineThickness(data?.line_thickness || 1);
      setBgColor(data?.bg_color || '#ffffff');
      setGlobalTextColor(data?.global_text_color || '#000000');
      if (isNoteLineArray(data?.lines)) {
        setLines(data?.lines);
        setDataExists(true);
      } else {
        console.error('Invalid data format for lines');
        Swal.fire({
          title: '이런!',
          text: '유저 정보를 가져올 수 없어요.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } else {
      console.log('No data found for this user.');
      setDataExists(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [userId, loadData]);

  return (
    <div>
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
        <div className="relative w-full overflow-hidden" style={{ height: '450px' }}>
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
      <div className="flex justify-between mt-4">
        {!dataExists ? (
          <button onClick={saveData} className="p-2 bg-blue-500 text-white rounded">
            저장
          </button>
        ) : (
          <button onClick={updateData} className="p-2 bg-green-500 text-white rounded">
            수정하기
          </button>
        )}
        <button onClick={deleteData} className="p-2 bg-red-500 text-white rounded">
          삭제하기
        </button>
      </div>
    </div>
  );
};

export default LineNote;
