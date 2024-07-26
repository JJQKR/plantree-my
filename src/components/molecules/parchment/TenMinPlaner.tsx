'use client';

import ParchmentInput from '@/components/atoms/ParchmentInput';
import React, { useEffect, useState } from 'react';
import Todolist from './Todolist';
import Timetable from './Timetable';
// import TodolistTest from './TodolistTest';

const TenMinPlaner = () => {
  const [date, setDate] = useState('');
  const [ddayDate, setDdayDate] = useState('');
  const [dday, setDday] = useState('');
  const [goal, setGoal] = useState('');
  const [memo, setMemo] = useState('');

  const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputData = e.target.value;
    setDate(inputData);

    if (ddayDate) {
      const targetDate = new Date(ddayDate);
      const currentDate = new Date(inputData);
      const dayGap = targetDate.getTime() - currentDate.getTime();
      const ddayNumber = Math.ceil(dayGap / (1000 * 3600 * 24));

      let ddayDisplayText = `D-Day!`;
      if (ddayNumber < 0) {
        ddayDisplayText = `D+${Math.abs(ddayNumber)}`;
      } else if (ddayNumber > 0) {
        ddayDisplayText = `D-${ddayNumber}`;
      }
      setDday(ddayDisplayText);
    }
  };

  const handleDdayDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value;
    setDdayDate(inputDate);

    if (date) {
      const targetDate = new Date(inputDate);
      const currentDate = new Date(date);
      const dayGap = targetDate.getTime() - currentDate.getTime();
      const ddayNumber = Math.ceil(dayGap / (1000 * 3600 * 24));

      let ddayDisplayText = `D-Day!`;
      if (ddayNumber < 0) {
        ddayDisplayText = `D+${Math.abs(ddayNumber)}`;
      } else if (ddayNumber > 0) {
        ddayDisplayText = `D-${ddayNumber}`;
      }
      setDday(ddayDisplayText);
    }
  };

  const handleGoal = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoal(e.target.value);
  };

  const handleMemo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemo(e.target.value);
  };

  const updatePlaner = () => {
    const newTenMinPlaner = {
      date,
      ddayDate,
      dday,
      goal,
      memo
    };
  };

  return (
    <div className="flex flex-row p-4 bg-slate-100 w-[1024px]">
      <div className="relative w-1/2 custom-height border-2 border-red-400 flex flex-col gap-4 m-auto p-4">
        <button className="absolute top-0 right-0 bg-red-400" onClick={updatePlaner}>
          수정
        </button>
        <div className="flex gap-2">
          <div className="w-1/3">
            <ParchmentInput identity="tenMinPlanerRegular" label="date" id="date" type="date" onChange={handleDate} />
          </div>
          <div className="w-1/3 relative">
            <ParchmentInput
              identity="tenMinPlanerRegular"
              label="d-day"
              id="d-day"
              type="date"
              onChange={handleDdayDate}
            />
            <span className="absolute right-3 top-0 font-bold">{dday}</span>
          </div>
          <div className="w-1/3">
            <ParchmentInput identity="tenMinPlanerRegular" label="goal" id="goal" onChange={handleGoal} />
          </div>
        </div>
        <div className="flex flex-row gap-4 ">
          <div className="w-1/2">
            <Todolist />
          </div>
          <div className="w-1/2">
            <Timetable />
          </div>
        </div>
        <div>
          <ParchmentInput
            identity="tenMinPlanerRegular"
            label="memo"
            id="memo"
            innerClassName="h-20"
            onChange={handleMemo}
          />
        </div>
      </div>
      {/* <div className="w-1/2 custom-height border-2 border-red-400 flex flex-col gap-4 m-auto p-4">
        <div className="flex gap-2">
          <div className="w-1/3">
            <ParchmentInput identity="tenMinPlanerRegular" label="date" id="date" />
          </div>
          <div className="w-1/3">
            <ParchmentInput identity="tenMinPlanerRegular" label="d-day" id="d-day" />
          </div>
          <div className="w-1/3">
            <ParchmentInput identity="tenMinPlanerRegular" label="goal" id="goal" />
          </div>
        </div>
        <div className="flex flex-row bg-slate-400 gap-4 ">
          <div className="w-1/2">
            <Todolist />
          </div>
          <div className="w-1/2">
            <Timetable />
          </div>
        </div>
        <div>
          <ParchmentInput identity="tenMinPlanerRegular" label="memo" id="memo" innerClassName="h-20" />
        </div>
      </div> */}
    </div>
  );
};

export default TenMinPlaner;
