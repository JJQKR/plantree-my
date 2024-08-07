'use client';

import { useEffect } from 'react';
import { supabase } from '@/supabase/client';
import useUserStore from '@/stores/user.store';
import LevelUp from './LevelUp';

const AttendanceCheckTest = () => {
  const { userId, attendance, setAttendance } = useUserStore((state) => state);

  useEffect(() => {
    const handleAttendance = async () => {
      if (!userId) return;

      try {
        const now = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
        const today = now.toISOString().split('T')[0];

        const lastCheckDate = localStorage.getItem(`lastCheckDate_${userId}`);
        //이 값이 처음에 어떻게 생성되고 들어가는지 잘 파악해야겠어!!!!!!!!!!!!!!1

        const localAttendance = JSON.parse(localStorage.getItem(`attendance_${userId}`) || '0');
        //문자열 '0'임에 주의

        if (lastCheckDate === today) {
          setAttendance(localAttendance);
          return;
        }

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('attendance, created_at') //애초에 attendance는 언제 생성되고 들어가지?
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

        const lastSignIndate = authUserData?.user?.last_sign_in_at
          ? new Date(authUserData.user.last_sign_in_at).toISOString().split('T')[0]
          : null;

        //마지막로그인날짜가 오늘이 아니거나 마지막출석날짜 값이 없으면
        if (lastSignIndate !== today || !lastCheckDate) {
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
          localStorage.setItem(`lastCheckDate_${userId}`, today);
          localStorage.setItem(`attendance_${userId}`, JSON.stringify(newAttendanceCount));

          alert('출석체크 성공!');

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

    //2시간마다 출첵 실행

    const interval = setInterval(handleAttendance, 2 * 60 * 60 * 1000);
    //setInterval은 실행할 함수와 그 인터벌을 넣는건가보다
    handleAttendance();

    return () => clearInterval(interval);
  }, [userId, setAttendance]);
  //1번 useEffect의 의존배열??이 userId랑 셋어텐던스함수라고?

  useEffect(() => {
    //userId가 변경될 때 로컬스토리지 초기화
    if (userId) {
      localStorage.removeItem('lastCheckDate');
      localStorage.removeItem('attendance');
    }
  }, [userId]);

  return (
    <>
      <LevelUp />
      {/* 레벨업 로직은 출석에 따라 레벨 오를 수있기 떄문에 실행하는 거 맞는데
      이 컴포넌트의 리턴값이 레벨업로직이야? */}
    </>
  );
};
