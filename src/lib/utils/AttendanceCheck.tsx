import { supabase } from '@/supabase/client';
import React, { useEffect } from 'react';
import useUserStore from '@/stores/user.store';

const AttendanceCheck = () => {
  const { userId, setAttendance, attendance } = useUserStore((state) => state);

  useEffect(() => {
    const handleAttendance = async () => {
      if (!userId) return;

      try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식의 오늘 날짜

        // 오늘 날짜의 출석 기록이 있는지 확인
        const { data: attendanceData, error: attendanceError } = await supabase
          .from('attendance')
          .select('*')
          .eq('user_id', userId)
          .eq('date', today);

        if (attendanceError) throw attendanceError;

        if (attendanceData.length === 0) {
          // 오늘 날짜의 출석 기록이 없으면 출석 체크
          const { data, error } = await supabase.from('attendance').insert([{ user_id: userId, date: today }]);

          if (error) throw error;

          // 출석 횟수 업데이트
          setAttendance(attendance + 1);
        } else {
          // 이미 출석 기록이 있으면 현재 출석 횟수를 가져오기
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('attendance')
            .eq('id', userId)
            .single();

          if (userError) throw userError;

          setAttendance(userData.attendance);
        }
      } catch (error) {
        console.error('Attendance check error:', error);
      }
    };

    handleAttendance();
  }, [userId, attendance, setAttendance]);

  return null;
};

export default AttendanceCheck;
