import { supabase } from '@/supabase/client';
import React, { useEffect, useRef } from 'react';

const useUserLevelName = () => {
  const levelNameRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchUserLevelName = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (user) {
        // users 테이블에서 level_id를 가져옴
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('level_id')
          .eq('id', user.id)
          .single();
        if (userError) {
          console.error('레벨 ID 가져오기 실패:', userError);
        } else {
          const levelId = userData.level_id;

          // levelId가 null이 아닌 경우에만 level 테이블에서 name을 가져옴
          if (levelId) {
            const { data: levelData, error: levelError } = await supabase
              .from('level')
              .select('name')
              .eq('id', levelId)
              .single();
            if (levelError) {
              console.error('레벨 이름 가져오기 실패:', levelError);
            } else {
              levelNameRef.current = levelData.name;
            }
          } else {
            console.error('레벨 ID가 null입니다.');
          }
        }
      }
    };

    fetchUserLevelName();
  }, []);

  return levelNameRef;
};

const LevelNameDisplay = () => {
  const levelNameRef = useUserLevelName();

  return <div>{levelNameRef.current && <p className="text-black text-lg font-bold">{levelNameRef.current}</p>}</div>;
};

export default LevelNameDisplay;
