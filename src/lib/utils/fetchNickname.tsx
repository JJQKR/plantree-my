import { supabase } from '@/supabase/client';
import React, { useEffect, useRef } from 'react';

const useNickname = () => {
  const nicknameRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchNickname = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase.from('users').select('nickname').eq('id', user.id).single();
        if (error) {
          console.error('닉네임 가져오기 실패:', error);
        } else {
          nicknameRef.current = data.nickname;
        }
      }
    };

    fetchNickname();
  }, []);

  return nicknameRef;
};

const NicknameDisplay = () => {
  const nicknameRef = useNickname();

  return <div>{nicknameRef.current && <p className="text-black text-lg font-bold">{nicknameRef.current}</p>}</div>;
};

export default NicknameDisplay;
