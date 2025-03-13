import TenMinPlanner from '@/components/molecules/parchment/TenMinPlanner';
import { create } from 'zustand';
import { TodoObjectType } from './todoList.store';
import uuid from 'react-uuid';

type TodoType = {
  id: string;
  text: string;
  isDone: boolean;
  color: string;
  planner_id: string;
};

type UpdateTenMinPlannerType = {
  id: string;
  date: string;
  d_day_date: string;
  d_day: string;
  goal: string;
  memo: string;
  timetable: { [key: string]: { active: boolean; color: string; todoId: string } } | null;
  diary_id: string;
  user_id: string;
  todo_list: TodoType[];
};

interface TenMinPlannerStore {
  // tenMinPlanner 임시저장
  tenMinPlanner: UpdateTenMinPlannerType;
  setTenMinPlanner: (planner: UpdateTenMinPlannerType) => void;
  // setTenMinPlanner: (
  //   key: string,
  //   value: string | TodoType[] | { [key: string]: { active: boolean; color: string; todoId: string } } | null
  // ) => void;

  // // tenMinPlanner Id 임시저장
  // tenMinPlannerId: string | null;
  // setTenMinPlannerId: (id: string) => void;

  // // tenMinPlanner 1개 임시저장
  // tenMinPlanner: UpdateTenMinPlannerType | null;
  // setTenMinPlanner: (tenMinplanner: UpdateTenMinPlannerType) => void;

  // // tenMinPlanner date 임시저장
  // tenMinPlannerDate: string;
  // setTenMinPlannerDate: (date: string) => void;

  // // tenMinPlanner ddayDate 임시저장
  // tenMinPlannerDdayDate: string;
  // setTenMinPlannerDdayDate: (ddayDate: string) => void;

  // // tenMinPlanner dday 임시저장
  // tenMinPlannerDday: string;
  // setTenMinPlannerDday: (dday: string) => void;

  // // tenMinPlanner goal 임시저장
  // tenMinPlannerGoal: string;
  // setTenMinPlannerGoal: (goal: string) => void;

  // // tenMinPlanner memo 임시저장
  // tenMinPlannerMemo: string;
  // setTenMinPlannerMemo: (memo: string) => void;

  // tenMinPlanners 임시저장
  tenMinPlanners: UpdateTenMinPlannerType[];
  setTenMinPlanners: (tenMinPlanners: UpdateTenMinPlannerType[]) => void;
  addTenMinPlanner: (tenMinPlanner: UpdateTenMinPlannerType) => void;
  updateTenMinPlanner: (tenMinPlanner: UpdateTenMinPlannerType) => void;
}

const useTenMinPlannerStore = create<TenMinPlannerStore>((set) => ({
  // // tenMinPlanner Id 임시저장
  // tenMinPlannerId: null,
  // setTenMinPlannerId: (id) => set(() => ({ tenMinPlannerId: id })),

  // tenMinPlanner 임시저장
  tenMinPlanner: {
    id: uuid(),
    date: '',
    d_day_date: '',
    d_day: '',
    goal: '',
    memo: '',
    timetable: null,
    diary_id: '',
    user_id: '',
    todo_list: []
  },
  setTenMinPlanner: (planner) => set({ tenMinPlanner: planner }),
  // changeTenMinPlanner : set((state) => ({
  //   tenMinPlanner: state.tenMinPlanner.map((todo) => (todo.id === id ? { ...todo, isDone: !todo.isDone } : todo))
  // })),
  // setTenMinPlanner: (key, value) => set((state) => ({ tenMinPlanner: { ...state.tenMinPlanner, [key]: value } })),

  // // tenMinPlanner 1개 임시저장
  // tenMinPlanner: null,
  // setTenMinPlanner: (newTenMinplanner) => set(() => ({ tenMinPlanner: newTenMinplanner })),

  // // tenMinPlanner date 임시저장
  // tenMinPlannerDate: '',
  // setTenMinPlannerDate: (date) => set(() => ({ tenMinPlannerDate: date })),

  // // tenMinPlanner ddayDate 임시저장
  // tenMinPlannerDdayDate: '',
  // setTenMinPlannerDdayDate: (ddayDate) => set(() => ({ tenMinPlannerDdayDate: ddayDate })),

  // // tenMinPlanner dday 임시저장
  // tenMinPlannerDday: '',
  // setTenMinPlannerDday: (dday) => set(() => ({ tenMinPlannerDday: dday })),

  // // tenMinPlanner goal 임시저장
  // tenMinPlannerGoal: '',
  // setTenMinPlannerGoal: (goal) => set(() => ({ tenMinPlannerGoal: goal })),

  // // tenMinPlanner memo 임시저장
  // tenMinPlannerMemo: '',
  // setTenMinPlannerMemo: (memo) => set(() => ({ tenMinPlannerMemo: memo })),

  // tenMinPlanners 임시저장
  tenMinPlanners: [],
  setTenMinPlanners: (newTenPlanners: UpdateTenMinPlannerType[]) => set(() => ({ tenMinPlanners: newTenPlanners })),
  addTenMinPlanner: (tenMinPlanner: UpdateTenMinPlannerType) =>
    set((state) => ({ tenMinPlanners: [...state.tenMinPlanners, tenMinPlanner] })),
  updateTenMinPlanner: (planner) =>
    set((state) => ({
      tenMinPlanners: state.tenMinPlanners.map((p) => (p.id === planner.id ? planner : p))
    }))
}));

export default useTenMinPlannerStore;
