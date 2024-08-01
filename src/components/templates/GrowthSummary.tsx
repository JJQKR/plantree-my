'use client';

import React, { useEffect, useState } from 'react';
import FetchUserData from '@/lib/utils/FetchUserData';
import FetchMembershipDays from '@/lib/utils/FetchMembershipDays';
import useUserStore from '@/stores/user.store';
import ProfileStages from '../molecules/ProfileStages';
import { supabase } from '@/supabase/client';
import Link from 'next/link';

const GrowthSummary = () => {
  const { nickname, levelName, membershipDays, userId } = useUserStore((state) => state);
  const [levelId, setLevelId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserLevelId = async () => {
      const { data: user, error } = await supabase.from('users').select('level_id').eq('id', userId).single();

      if (error) {
        console.error('사용자 레벨 ID 가져오기 실패:', error);
      } else {
        setLevelId(user.level_id);
      }
    };

    if (userId) {
      fetchUserLevelId();
    }
  }, [userId]);

  return (
    <div className="mt-5 flex flex-col">
      <FetchUserData />
      <FetchMembershipDays />
      {levelId && <ProfileStages levelId={levelId} size={80} />} {/* 레벨에 맞는 프로필 이미지 표시 */}
      <div className="flex items-center">
        <h3 className="font-semibold mt-1 mb-3 text-[14px]">
          {levelName}, {nickname} 님의 정원✨
        </h3>
        <Link href="/member">
          <p className="ml-2 text-blue-500">허브로 이동</p>
        </Link>
      </div>
      <div className="mb-4">
        <p>플랜트리와 함께 {membershipDays}일째,</p>
        <p>열심히 나무를 키우고 계시네요!</p>
      </div>
    </div>
  );
};

export default GrowthSummary;
