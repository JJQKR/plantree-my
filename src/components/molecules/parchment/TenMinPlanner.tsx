'use client';

import React, { useEffect, useState } from 'react';
import Todolist from './Todolist';
import Timetable from './Timetable';
import { supabase } from '@/supabase/client';
import { TodoType } from '@/api/tenMinPlanner.api';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDeletePage } from '@/lib/hooks/usePages';
import useEditModeStore from '@/stores/editMode.store';
import { FaSave } from 'react-icons/fa';
import { FaTrashAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';

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
  const [diaryId, setDiaryId] = useState('');
  const [selectedColorTodo, setSelectedColorTodo] = useState<Todo | null>(null);
  const { isEditMode } = useEditModeStore((state) => state);
  const searchParams = useSearchParams();
  const index = searchParams.get('index');
  const style = searchParams.get('style');

  const { mutate: deletePage, isPending, isError } = useDeletePage();
  const router = useRouter();

  // db에서 현재 데이터 가져오기
  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from('ten_min_planner').select('*').eq('id', id).maybeSingle();
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
        setDiaryId(data.diary_id || '');
      }
    };
    getData();
  }, []);

  const handleChangeInputs = (
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
    handleChangeInputs('d_day', ddayDisplayText);
  };

  const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value;
    handleChangeInputs('date', inputDate || null);
    if (localPlanner.d_day_date) {
      calculateAndSetDday(inputDate, localPlanner.d_day_date);
    }
  };

  const handleDdayDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value;
    handleChangeInputs('d_day_date', inputDate);
    if (localPlanner.date) {
      calculateAndSetDday(localPlanner.date, inputDate);
    }
  };

  const handleGoal = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChangeInputs('goal', e.target.value || null);
  };

  const handleMemo = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChangeInputs('memo', e.target.value || null);
  };

  const onSubmit = async () => {
    Swal.fire({
      title: '저장하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '예',
      cancelButtonText: '아니오'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { error } = await supabase
          .from('ten_min_planner')
          .update({
            ...localPlanner,
            todo_list: todoList,
            timetable: timetable
          })
          .eq('id', id);

        if (error) {
          Swal.fire({
            title: '저장 실패!',
            text: '저장하는 중 오류가 발생했습니다. 다시 시도해주세요.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            title: '저장 성공!',
            text: '성공적으로 저장되었습니다.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          router.replace(`/member/diary/${diaryId}/parchment`);
        }
      }
    });
  };

  const handleDelete = async () => {
    Swal.fire({
      title: '삭제하시겠습니까?',
      text: '삭제된 내용은 되돌릴 수 없습니다!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '예',
      cancelButtonText: '아니오'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { error: tenMinPlannerError } = await supabase.from('ten_min_planner').delete().eq('id', id);
        deletePage(id);
        if (tenMinPlannerError) {
          Swal.fire({
            title: '삭제 실패!',
            text: '삭제 중 오류가 발생했습니다: ' + tenMinPlannerError.message,
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
            text: '성공적으로 삭제되었습니다.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          router.replace(`/member/diary/${diaryId}/parchment`);
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
    <div
      className={`sm:w-[32.5rem] w-[45rem] ${
        isEditMode ? 'sm:h-[48.7rem] h-[67.5rem]' : 'sm:h-[45.6rem] h-[63rem]'
      } bg-white border-[0.1rem] border-[#C7D2B0]`}
    >
      <div className="mx-auto w-full">
        {isEditMode ? (
          <div className="bg-[#EDF1E6] w-full sm:h-[3.1rem] h-[4.32rem] sm:pt-[0.8rem] pt-[1.1rem] sm:px-[1.5rem] px-[1.35rem] border-b-[0.1rem] border-[#C7D2B0] flex flex-row justify-between">
            <div className="sm:text-[1.2rem] text-[1.62rem] text-[#496E00] font-[600]">
              {index} Page_{changeStyleName()} (수정중)
            </div>
            <div>
              <button
                className="sm:text-[1.6rem] text-[2.16rem] text-[#496E00] hover:text-black mr-[1.08rem]"
                onClick={onSubmit}
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
        ) : null}
      </div>
      <div className="relative flex flex-col sm:gap-[0.8rem] gap-[1.44rem] mx-auto mt-[1rem] sm:w-[29.9rem] w-[41.4rem] sm:h-[43rem] h-[59.58rem] sm:my-[1.3rem] my-[1.8rem] ">
        <div className="flex flex-row justify-between">
          <div className="sm:w-[10rem] w-[13.05rem] sm:h-[1.72rem] h-[2.43rem] flex flex-row sm:gap-[0.2rem] gap-[0.27rem] border-b-[0.2rem] border-[#EAEAEA]">
            <label
              htmlFor="date"
              className="sm:text-[0.97rem] text-[1.35rem]  font-[600] text-[#727272] flex items-center justify-center"
            >
              DATE
            </label>
            <input
              id="date"
              type="date"
              onChange={handleDate}
              value={localPlanner.date || ''}
              disabled={!isEditMode}
              className="sm:text-[0.97rem] text-[1.17rem] sm:w-[7.5rem] w-[9.27rem]"
            />
          </div>
          <div className="sm:w-[10rem] w-[13.05rem] sm:h-[1.72rem] h-[2.43rem] flex flex-row sm:gap-[0.2rem] gap-[0.18rem] border-b-[0.2rem] border-[#EAEAEA]">
            <label
              htmlFor="date"
              className="sm:text-[0.97rem] text-[1.35rem] font-[600] text-[#727272] w-[4.14rem] flex items-center justify-center tracking-tight"
            >
              D-Day
            </label>
            <input
              id="d-day"
              type="date"
              onChange={handleDdayDate}
              value={localPlanner.d_day_date || ''}
              disabled={!isEditMode}
              className="sm:text-[0.97rem] text-[1.17rem] sm:w-[7rem] w-[9rem]"
            />
          </div>
          <div className=" sm:w-[8.5rem] w-[13.05rem] sm:h-[1.72rem] h-[2.43rem] bg-[#EAEAEA] sm:rounded-[0.52rem] rounded-[0.72rem] flex justify-center items-center sm:text-[0.97rem] text-[1.35rem] font-[600]">
            {localPlanner.d_day ? (
              localPlanner.d_day
            ) : (
              <div className=" sm:h-[1.4rem] h-[1.62rem] font-[600] sm:text-[0.97rem] text-[1.35rem]">D-000</div>
            )}
          </div>
        </div>
        <div className="flex flex-row w-full sm:h-[1.72rem] h-[2.43rem] gap-[0.27rem] border-b-[0.2rem] border-[#EAEAEA]">
          <label className="sm:text-[0.97rem] text-[1.35rem] font-[600] text-[#727272] sm:w-[2.6rem] w-[3.42rem] flex items-center justify-center">
            GOAL
          </label>
          <input
            id="goal"
            onChange={handleGoal}
            value={localPlanner.goal || ''}
            disabled={!isEditMode}
            className="w-full ml-[0.18rem] px-[0.45rem] sm:text-[0.97rem] text-[1.35rem]"
            placeholder="목표를 입력해주세요."
          />
        </div>
        <div className="flex flex-row justify-between sm:gap-[1.1rem] gap-[1.44rem] h-full">
          <div className="flex flex-col">
            <div className="sm:w-[17rem] w-[23.49rem] h-full ">
              <div className="sm:text-[0.97rem] text-[1.35rem] sm:h-[1.72rem] h-[2.43rem] w-full font-[600] text-[#727272] flex flex-row items-center justify-start border-b-[0.2rem] leading-[0.09rem]">
                TASK
              </div>
              <Todolist
                tenMinPlannerId={id}
                todoList={todoList}
                setTodoList={setTodoList}
                setSelectedColorTodo={setSelectedColorTodo}
                selectedColorTodo={selectedColorTodo}
              />
            </div>
            <div className="sm:h-[8.65rem] h-[11.97rem]">
              <label
                htmlFor="memo"
                className="sm:text-[0.97rem] text-[1.35rem] sm:h-[1.72rem] h-[2.43rem] w-full font-[600] text-[#727272] flex flex-row items-center justify-start border-b-[0.2rem] leading-[0.09rem]"
              >
                MEMO
              </label>
              <textarea
                id="memo"
                className="sm:h-[6.17rem] h-[8.55rem] w-full resize-none sm:text-[0.97rem] text-[1.5rem] "
                onChange={handleMemo}
                value={localPlanner.memo || ''}
                disabled={!isEditMode}
              />
            </div>
          </div>
          <div className="sm:w-[11.8rem] w-[16.38rem] h-full">
            <div className='sm:text-[0.97rem] text-[1.35rem] sm:h-[1.72rem] h-[2.43rem] w-full font-[600] text-[#727272] flex flex-row items-center justify-start border-b-[0.2rem] leading-[0.1rem]"'>
              TIMETABLE
            </div>
            <Timetable selectedColorTodo={selectedColorTodo} timetable={timetable} setTimetable={setTimetable} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenMinPlanner;
