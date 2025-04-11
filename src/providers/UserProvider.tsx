'use client';

import { supabase } from '@/supabase/client';
import React, { useEffect } from 'react';
import useUserStore from '@/stores/user.store';

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUserId, setNickname, setLevelName, setAttendance, setEmail } = useUserStore((state) => state);

  useEffect(() => {
    const fetchUserData = async () => {
      // 세션을 먼저 확인
      const { data: sessionData } = await supabase.auth.getSession();

      // 세션 없ㅎ으면 걍 리턴
      if (!sessionData.session) return;

      // if로 세션 확인하고 있으면  user 정보 가져오기
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError) {
        console.error('사용자 인증정보 가져오기 실패:', authError);
        return;
      }

      const user = authData?.user;
      if (user) {
        setUserId(user.id);
        setEmail(user.email ?? null);

        //사용자 정보 쿼리 한번으로 가져오기

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select(`nickname, attendance, level_id, level:level_id(name)`)
          .eq('id', user.id)
          .single();

        if (userError) {
          console.error('사용자 정보 가져오기 실패:', userError);
        } else {
          setNickname(userData.nickname ?? '');
          setAttendance(userData.attendance ?? 0);
          if (userData.level) {
            setLevelName(userData.level.name);
          }
        }
      }
    };
  }, [setNickname, setLevelName, setUserId, setAttendance, setEmail]);

  return <>{children}</>;
};

export default UserProvider;
