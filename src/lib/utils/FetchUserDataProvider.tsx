'use client';

import React from 'react';
import { useUserData, useUserNickname, useUserLevel, useUserAttendance } from '@/hooks/useUserData';
import useUserStore from '@/stores/user.store';

export const FetchUserDataProvider = ({ children }: { children: React.ReactNode }) => {
  const { userId } = useUserStore((state) => state); // `useUserStore`에서 userId 가져오기

  // Fetch user auth data
  const { user, userLoading, userError } = useUserData();

  // Fetch nickname, level, and attendance (dependent on userId)
  const { nickname, nicknameLoading } = useUserNickname(userId);
  const { levelName, levelLoading } = useUserLevel(userId);
  const { attendance, attendanceLoading } = useUserAttendance(userId);

  // Loading state handling or error handling could be done here
  if (userLoading || nicknameLoading || levelLoading || attendanceLoading) {
    return <div>Loading...</div>;
  }

  if (userError) {
    return <div>Error fetching user data: {userError.message}</div>;
  }

  return <>{children}</>; // Render children components when data fetching is done
};

export default FetchUserDataProvider;
