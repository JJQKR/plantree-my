'use client';

import { supabase } from '@/supabase/client';
import React, { useEffect } from 'react';
import useUserStore from '@/stores/user.store';

const FetchMembershipDays = () => {
  const { userId, setMembershipDays } = useUserStore((state) => state);

  useEffect(() => {
    const fetchMembershipDays = async (userId: string) => {
      console.log('Fetching membership days for userId:', userId);
      try {
        const { data, error } = await supabase.auth.getUser(userId);

        if (error) {
          console.error('Error fetching user data:', error);
          return;
        }

        if (data && data.user && data.user.created_at) {
          const createdAtUTC = new Date(data.user.created_at);
          console.log('Fetched created_at:', data.user.created_at);
          const createdAtKST = new Date(createdAtUTC.getTime() + 9 * 60 * 60 * 1000); // UTC를 KST로 변환
          const today = new Date();
          const diffTime = Math.abs(today.getTime() - createdAtKST.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          console.log('Calculated membershipDays:', diffDays);
          setMembershipDays(diffDays); // 여기서 membershipDays가 설정됨
        } else {
          console.log('User data is missing or malformed:', data);
        }
      } catch (error) {
        console.error('Membership days fetching error:', error);
      }
    };

    if (userId) {
      fetchMembershipDays(userId);
    } else {
      console.log('No userId provided');
    }
  }, [userId, setMembershipDays]);

  return null;
};

export default FetchMembershipDays;
