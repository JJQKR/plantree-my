'use client';

import { useEffect } from 'react';
import { supabase } from '@/supabase/client';
import useUserStore from '@/stores/user.store';
import LevelUp from './LevelUp';

const AttendanceCheck = () => {
  const { userId, attendance, setAttendance } = useUserStore((state) => state);

  useEffect(() => {
    const handleAttendance = async () => {
      if (!userId) return;

      try {
        // 한국 시간으로 오늘 날짜 계산
        const now = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
        const today = now.toISOString().split('T')[0]; // 현재 날짜 (YYYY-MM-DD 형식)

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('attendance, created_at, lastCheckDate')
          .eq('id', userId)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          throw userError;
        }

        // DB에 저장된 시간은 한국 시간 기준
        const createdAtDate = userData.created_at ? new Date(userData.created_at).toISOString().split('T')[0] : null;
        const lastCheckDate = userData.lastCheckDate
          ? new Date(userData.lastCheckDate).toISOString().split('T')[0]
          : null;

        // 출석 체크 조건 확인 및 출석 처리
        if (!lastCheckDate || lastCheckDate !== today) {
          const newAttendanceCount = userData.attendance + 1;

          const { error: updateError } = await supabase
            .from('users')
            .update({ attendance: newAttendanceCount, lastCheckDate: today })
            .eq('id', userId);

          if (updateError) {
            console.error('Error updating attendance:', updateError);
            throw updateError;
          }

          setAttendance(newAttendanceCount);

          alert('출석체크 성공!');
        } else {
          setAttendance(userData.attendance);
        }
      } catch (error) {
        console.error('Attendance check error:', error);
      }
    };

    // 1시간마다 출석 체크 실행
    const interval = setInterval(handleAttendance, 1 * 60 * 60 * 1000);
    handleAttendance(); // 초기 로드 시 출석 체크 실행

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 클리어
  }, [userId, setAttendance]);

  return (
    <>
      <LevelUp /> {/* 레벨업 로직 실행 */}
    </>
  );
};

export default AttendanceCheck;
