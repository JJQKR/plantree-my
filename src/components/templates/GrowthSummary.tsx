import { supabase } from '@/supabase/client';
import React, { useEffect, useState } from 'react';
import useUserStore from '@/stores/user.store'; // 유저 상태 관리 스토어 추가

const GrowthSummary = () => {
  const { nickname, setNickname } = useUserStore((state) => state); // 유저 상태 관리 스토어에서 닉네임 가져오기
  const [levelName, setLevelName] = useState<string | null>(null);

  useEffect(() => {
    const fetchNickname = async (email: string) => {
      try {
        const { data, error } = await supabase.from('users').select('nickname').eq('email', email).maybeSingle();

        if (error) {
          throw error;
        }

        console.log('Nickname data:', data);

        if (data) {
          setNickname(data.nickname); // 전역 상태에 닉네임 설정
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

        console.log('Level ID data:', data);

        if (data && data.level_id) {
          fetchLevelName(data.level_id);
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

        console.log('Level data:', data);

        if (data) {
          setLevelName(data.name);
        } else {
          console.error('Level name not found for level_id:', levelId);
        }
      } catch (error) {
        console.error('Level name fetching error:', error);
      }
    };

    const fetchUserData = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          throw sessionError;
        }

        const user = sessionData?.session?.user;
        if (user) {
          const { email } = user;
          fetchNickname(email);
          fetchLevelId(email);
        } else {
          console.error('User session not found.');
        }
      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
      }
    };

    fetchUserData();
  }, [setNickname]);

  return (
    <div>
      <p>{levelName}</p>
      {nickname}님의 정원✨
      <p>플랜트리와 함께 100일째,</p>
      <p>열심히 나무를 키우고 계시네요!</p>
    </div>
  );
};

export default GrowthSummary;
