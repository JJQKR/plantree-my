'use client';

import { useEffect } from 'react';
import { supabase } from '@/supabase/client';
import useUserStore from '@/stores/user.store';
import LevelUp from './LevelUp';

const AttendanceCheck = () => {
  const { userId, attendance, setAttendance } = useUserStore((state) => state);

  useEffect(() => {
    const handleAttendance = async () => {
      if (!userId) {
        return;
      }

      try {
        // 한국 시간으로 오늘 날짜 계산
        const now = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
        const today = now.toISOString().split('T')[0]; // 현재 날짜 (YYYY-MM-DD 형식)

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('attendance, created_at')
          .eq('id', userId)
          .single();
        if (userError) {
          console.error('Error fetching user data:', userError);
          throw userError;
        }

        const createdAtDate = userData.created_at ? new Date(userData.created_at).toISOString().split('T')[0] : null;

        const { data: authUserData, error: authUserError } = await supabase.auth.getUser();
        if (authUserError) {
          console.error('Error fetching auth user data:', authUserError);
          throw authUserError;
        }

        const lastSignInDate = authUserData?.user?.last_sign_in_at
          ? new Date(authUserData.user.last_sign_in_at).toISOString().split('T')[0]
          : null;

        // 출석 체크 조건 확인 및 출석 처리
        if (lastSignInDate !== today) {
          const newAttendanceCount = userData.attendance + 1;

          const { error: updateError } = await supabase
            .from('users')
            .update({ attendance: newAttendanceCount })
            .eq('id', userId);

          if (updateError) {
            console.error('Error updating attendance:', updateError);
            throw updateError;
          }

          setAttendance(newAttendanceCount);

          alert('출석체크 성공!');

          // Authentication users 테이블의 last_sign_in_at 필드를 오늘 날짜로 업데이트
          const { error: authUpdateError } = await supabase.auth.updateUser({
            data: { last_sign_in_at: now.toISOString() }
          });
          if (authUpdateError) {
            console.error('Error updating last sign-in date:', authUpdateError);
            throw authUpdateError;
          }
        } else {
          setAttendance(userData.attendance);
        }
      } catch (error) {
        console.error('Attendance check error:', error);
      }
    };

    handleAttendance();
  }, [userId, setAttendance]);

  return (
    <>
      <LevelUp /> {/* 레벨업 로직 실행 */}
    </>
  );
};

export default AttendanceCheck;
