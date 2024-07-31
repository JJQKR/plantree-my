'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import useUserStore from '@/stores/user.store';
import LevelUp from './LevelUp';

const AttendanceCheck = () => {
  const { userId, attendance, setAttendance } = useUserStore((state) => state);
  const [hasChecked, setHasChecked] = useState(false); // 출석 체크 여부 상태 추가

  useEffect(() => {
    const handleAttendance = async () => {
      if (!userId || hasChecked) {
        return;
      }

      try {
        const today = new Date().toISOString().split('T')[0];

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

        if ((lastSignInDate !== today || createdAtDate === today) && userData.attendance === 0) {
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
          setHasChecked(true); // 출석 체크 완료 상태 설정

          alert('출석체크 성공!');

          const { error: authUpdateError } = await supabase.auth.updateUser({
            data: { last_sign_in_at: new Date().toISOString() }
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
  }, [userId, setAttendance, hasChecked]);

  return (
    <>
      <LevelUp /> {/* 레벨업 로직 실행 */}
    </>
  );
};

export default AttendanceCheck;
