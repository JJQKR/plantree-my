'use client';

import { supabase } from '@/supabase/client';
import React, { useEffect } from 'react';
import useUserStore from '@/stores/user.store';

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUserId, setNickname, setLevelName, setAttendance, setEmail } = useUserStore((state) => state);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('어스 유저 페치 에러 발생', authError);
        return;
      }

      const user = authData?.user;
      if (user) {
        setUserId(user.id);
        setEmail(user.email ?? null);

        // supbase users 한번만 가져와도 되지 않습니까? 예?
        const { data: nicknameData, error: nicknameError } = await supabase
          .from('users')
          .select('nickname')
          .eq('id', user.id)
          .single();

        if (nicknameError) {
          console.error('닉네임 가져오기 실패:', nicknameError);
        } else {
          setNickname(nicknameData.nickname ?? '');
        }

        const { data: levelData, error: levelError } = await supabase
          .from('users')
          .select('level_id')
          .eq('id', user.id)
          .single();

        if (levelError) {
          console.error('레벨 가져오기 실패:', levelError);
        } else if (levelData.level_id) {
          const { data: levelNameData, error: levelNameError } = await supabase
            .from('level')
            .select('name')
            .eq('id', levelData.level_id)
            .single();

          if (levelNameError) {
            console.error('레벨 이름 갖오시 실패:', levelNameError);
          } else {
            setLevelName(levelNameData.name);
          }
        }

        //users 에서 출석횟수 가져오기
        const { data: attendanceData, error: attendanceError } = await supabase
          .from('users')
          .select('attendance')
          .eq('id', user.id)
          .single();

        if (attendanceError) {
          console.error('출석횟수 가져오기 실패', attendanceError);
        } else {
          setAttendance(attendanceData.attendance);
        }
      }
    };

    fetchUserData();
  }, [setNickname, setLevelName, setUserId, setAttendance, setEmail]);

  return <>{children}</>;
};

export default UserProvider;
