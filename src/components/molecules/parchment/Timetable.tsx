'use client';

import React, { useState } from 'react';
import { Todo } from './TenMinPlanner';
import { getBackgroundColorClass } from '../../../lib/utils/tenMinPlannerColor';
import useEditModeStore from '@/stores/editMode.store';

type TimeTableObject = {
  [key: string]: { active: boolean; color: string; todoId: string };
};

interface TimetableProps {
  selectedColorTodo: Todo | null;
  timetable: TimeTableObject;
  setTimetable: React.Dispatch<React.SetStateAction<TimeTableObject>>;
}

const Timetable = ({ selectedColorTodo, timetable, setTimetable }: TimetableProps) => {
  const [isMouseDown, setIsMouseDown] = useState(false);

  const { isEditMode } = useEditModeStore((state) => state);

  const rows = 25;
  const columns = 7;
  const minutes = [10, 20, 30, 40, 50, 60];
  const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  const handleMouseDown = (id: string) => {
    if (!isEditMode) return;

    if (!selectedColorTodo?.id) {
      alert('todolist에서 todo를 선택해주세요');
      return;
    }
    setIsMouseDown(true);
    toggleCellColor(id);
  };

  const handleMouseOver = (id: string) => {
    if (!isEditMode) return;
    if (isMouseDown) {
      toggleCellColor(id);
    }
  };

  const handleMouseUp = () => {
    if (!isEditMode) return;
    setIsMouseDown(false);
  };

  const toggleCellColor = (id: string) => {
    const currentCell = timetable[id];
    const selectedColor = selectedColorTodo?.color;
    const selectedTodoId = selectedColorTodo?.id;

    const updatedTimetable = { ...timetable };
    if (currentCell && currentCell.todoId === selectedTodoId) {
      delete updatedTimetable[id]; // 셀 삭제
    } else {
      updatedTimetable[id] = { active: true, color: selectedColor || '', todoId: selectedTodoId || '' }; // 새로운 셀 추가 혹은 업데이트
    }

    setTimetable(updatedTimetable);
  };

  return (
    <div className=" w-full h-[38rem]" onMouseUp={handleMouseUp}>
      <table className="border-collapse w-full text-[0.8rem]">
        <tbody>
          {Array.from({ length: rows }, (_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }, (_, colIndex) => {
                if (rowIndex === 0 && colIndex !== 0) {
                  // 첫 번째 행에 분(minutes) 표시
                  return (
                    <td key={colIndex} className="border border-gray-300 text-center h-[1rem]">
                      {minutes[colIndex - 1]}
                    </td>
                  );
                } else if (colIndex === 0 && rowIndex !== 0) {
                  // 첫 번째 열에 시간(hours) 표시
                  return (
                    <td key={colIndex} className="border border-gray-300 text-center">
                      {hours[rowIndex - 1]}
                    </td>
                  );
                } else if (rowIndex !== 0 && colIndex !== 0) {
                  // 나머지 셀 처리

                  const id = `${rowIndex}${(colIndex + 1) * 10}`;
                  return (
                    <td
                      key={colIndex}
                      id={id}
                      className={`border border-gray-300 text-center h-[1rem]`}
                      style={{
                        background:
                          timetable && timetable[id]?.active
                            ? getBackgroundColorClass(timetable[id]?.color)
                            : 'transparent'
                      }}
                      onMouseDown={() => handleMouseDown(id)}
                      onMouseOver={() => handleMouseOver(id)}
                    ></td>
                  );
                }
                return <td key={colIndex} className="border border-gray-300 h-[1rem] text-center"></td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Timetable;
