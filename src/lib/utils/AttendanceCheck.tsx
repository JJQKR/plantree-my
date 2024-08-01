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

        // 로컬 스토리지에서 마지막 출석 체크 날짜 가져오기
        const lastCheckDate = localStorage.getItem('lastCheckDate');

        // 로컬 스토리지에서 출석 횟수 가져오기
        const localAttendance = JSON.parse(localStorage.getItem('attendance') || '0');

        // 이미 오늘 출석 체크가 완료된 경우 중복 체크 방지
        if (lastCheckDate === today) {
          setAttendance(localAttendance);
          return;
        }

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('attendance, created_at')
          .eq('id', userId)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          throw userError;
        }

        // DB에 저장된 시간은 한국 시간 기준
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

        // 출석 체크 조건 확인 및 출석 처리
        if (lastSignInDate !== today || !lastCheckDate) {
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
          localStorage.setItem('lastCheckDate', today); // 로컬 스토리지에 출석 체크 완료 날짜 저장
          localStorage.setItem('attendance', JSON.stringify(newAttendanceCount)); // 로컬 스토리지에 출석 횟수 저장

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

    // 2시간마다 출석 체크 실행
    const interval = setInterval(handleAttendance, 2 * 60 * 60 * 1000);
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
