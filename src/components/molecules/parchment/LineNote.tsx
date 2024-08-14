'use client';

import { useDeletePage } from '@/lib/hooks/usePages';
import { isNoteLineArray } from '@/lib/utils/noteLineConfirmArray';
import useEditModeStore from '@/stores/editMode.store';
import { supabase } from '@/supabase/client';
import { Json } from '@/types/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useRef, useCallback, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaSave } from 'react-icons/fa';
import { FaTrashAlt } from 'react-icons/fa';

interface LineNoteProps {
  id: string;
}

export interface NoteLine {
  text: string;
  fontSize: number;
  textColor: string;
}

const LineNote = ({ id }: LineNoteProps) => {
  const [lines, setLines] = useState<NoteLine[]>(
    Array.from({ length: 16 }, () => ({ text: '', fontSize: 25, textColor: '#000000' }))
  );
  const [lineColor, setLineColor] = useState('#000000');
  const [lineThickness, setLineThickness] = useState(1);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [globalTextColor, setGlobalTextColor] = useState('#000000');
  const [diaryId, setDiaryId] = useState('');
  const { mutate: deletePage, isPending, isError } = useDeletePage();
  const { isEditMode } = useEditModeStore((state) => state);

  const searchParams = useSearchParams();
  const index = searchParams.get('index');
  const style = searchParams.get('style');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

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

  const updateData = async () => {
    if (!id) {
      console.error('작성중인 페이지가 없습니다. 다시 시도해주세요.');
      return;
    }

    Swal.fire({
      title: '수정 하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '예',
      cancelButtonText: '아니오'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data, error } = await supabase
          .from('line_note')
          .update({
            line_color: lineColor,
            line_thickness: lineThickness,
            bg_color: bgColor,
            global_text_color: globalTextColor,
            lines: lines as unknown as Json
          })
          .eq('id', id);

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
          router.replace(`/member/diary/${diaryId}/parchment`);
        }
      }
    });
  };

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        console.error('작성하고싶은 페이지를 불러오지 못했습니다. 다시 시도해 주세요.');
        return;
      }

      const { data, error } = await supabase.from('line_note').select('*').eq('id', id).maybeSingle();

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
        setDiaryId(data?.diary_id || '');

        if (isNoteLineArray(data?.lines)) {
          setLines(data.lines);
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
      }
    };
    loadData();
  }, []);

  const handleDelete = async () => {
    Swal.fire({
      title: '정말 삭제하시겠어요?',
      text: '삭제된 속지는 되돌릴 수 없습니다!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '예',
      cancelButtonText: '아니오'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { error: lineNoteError } = await supabase.from('line_note').delete().eq('id', id);
        deletePage(id);
        if (lineNoteError) {
          Swal.fire({
            title: '삭제 실패!',
            text: '삭제 중 오류가 발생했습니다: ' + lineNoteError.message,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        } else if (isError) {
          Swal.fire({
            title: '삭제 실패!',
            text: '삭제 중 오류가 발생했습니다',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            title: '삭제 성공!',
            text: '속지가 성공적으로 삭제되었습니다!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          console.log(diaryId);
          router.push(`/member/diary/${diaryId}/parchment`);
        }
      }
    });
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
    <div className={`w-[50rem] ${isEditMode ? 'h-[75rem]' : 'h-[70.2rem]'} bg-white`}>
      <div className="mx-auto w-full">
        {isEditMode ? (
          <div className="bg-[#EDF1E6] w-full h-[4.8rem] py-[1.2rem] px-[1.5rem] flex flex-row justify-between">
            <div className="text-[1.8rem] text-[#496E00] font-[600]">
              {index} Page_{changeStyleName()} (수정중)
            </div>
            <div>
              <button
                className="text-[2.4rem] text-[#496E00] hover:text-black mr-[1.2rem]"
                onClick={updateData}
                title="클릭해서 저장!"
              >
                <FaSave />
              </button>
              <button
                className="text-[2.4rem] text-[#496E00] hover:text-black"
                onClick={handleDelete}
                title="클릭하면 삭제!"
              >
                <FaTrashAlt />
              </button>
            </div>
          </div>
        ) : null}
      </div>
      {isEditMode ? (
        <div className="flex flex-row gap-[0.3rem] mt-[1.25rem] bg-white">
          <div className="flex gap-[0.3rem]">
            <label className="block ml-[1.3rem]">
              배경 색상
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="ml-[0.1rem] p-[0.1rem] border-0 bg-white"
              />
            </label>
            <div className="flex">
              <label className="block">
                텍스트 색상
                <input
                  type="color"
                  value={globalTextColor}
                  onChange={(e) => setGlobalTextColor(e.target.value)}
                  className="ml-[0.1rem] p-[0.1rem] border-0 bg-white"
                />
              </label>
            </div>
            <label className="block">
              줄 색상
              <input
                type="color"
                value={lineColor}
                onChange={(e) => setLineColor(e.target.value)}
                className="ml-[0.2rem] p-[0.1rem] border-0 bg-white"
              />
            </label>
            <label className="block">
              줄 굵기
              <select
                value={lineThickness}
                onChange={(e) => setLineThickness(parseInt(e.target.value))}
                className="ml-[0.3rem] p-[0.30rem] border bg-white"
              >
                <option value="1">얇음</option>
                <option value="2">보통</option>
                <option value="3">굵음</option>
              </select>
            </label>
          </div>
        </div>
      ) : null}
      <div
        className="p-[0.4rem] ml-[0.3rem] mr-[0.3rem] mt-[1.25rem]"
        style={{
          backgroundColor: bgColor,
          minHeight: '65rem'
        }}
      >
        <div className="relative w-full overflow-hidden" style={{ height: '65rem' }}>
          {lines.map((line, index) => (
            <div
              key={index}
              className={`relative`}
              style={{ height: '3.8rem', borderBottom: `${lineThickness / 10}rem solid ${lineColor}` }}
            >
              <input
                type="text"
                value={line.text}
                onChange={(e) => handleTextChange(index, e.target.value)}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                className="text-xl absolute top-0 left-0 w-full h-[4rem] border-none outline-none bg-transparent"
                style={{
                  fontSize: `${line.fontSize / 10}rem`,
                  color: globalTextColor,
                  width: '100%'
                }}
                disabled={!isEditMode}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LineNote;
