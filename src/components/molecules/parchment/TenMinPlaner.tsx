'use client';

import ParchmentInput from '@/components/atoms/ParchmentInput';
import React, { useEffect, useState } from 'react';
import Todolist from './Todolist';
import Timetable from './Timetable';
import { useCreateTenMinPlaner, useTenMinPlaner, useUpdateTenMinPlaner } from '@/lib/hooks/useTenMinPlaner';
import useTimetableStore, { activeCellsObjet } from '@/stores/timetable.store';
import useUserStore from '@/stores/user.store';
import useTenMinPlanerStore from '@/stores/tenMinPlaner.store';
import useDiaryStore from '@/stores/diary.store';

const TenMinPlaner = () => {
  const [date, setDate] = useState('');
  const [ddayDate, setDdayDate] = useState('');
  const [dday, setDday] = useState('');
  const [goal, setGoal] = useState('');
  const [memo, setMemo] = useState('');

  const { activeCells, setActiveCells } = useTimetableStore((state) => state);
  const { userId } = useUserStore((state) => state);
  const { diaryId } = useDiaryStore((state) => state);
  const { tenMinPlanerId } = useTenMinPlanerStore((state) => state);

  const { mutate: createTenMinPlaner } = useCreateTenMinPlaner();
  const { data: tenMinPlaner } = useTenMinPlaner(tenMinPlanerId);
  const { mutate: updateTenMinPlaner } = useUpdateTenMinPlaner();

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

  const handleMemo = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMemo(e.target.value);
  };

  useEffect(() => {
    if (tenMinPlaner && tenMinPlanerId) {
      setDate(tenMinPlaner?.date || '');
      setDdayDate(tenMinPlaner?.d_day_date || '');
      setDday(tenMinPlaner?.d_day || '');
      setGoal(tenMinPlaner?.goal || '');
      setMemo(tenMinPlaner?.memo || '');
      setActiveCells((tenMinPlaner?.timetable as activeCellsObjet) || {});
    }
  }, [tenMinPlaner, tenMinPlanerId]);

  console.log('supabase', tenMinPlaner);

  const updatePlaner = () => {
    if (!date) {
      alert('작성 날짜를 입력해 주세요.');
      return;
    }

    const newTenMinPlaner = {
      date: date,
      d_day_date: ddayDate,
      d_day: dday,
      goal: goal,
      memo: memo,
      user_id: userId,
      diary_id: diaryId,
      timetable: activeCells
    };

    if (tenMinPlanerId) {
      console.log(tenMinPlanerId);
      if (confirm('이대로 저장하시겠습니까?')) {
        updateTenMinPlaner({ id: tenMinPlanerId, updateTenMinPlaner: newTenMinPlaner });
        // todolist api
        alert('저장되었습니다.');
        console.log(newTenMinPlaner);
      }
    } else {
      createTenMinPlaner(newTenMinPlaner);
    }
  };

  return (
    <div className="flex flex-row p-4 w-[1024px]">
      <div className="relative w-1/2 custom-height border-2 border-red-400 flex flex-col gap-4 m-auto p-4">
        <button className="absolute top-0 right-0 bg-red-400" onClick={updatePlaner}>
          저장하기
        </button>
        <div className="flex gap-2">
          <div className="w-1/3">
            <ParchmentInput
              identity="tenMinPlanerRegular"
              label="date"
              id="date"
              type="date"
              onChange={handleDate}
              value={date}
            />
          </div>
          <div className="w-1/3 relative">
            <ParchmentInput
              identity="tenMinPlanerRegular"
              label="d-day"
              id="d-day"
              type="date"
              onChange={handleDdayDate}
              value={ddayDate}
            />
            <span className="absolute right-3 top-0 font-bold">{dday}</span>
          </div>
          <div className="w-1/3">
            <ParchmentInput identity="tenMinPlanerRegular" label="goal" id="goal" onChange={handleGoal} value={goal} />
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
          <label htmlFor="memo">memo</label>
          <textarea id="memo" className="h-20 w-full" onChange={handleMemo} value={memo} />
        </div>
      </div>
    </div>
  );
};

export default TenMinPlaner;
