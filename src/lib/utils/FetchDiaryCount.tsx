import { supabase } from '@/supabase/client';
import React, { useEffect } from 'react';
import useUserStore from '@/stores/user.store';

const FetchDiaryCount = () => {
  const { userId, setDiaryCount } = useUserStore((state) => state);

  useEffect(() => {
    const fetchDiaryCount = async (userId: string) => {
      try {
        const { data, error } = await supabase.from('users').select('diary_count').eq('id', userId).maybeSingle();
        if (error) throw error;
        if (data && data.diary_count !== undefined) {
          setDiaryCount(data.diary_count);
        }
      } catch (error) {
        console.error('Error fetching diary count:', error);
      }
    };

    if (userId) {
      fetchDiaryCount(userId);
    }
  }, [userId, setDiaryCount]);

  return null;
};

export default FetchDiaryCount;
