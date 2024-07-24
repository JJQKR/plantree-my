import ParchmentInput from '@/components/atoms/ParchmentInput';
import React from 'react';
import Todolist from './Todolist';
import Timetable from './Timetable';

const TenMinPlaner = () => {
  return (
    <div className="flex flex-row p-4 bg-slate-100 w-[1024px]">
      <div className="w-1/2 custom-height border-2 border-red-400 flex flex-col gap-4 m-auto p-4">
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
      </div>
      <div className="w-1/2 custom-height border-2 border-red-400 flex flex-col gap-4 m-auto p-4">
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
      </div>
    </div>
  );
};

export default TenMinPlaner;
