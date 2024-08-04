'use client';

import { getBackgroundColorClass } from '@/lib/utils/tenMinPlannerColor';
import useTimetableStore from '@/stores/timetable.store';
import useTodoListStore from '@/stores/todoList.store';
import React, { useState } from 'react';

const Timetable = () => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const { activeCells, addActiveCell, removeActiveCell } = useTimetableStore((state) => state);

  const { todo } = useTodoListStore((state) => state);

  const rows = 24;
  const columns = 6;
  const minutes = [10, 20, 30, 40, 50, 60];
  const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  const handleMouseDown = (id: string) => {
    if (!todo.id) {
      alert('todolist에서 todo를 선택해주세요');
      return;
    }
    setIsMouseDown(true);
    toggleCellColor(id);
  };

  const handleMouseOver = (id: string) => {
    if (isMouseDown) {
      toggleCellColor(id);
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const toggleCellColor = (id: string) => {
    const newCell = { [id]: { active: true, color: todo.color, todoId: todo.id } };
    console.log(activeCells[id]);
    // null[420] => error
    addActiveCell(newCell);

    if (activeCells[id]) {
      removeActiveCell(id);
    }
  };

  return (
    <div className="border-2 relative h-full" onMouseUp={handleMouseUp}>
      <h4>Time Table</h4>
      <div className="flex flex-row gap-4 absolute right-1">
        {minutes.map((minute) => {
          return <div key={minute}>{minute}</div>;
        })}
      </div>
      <div className="flex flex-col absolute top-12 text-[9px]">
        {hours.map((hour) => {
          return <div key={hour}>{hour}</div>;
        })}
      </div>
      <table className="w-5/6 h-72 border-collapse absolute top-12 right-1">
        <tbody>
          {Array.from({ length: rows }, (_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }, (_, colIndex) => {
                const id = `${rowIndex}${(colIndex + 1) * 10}`;
                return (
                  <td
                    key={colIndex}
                    id={id}
                    className={`border border-gray-300 p-1.5 text-center`}
                    style={{
                      background:
                        activeCells && activeCells[id]?.active
                          ? getBackgroundColorClass(activeCells[id]?.color)
                          : 'transparent'
                    }}
                    onMouseDown={() => handleMouseDown(id)}
                    onMouseOver={() => handleMouseOver(id)}
                  ></td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Timetable;
