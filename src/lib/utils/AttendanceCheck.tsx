import { supabase } from '@/supabase/client';
import React, { useEffect } from 'react';
import useUserStore from '@/stores/user.store';

const AttendanceCheck = () => {
  const { userId, setAttendance } = useUserStore((state) => state);

  useEffect(() => {
    const handleAttendance = async () => {
      if (!userId) {
        console.log('User ID is not set.');
        return;
      }

      try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식의 오늘 날짜

        // users 테이블에서 attendance와 created_at 가져오기
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

        // Authentication users 테이블에서 Last Sign In 가져오기
        const { data: authUserData, error: authUserError } = await supabase.auth.getUser();
        if (authUserError) {
          console.error('Error fetching auth user data:', authUserError);
          throw authUserError;
        }

        const lastSignInDate = authUserData?.user?.last_sign_in_at
          ? new Date(authUserData.user.last_sign_in_at).toISOString().split('T')[0]
          : null;

        console.log('Today:', today);
        console.log('Last Sign In Date:', lastSignInDate);
        console.log('Created At Date:', createdAtDate);
        console.log('Current Attendance:', userData.attendance);

        // 출석 체크 조건: last_sign_in_at이 오늘인 동시에 created_at도 오늘이며 attendance가 0인 경우
        if (lastSignInDate === today && createdAtDate === today && userData.attendance === 0) {
          const newAttendanceCount = userData.attendance + 1;

          const { error: updateError } = await supabase
            .from('users')
            .update({ attendance: newAttendanceCount })
            .eq('id', userId);

          if (updateError) {
            console.error('Error updating attendance:', updateError);
            throw updateError;
          }

          // 출석 횟수 업데이트
          setAttendance(newAttendanceCount);

          // 출석 체크 성공 알림
          alert('출석체크 성공!');

          // Authentication users 테이블의 last_sign_in_at 필드를 오늘 날짜로 업데이트
          const { error: authUpdateError } = await supabase.auth.updateUser({
            data: { last_sign_in_at: new Date().toISOString() }
          });
          if (authUpdateError) {
            console.error('Error updating last sign-in date:', authUpdateError);
            throw authUpdateError;
          }
        } else if (lastSignInDate !== today) {
          // 출석 체크 조건: last_sign_in_at이 오늘이 아닌 경우
          const newAttendanceCount = userData.attendance + 1;

          const { error: updateError } = await supabase
            .from('users')
            .update({ attendance: newAttendanceCount })
            .eq('id', userId);

          if (updateError) {
            console.error('Error updating attendance:', updateError);
            throw updateError;
          }

          // 출석 횟수 업데이트
          setAttendance(newAttendanceCount);

          // 출석 체크 성공 알림
          alert('출석체크 성공!');

          // Authentication users 테이블의 last_sign_in_at 필드를 오늘 날짜로 업데이트
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

    if (userId) {
      handleAttendance();
    }
  }, [userId, setAttendance]);

  return null;
};

export default AttendanceCheck;
