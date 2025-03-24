'use client';

import { useDeletePage, usePageToDiaryId, useUpdatePage } from '@/lib/hooks/usePages';
import { isNoteLineArray } from '@/lib/utils/noteLineConfirmArray';
import useEditModeStore from '@/stores/editMode.store';
import { supabase } from '@/supabase/client';
import { Json } from '@/types/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useRef, useCallback, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaSave } from 'react-icons/fa';
import { FaTrashAlt } from 'react-icons/fa';
import { AddPageType } from '@/api/pages.api';

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
    Array.from({ length: 20 }, () => ({ text: '', fontSize: 16, textColor: '#000000' }))
  );
  const [lineColor, setLineColor] = useState('#000000');
  const [lineThickness, setLineThickness] = useState(0.9);
  const [bgColor, setBgColor] = useState('transparent');
  const [globalTextColor, setGlobalTextColor] = useState('#000000');
  const [diaryId, setDiaryId] = useState('');
  const { data: pages } = usePageToDiaryId(diaryId);
  const { mutate: deletePage, isPending, isError } = useDeletePage();
  const { mutate: updateDbPage } = useUpdatePage();
  const { isEditMode } = useEditModeStore((state) => state);

  const searchParams = useSearchParams();
  const index = Number(searchParams.get('index'));
  const style = searchParams.get('style');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

  const measureTextWidth = useCallback((text: string, fontSize: number) => {
    // 서버사이드에서 임시 추정치 반환
    if (typeof window === 'undefined') {
      return text.length * (fontSize / 2);
    }

    // 클라이언트사이드 canvas 사용 유지
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      context.font = `${fontSize} sans-serif`;
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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextLineIndex = index + 1;
        if (nextLineIndex < lines.length) {
          if (inputRefs.current[nextLineIndex]) {
            inputRefs.current[nextLineIndex]!.focus();
            inputRefs.current[nextLineIndex]!.setSelectionRange(0, 0);
          }
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevLineIndex = index - 1;
        if (prevLineIndex >= 0 && inputRefs.current[prevLineIndex]) {
          inputRefs.current[prevLineIndex]!.focus();
          inputRefs.current[prevLineIndex]!.setSelectionRange(
            lines[prevLineIndex].text.length,
            lines[prevLineIndex].text.length
          );
        }
      } else if (e.key === 'Backspace' && lines[index].text === '') {
        e.preventDefault();
        const prevLineIndex = index - 1;
        if (prevLineIndex >= 0) {
          const newLines = [...lines];
          newLines[prevLineIndex].text += newLines[index].text;
          newLines[index].text = '';
          setLines(newLines);

          if (inputRefs.current[prevLineIndex]) {
            inputRefs.current[prevLineIndex]!.focus();
            inputRefs.current[prevLineIndex]!.setSelectionRange(
              lines[prevLineIndex].text.length,
              lines[prevLineIndex].text.length
            );
          }
        }
      }
    },
    [lines]
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
        setBgColor(data?.bg_color || '#transparent');
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

          pages?.map((p: AddPageType) => {
            if (p.content_id !== id && p.index > index) {
              updateDbPage({ id: p.id, updatePage: { ...p, index: p.index - 1 } });
            }
          });

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

  if (isPending) {
    return (
      <div>
        <div className="fixed inset-0 flex items-center justify-center w-screen h-screen bg-[#F9FCF9]">
          <img src="/images/loading.gif" alt="Loading" width={150} height={150} />
        </div>
      </div>
    );
  }
  return (
    <div
      className={`sm:w-[32.5rem] w-[45rem] ${
        isEditMode ? 'sm:h-[48.7rem] h-[67.5rem]' : 'sm:h-[45.6rem] h-[63.2rem]'
      } bg-white border-[0.1rem] border-[#C7D2B0]`}
    >
      <div className="mx-auto w-full">
        {isEditMode ? (
          <div className="bg-[#EDF1E6] w-full sm:h-[3.1rem] h-[4.3rem] sm:pt-[0.8rem] pt-[1rem] sm:px-[1.5rem] px-[1.35rem] border-b-[0.1rem] border-[#C7D2B0] flex flex-row justify-between">
            <div className="sm:text-[1.2rem] text-[1.62rem] text-[#496E00] font-[600] ">
              {index} Page_{changeStyleName()} (수정중)
            </div>
            <div className="flex justify-between">
              <button
                className="sm:text-[1.6rem] text-[2.16rem] text-[#496E00] hover:text-black mr-[1.08rem]"
                onClick={updateData}
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
      {isEditMode ? (
        <div className="flex flex-row justify-evenly sm:gap-[0.3rem] gap-[0.8rem] sm:mt-[1.3rem] mt-[1.8rem] sm:mx-[1.5rem] mx-[1.8rem]">
          <label className="sm:text-[0.78rem] text-[1.08rem] flex flex-row text-[#008A02] items-center font-[600]">
            <p className="w-[5rem] sm:w-[3.5rem]">배경 색상</p>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="square-color-input "
            />
          </label>
          <label className="sm:text-[0.78rem] text-[1.08rem] flex flex-row text-[#008A02] items-center font-[600]">
            <p className="w-[6rem] sm:w-[4.3rem] ">텍스트 색상</p>
            <input
              type="color"
              value={globalTextColor}
              onChange={(e) => setGlobalTextColor(e.target.value)}
              className="square-color-input"
            />
          </label>
          <label className="sm:text-[0.78rem] text-[1.08rem] flex flex-row text-[#008A02] items-center font-[600]">
            <p className="w-[4rem] sm:w-[3rem] ">줄 색상</p>
            <input
              type="color"
              value={lineColor}
              onChange={(e) => setLineColor(e.target.value)}
              className="square-color-input"
            />
          </label>
          <label className="sm:text-[0.78rem] text-[1.08rem] flex flex-row text-[#008A02] items-center font-[600]">
            <p className="w-[4rem] sm:w-[3rem]">줄 굵기</p>
            <select
              value={lineThickness}
              onChange={(e) => setLineThickness(parseInt(e.target.value))}
              className="border bg-white text-black w-[6rem] sm:w-[5rem]"
            >
              <option value="1">얇음</option>
              <option value="2">보통</option>
              <option value="3">굵음</option>
            </select>
          </label>
        </div>
      ) : null}
      <div
        className={`sm:mx-[1.3rem] mx-[1.8rem] mt-[1.25rem] min-h-[55rem] sm:min-h-[39rem]`}
        style={{
          backgroundColor: bgColor
        }}
      >
        <div className="w-full overflow-hidden h-[55rem] sm:h-[39rem]">
          {lines.map((line, index) => (
            <div
              key={index}
              className={`h-[2.75rem] sm:h-[1.95rem]`}
              style={{ borderBottom: `${lineThickness / 10}rem solid ${lineColor}` }}
            >
              <input
                type="text"
                value={line.text}
                onChange={(e) => handleTextChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)} // 키보드 이벤트 핸들러 추가
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                className="fixed-width-input h-[2.75rem] sm:h-[2rem] border-none outline-none bg-transparent sm:text-[1rem] text-[1.5rem]"
                style={{
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
