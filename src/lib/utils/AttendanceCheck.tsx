'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import useUserStore from '@/stores/user.store';
import LevelUp from './LevelUp';
import Swal from 'sweetalert2';

const AttendanceCheck = () => {
  const { userId, attendance, setAttendance } = useUserStore((state) => state);
  const [hasCheckedToday, setHasCheckedToday] = useState(false);

  useEffect(() => {
    const handleAttendance = async () => {
      if (!userId || hasCheckedToday) return;

      try {
        // 한국 시간으로 오늘 날짜 계산
        const now = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
        const today = now.toISOString().split('T')[0]; // 현재 날짜 (YYYY-MM-DD 형식)

        // Authentication 테이블에서 created_at 데이터 가져오기
        const { data: authUserData, error: authUserError } = await supabase.auth.getUser();
        if (authUserError) {
          console.error('Error fetching auth user data:', authUserError);
          throw authUserError;
        }

        const createdAtUTC = authUserData?.user?.created_at ? new Date(authUserData.user.created_at) : null;

        // 한국 시간으로 변환
        const createdAtKST = createdAtUTC
          ? new Date(createdAtUTC.getTime() + 9 * 60 * 60 * 1000).toISOString().split('T')[0]
          : null;

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('attendance, lastCheckInDate')
          .eq('id', userId)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          throw userError;
        }

        const lastCheckInDate = userData.lastCheckInDate
          ? new Date(userData.lastCheckInDate).toISOString().split('T')[0]
          : null;

        // 출석 체크 조건 확인 및 출석 처리
        if (!lastCheckInDate || (lastCheckInDate !== today && createdAtKST !== today)) {
          // lastCheckInDate가 없거나, 마지막 출석 체크일이 오늘이 아니고, 회원가입일이 오늘이 아닌 경우에만 출석 체크
          const newAttendanceCount = userData.attendance + 1;

          const { error: updateError } = await supabase
            .from('users')
            .update({ attendance: newAttendanceCount, lastCheckInDate: today })
            .eq('id', userId);

          if (updateError) {
            console.error('Error updating attendance:', updateError);
            throw updateError;
          }

          setAttendance(newAttendanceCount);
          setHasCheckedToday(true); // 오늘 출석 체크 완료 표시
          Swal.fire({
            title: '변경 성공',
            text: `오늘도 플랜트리와 함께 하시네요!\n누적 출석 횟수 ${newAttendanceCount}회입니다.`,
            icon: 'info',
            confirmButtonText: '확인'
          });
        } else {
          setAttendance(userData.attendance);
          setHasCheckedToday(true); // 이미 출석 체크된 경우에도 표시
        }
      } catch (error) {
        console.error('Attendance check error:', error);
      }
    };

    // 1시간마다 출석 체크 실행
    const interval = setInterval(handleAttendance, 1 * 60 * 60 * 1000);
    handleAttendance(); // 초기 로드 시 출석 체크 실행

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 클리어
  }, [userId, setAttendance, hasCheckedToday]);

  return (
    <>
      <LevelUp /> {/* 레벨업 로직 실행 */}
    </>
  );
};

export default AttendanceCheck;
