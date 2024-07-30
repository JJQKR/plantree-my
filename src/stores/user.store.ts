import create from 'zustand';

interface UserState {
  nickname: string;
  setNickname: (nickname: string) => void;
  levelName: string | null;
  setLevelName: (levelName: string | null) => void;
  membershipDays: number | null;
  setMembershipDays: (membershipDays: number | null) => void;
  attendance: number;
  setAttendance: (attendance: number) => void;
  userId: string | null;
  setUserId: (userId: string | null) => void;
  email: string | null;
  setEmail: (email: string | null) => void;
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
  userId: null,
  setUserId: (userId) => set({ userId }),
  email: null,
  setEmail: (email) => set({ email })
}));

export default useUserStore;
