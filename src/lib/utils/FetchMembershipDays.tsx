import { supabase } from '@/supabase/client';
import React, { useEffect } from 'react';
import useUserStore from '@/stores/user.store';

const FetchMembershipDays = () => {
  const { userId, setMembershipDays } = useUserStore((state) => state);

  useEffect(() => {
    const fetchMembershipDays = async (userId: string) => {
      try {
        const { data, error } = await supabase.from('users').select('created_at').eq('id', userId).maybeSingle();
        if (error) throw error;
        if (data && data.created_at) {
          const createdAt = new Date(data.created_at);
          const today = new Date();
          const diffTime = Math.abs(today.getTime() - createdAt.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setMembershipDays(diffDays);
        }
      } catch (error) {
        console.error('Membership days fetching error:', error);
      }
    };

    if (userId) {
      fetchMembershipDays(userId);
    }
  }, [userId, setMembershipDays]);

  return null;
};

export default FetchMembershipDays;
