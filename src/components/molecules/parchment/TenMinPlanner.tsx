'use client';

import ParchmentInput from '@/components/atoms/ParchmentInput';
import React, { useEffect, useState } from 'react';
import Todolist from './Todolist';
import Timetable from './Timetable';
import { useCreateTenMinPlanner, useTenMinPlanner, useUpdateTenMinPlanner } from '@/lib/hooks/useTenMinPlanner';
import useTimetableStore, { ActiveCellsObject } from '@/stores/timetable.store';
import useUserStore from '@/stores/user.store';
import useTenMinPlannerStore from '@/stores/tenMinPlanner.store';
import useTodoListStore, { TodoObjectType } from '@/stores/todoList.store';
import uuid from 'react-uuid';
import { useParams } from 'next/navigation';

type ParamTypes = {
  [key: string]: string;
  diaryId: string;
};

const TenMinPlanner = () => {
  const [date, setDate] = useState('');
  const [ddayDate, setDdayDate] = useState('');
  const [dday, setDday] = useState('');
  const [goal, setGoal] = useState('');
  const [memo, setMemo] = useState('');
  const { diaryId } = useParams<ParamTypes>();

  const { activeCells, setActiveCells } = useTimetableStore((state) => state);
  const { userId } = useUserStore((state) => state);
  const { tenMinPlannerId, setTenMinPlannerId } = useTenMinPlannerStore((state) => state);
  const { todoList, setTodoList } = useTodoListStore((state) => state);

  const { mutate: createTenMinPlanner } = useCreateTenMinPlanner();
  const { data: tenMinPlanner } = useTenMinPlanner(tenMinPlannerId);
  const { mutate: updateTenMinPlanner } = useUpdateTenMinPlanner();

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
    if (tenMinPlanner && tenMinPlannerId) {
      setDate(tenMinPlanner?.date || '');
      setDdayDate(tenMinPlanner?.d_day_date || '');
      setDday(tenMinPlanner?.d_day || '');
      setGoal(tenMinPlanner?.goal || '');
      setMemo(tenMinPlanner?.memo || '');
      setActiveCells((tenMinPlanner?.timetable as ActiveCellsObject) || {});
      setTodoList((tenMinPlanner?.todo_list as unknown as TodoObjectType[]) || []);
    }
  }, [tenMinPlanner, tenMinPlannerId, setActiveCells]);

  const updatePlanner = () => {
    if (!date) {
      alert('작성 날짜를 입력해 주세요.');
      return;
    }

    // TODO: 사실 DB에서 가져온 ID를 써야한다.
    const newId = uuid();

    const newTenMinPlanner = {
      id: newId,
      date: date,
      d_day_date: ddayDate,
      d_day: dday,
      goal: goal,
      memo: memo,
      user_id: userId,
      diary_id: diaryId,
      timetable: activeCells,
      todo_list: todoList
    };

    if (tenMinPlannerId) {
      console.log({ tenMinPlannerId });
      if (confirm('이대로 수정하시겠습니까?')) {
        updateTenMinPlanner({ id: tenMinPlannerId, updateTenMinPlanner: newTenMinPlanner });
        alert('수정되었습니다.');
        console.log(newTenMinPlanner);
      }
    } else {
      setTenMinPlannerId(newId);
      createTenMinPlanner(newTenMinPlanner);
      alert('새로운 내용을 저장했습니다.');
    }
  };

  return (
    <div className="w-full max-w-screen-md h-[60rem] overflow-auto mt-1">
      <div className="relative border-2 flex flex-col gap-4 m-auto p-4 h-[60rem]">
        <button className="absolute top-0 right-0 bg-red-400" onClick={updatePlanner}>
          저장하기
        </button>
        <div className="flex gap-2">
          <div className="w-1/3">
            <ParchmentInput
              identity="tenMinPlannerRegular"
              label="date"
              id="date"
              type="date"
              onChange={handleDate}
              value={date}
            />
          </div>
          <div className="w-1/3 relative">
            <ParchmentInput
              identity="tenMinPlannerRegular"
              label="d-day"
              id="d-day"
              type="date"
              onChange={handleDdayDate}
              value={ddayDate}
            />
            <span className="absolute right-3 top-0 font-bold">{dday}</span>
          </div>
          <div className="w-1/3">
            <ParchmentInput identity="tenMinPlannerRegular" label="goal" id="goal" onChange={handleGoal} value={goal} />
          </div>
        </div>
        <div className="flex flex-row gap-4 ">
          <div className="w-1/2">
            <Todolist />
          </div>
          <div className="w-1/2 h-[40rem]">
            <Timetable />
          </div>
        </div>
        <div>
          <label htmlFor="memo">memo</label>
          <textarea id="memo" className="h-[3rem] w-full" onChange={handleMemo} value={memo} />
        </div>
      </div>
    </div>
  );
};

export default TenMinPlanner;
