'use client';

import { useEffect } from 'react';
import { supabase } from '@/supabase/client';
import useUserStore from '@/stores/user.store';

const FetchMembershipDays = () => {
  const { setMembershipDays } = useUserStore((state) => state);

  useEffect(() => {
    const fetchMembershipDays = async () => {
      try {
        // 현재 인증된 사용자의 정보를 가져옴
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          console.error('Error fetching user data:', error);
          return;
        }

        if (data && data.user && data.user.created_at) {
          const createdAtUTC = new Date(data.user.created_at);
          const createdAtKST = new Date(createdAtUTC.getTime() + 9 * 60 * 60 * 1000); // UTC를 KST로 변환
          const today = new Date();
          const diffTime = Math.abs(today.getTime() - createdAtKST.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setMembershipDays(diffDays); // membershipDays 값을 상태로 설정
        } else {
          console.log('No created_at date found for this user.');
        }
      } catch (error) {
        console.error('Error calculating membership days:', error);
      }
    };

    fetchMembershipDays(); // 컴포넌트가 마운트될 때 함수 호출
  }, [setMembershipDays]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
};

export default FetchMembershipDays;
