import ParchmentInput from '@/components/atoms/ParchmentInput';
import React from 'react';
import Todolist from './Todolist';
import Timetable from './Timetable';

const TenMinPlaner = () => {
  return (
    <div className="w-10/12 h-5/6 border-2 border-red-400">
      <div className="flex gap-2">
        <div>
          <ParchmentInput identity="tenMinPlanerRegular" label="date" id="date" />
        </div>
        <div>
          <ParchmentInput identity="tenMinPlanerRegular" label="d-day" id="d-day" />
        </div>
        <div>
          <ParchmentInput identity="tenMinPlanerRegular" label="goal" id="goal" />
        </div>
      </div>
      <div>
        <div>
          <Todolist />
        </div>
        <div>
          <Timetable />
        </div>
      </div>
      <div>
        <ParchmentInput identity="tenMinPlanerRegular" label="memo" id="memo" />
      </div>
    </div>
  );
};

export default TenMinPlaner;
