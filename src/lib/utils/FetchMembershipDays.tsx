'use client';

import { supabase } from '@/supabase/client';
import React, { useEffect } from 'react';
import useUserStore from '@/stores/user.store';

const FetchMembershipDays = () => {
  const { userId, setMembershipDays } = useUserStore((state) => state);

  useEffect(() => {
    const fetchMembershipDays = async (userId: string) => {
      try {
        // auth.getUser를 사용하여 auth.users 테이블에서 created_at 값 가져오기
        const { data, error } = await supabase.auth.getUser(userId);

        if (error) throw error;

        if (data && data.user && data.user.created_at) {
          const createdAtUTC = new Date(data.user.created_at);
          const createdAtKST = new Date(createdAtUTC.getTime() + 9 * 60 * 60 * 1000); // UTC를 KST로 변환
          const today = new Date();
          const diffTime = Math.abs(today.getTime() - createdAtKST.getTime());
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
