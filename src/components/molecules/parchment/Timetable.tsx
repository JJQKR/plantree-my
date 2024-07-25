'use client';

import React, { useState } from 'react';

const Timetable = () => {
  const [color, setColor] = useState('');

  const rows = 24;
  const columns = 6;
  const colors = ['bg-red-200', 'bg-green-200', 'bg-blue-200', 'bg-yellow-200', 'bg-purple-200', 'bg-pink-200'];

  return (
    <div className="border">
      <h4>Time Table</h4>
      <div className="flex flex-row gap-4">
        <span>10</span> <span>20</span>
        <span>30</span>
        <span>40</span>
        <span>50</span>
        <span>60</span>
      </div>
      <table className="w-5/6 h-full border-collapse">
        <tbody>
          {Array.from({ length: rows }, (_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }, (_, colIndex) => (
                <td key={colIndex} className={`border border-gray-300 p-1.5 text-center bg-[${color}]`}>
                  {/* Row {rowIndex + 1}, Col {colIndex + 1} */}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Timetable;
