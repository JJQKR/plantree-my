import { supabase } from '@/supabase/client';
import React, { useEffect, useState } from 'react';

const fetchNickname = () => {
  const [nickname, setNickname] = useState<string | null>(null);

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
          setNickname(data.nickname);
        }
      }
    };

    fetchNickname();
  }, []);

  return <div>{nickname && <p className="text-black text-lg font-bold">{nickname}</p>}</div>;
};

export default fetchNickname;
