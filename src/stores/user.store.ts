import { create } from 'zustand';

interface UserState {
  nickname: string;
  setNickname: (nickname: string) => void;
  levelName: string | null;
  setLevelName: (levelName: string | null) => void;
  membershipDays: number | null;
  setMembershipDays: (membershipDays: number | null) => void;
  attendance: number;
  setAttendance: (attendance: number) => void;
  userId: string;
  setUserId: (userId: string) => void;
  email: string | null;
  setEmail: (email: string | null) => void;
  createdAt: string; // created_at 필드 nullable이 아님
  setCreatedAt: (createdAt: string) => void; // created_at 설정 함수
  diaryCount: number; // nullable not allowed
  setDiaryCount: (diaryCounts: number) => void;
}

const useUserStore = create<UserState>((set) => ({
  nickname: '',
  setNickname: (nickname) => set({ nickname }),
  levelName: null,
  setLevelName: (levelName) => set({ levelName }),
  membershipDays: null,
  setMembershipDays: (membershipDays) => set({ membershipDays }),
  attendance: 0,
  setAttendance: (attendance) => set({ attendance }),
  userId: '',
  setUserId: (userId) => set({ userId }),
  email: null,
  setEmail: (email) => set({ email }),
  createdAt: new Date().toISOString(), // 초기값 설정
  setCreatedAt: (createdAt) => set({ createdAt }), // 설정 함수 정의
  diaryCount: 0,
  setDiaryCount: (diaryCount) => set({ diaryCount })
}));

export default useUserStore;
