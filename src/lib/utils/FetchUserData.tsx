import { supabase } from '@/supabase/client';
import React, { useEffect } from 'react';
import useUserStore from '@/stores/user.store';

const FetchUserData = () => {
  const { setUserId, setNickname, setLevelName } = useUserStore((state) => state);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          throw sessionError;
        }

        const user = sessionData?.session?.user;
        if (user) {
          const { email, id } = user;
          setUserId(id);
          await fetchNickname(email);
          await fetchLevelId(email);
        } else {
          console.error('User session not found.');
        }
      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
      }
    };

    const fetchNickname = async (email: string) => {
      try {
        const { data, error } = await supabase.from('users').select('nickname').eq('email', email).maybeSingle();
        if (error) {
          throw error;
        }
        if (data) {
          setNickname(data.nickname);
        } else {
          console.error('Nickname not found for email:', email);
        }
      } catch (error) {
        console.error('Nickname fetching error:', error);
      }
    };

    const fetchLevelId = async (email: string) => {
      try {
        const { data, error } = await supabase.from('users').select('level_id').eq('email', email).maybeSingle();
        if (error) {
          throw error;
        }
        console.log('Fetched Level ID data:', data); // 데이터 로그 추가
        if (data && data.level_id) {
          await fetchLevelName(data.level_id);
        } else {
          console.error('Level ID not found for email:', email);
        }
      } catch (error) {
        console.error('Level ID fetching error:', error);
      }
    };

    const fetchLevelName = async (levelId: string) => {
      try {
        const { data, error } = await supabase.from('level').select('name').eq('id', levelId).maybeSingle();
        if (error) {
          throw error;
        }
        console.log('Fetched Level Name data:', data); // 데이터 로그 추가
        if (data) {
          setLevelName(data.name);
        } else {
          console.error('Level name not found for level_id:', levelId);
        }
      } catch (error) {
        console.error('Level name fetching error:', error);
      }
    };

    fetchUserData();
  }, [setUserId, setNickname, setLevelName]);

  return null;
};

export default FetchUserData;
