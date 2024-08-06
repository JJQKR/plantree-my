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
    <>
      <FetchUserData />
      <FetchMembershipDays />
      <div className="flex flex-row">
        <div>{levelId && <ProfileStages levelId={levelId} size={90} />}</div>
        <div className="items-center">
          <h3 className="font-semibold text-[1rem] text-[#008A02]">{levelName}</h3>
          <h3 className="font-semibold text-[14px]">{nickname} 님의 정원</h3>

          <div className="mb-4">
            <p>플랜트리와 함께 {membershipDays}일째,</p>
            <div className="flex justify-between">
              열심히 나무를 키우고 계시네요!{' '}
              {/* <Link href="/member/hub">
              <p className="  text-blue-800 bg-slate-600 bg-opacity-10">➡️허브로 이동</p>
            </Link> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GrowthSummary;
