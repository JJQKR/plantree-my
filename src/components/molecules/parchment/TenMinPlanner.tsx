'use client';

import ParchmentInput from '@/components/atoms/ParchmentInput';
import React, { useEffect, useState } from 'react';
import Todolist from './Todolist';
import Timetable from './Timetable';
import useTimetableStore from '@/stores/timetable.store';
import useUserStore from '@/stores/user.store';
import { useParams } from 'next/navigation';
import { TodoType } from '@/api/tenMinPlanner.api';
import { supabase } from '@/supabase/client';

type ParamTypes = {
  [key: string]: string;
  diaryId: string;
};

/**
 * 1. 속지 내용 변경 -> localPlanner 변경
 * 2. 속지 리스트 관리 -> localPlanner 변경 시 setTenMinPlanners
 */
interface TenMinPlannerProps {
  id: string;
}

export type Todo = {
  id: string;
  text: string;
  isDone: boolean;
  color: string;
  planner_id: string;
};

const TenMinPlanner = ({ id }: TenMinPlannerProps) => {
  // const { diaryId } = useParams<ParamTypes>();
  const [localPlanner, setLocalPlanner] = useState<{
    id: string;
    date: string | null;
    d_day_date: string | null;
    d_day: string | null;
    goal: string | null;
    memo: string | null;
  }>({
    id,
    date: null,
    d_day_date: null,
    d_day: null,
    goal: null,
    memo: null
  });
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [timetable, setTimetable] = useState({});
  const [selectedColorTodo, setSelectedColorTodo] = useState<Todo | null>(null);
  // const { userId } = useUserStore((state) => state);
  // const { activeCells } = useTimetableStore((state) => state);

  // db에서 현재 데이터 가져오기
  useEffect(() => {
    const getData = async () => {
      const { data, error } = await supabase.from('ten_min_planner').select('*').eq('id', id).maybeSingle();
      if (data) {
        setLocalPlanner({
          id: data.id,
          date: data.date || null,
          d_day_date: data.d_day_date || null,
          d_day: data.d_day || null,
          goal: data.goal || null,
          memo: data.memo || null
        });
        setTodoList(data.todo_list as Todo[]);
        setTimetable(
          data.timetable as {
            [key: string]: { active: boolean; color: string; todoId: string };
          }
        );
      }
    };
    getData();
  }, []);

  const handleChange = (
    key: string,
    value: string | TodoType[] | { [key: string]: { active: boolean; color: string; todoId: string } } | null
  ) => {
    setLocalPlanner((prev) => ({ ...prev, [key]: value }));
  };

  const calculateAndSetDday = (currentDate: string, targetDate: string) => {
    const current = new Date(currentDate);
    const target = new Date(targetDate);
    const dayGap = target.getTime() - current.getTime();
    const ddayNumber = Math.ceil(dayGap / (1000 * 3600 * 24));

    let ddayDisplayText = `D-Day!`;
    if (ddayNumber < 0) {
      ddayDisplayText = `D+${Math.abs(ddayNumber)}`;
    } else if (ddayNumber > 0) {
      ddayDisplayText = `D-${ddayNumber}`;
    }
    handleChange('d_day', ddayDisplayText);
  };

  const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value;
    handleChange('date', inputDate || null);
    if (localPlanner.d_day_date) {
      calculateAndSetDday(inputDate, localPlanner.d_day_date);
    }
  };

  const handleDdayDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value;
    handleChange('d_day_date', inputDate);
    if (localPlanner.date) {
      calculateAndSetDday(localPlanner.date, inputDate);
    }
  };

  const handleGoal = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange('goal', e.target.value || null);
  };

  const handleMemo = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChange('memo', e.target.value || null);
  };

  console.log({ timetable });

  const onSubmit = async () => {
    await supabase
      .from('ten_min_planner')
      .update({
        ...localPlanner,
        todo_list: todoList,
        timetable: timetable
      })
      .eq('id', id);
  };

  return (
    <div className="w-full max-w-screen-md h-[60rem] overflow-auto mt-1">
      <button onClick={onSubmit}>저장하기</button>
      <div className="relative border-2 flex flex-col gap-4 m-auto p-4 h-[60rem]">
        <div className="flex gap-2">
          <div className="w-1/3">
            <ParchmentInput
              identity="tenMinPlannerRegular"
              label="date"
              id="date"
              type="date"
              onChange={handleDate}
              value={localPlanner.date || ''}
            />
          </div>
          <div className="w-1/3 relative">
            <ParchmentInput
              identity="tenMinPlannerRegular"
              label="d-day"
              id="d-day"
              type="date"
              onChange={handleDdayDate}
              value={localPlanner.d_day_date || ''}
            />
            <span className="absolute right-3 top-0 font-bold">{localPlanner.d_day}</span>
          </div>
          <div className="w-1/3">
            <ParchmentInput
              identity="tenMinPlannerRegular"
              label="goal"
              id="goal"
              onChange={handleGoal}
              value={localPlanner.goal || ''}
            />
          </div>
        </div>
        <div className="flex flex-row gap-4 ">
          <div className="w-1/2">
            <Todolist
              tenMinPlannerId={id}
              todoList={todoList}
              setTodoList={setTodoList}
              setSelectedColorTodo={setSelectedColorTodo}
            />
          </div>
          <div className="w-1/2 h-[40rem]">
            <Timetable selectedColorTodo={selectedColorTodo} timetable={timetable} setTimetable={setTimetable} />
          </div>
        </div>
        <div>
          <label htmlFor="memo">memo</label>
          <textarea id="memo" className="h-[3rem] w-full" onChange={handleMemo} value={localPlanner.memo || ''} />
        </div>
      </div>
    </div>
  );
};

export default TenMinPlanner;
