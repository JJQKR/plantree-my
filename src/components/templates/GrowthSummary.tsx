'use client';

import React, { useEffect, useState } from 'react';
import FetchUserData from '@/lib/utils/FetchUserData';
import FetchMembershipDays from '@/lib/utils/FetchMembershipDays';
import useUserStore from '@/stores/user.store';
import ProfileStages from '../molecules/ProfileStages';
import { supabase } from '@/supabase/client';

const GrowthSummary = () => {
  const { nickname, levelName, membershipDays, userId } = useUserStore((state) => state);
  const [levelId, setLevelId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const fetchUserLevelId = async () => {
      console.log('Fetching user level ID for userId:', userId);
      setLoading(true); // 데이터 로딩 시작
      const { data: user, error } = await supabase.from('users').select('level_id').eq('id', userId).single();

      if (error) {
        console.error('사용자 레벨 ID 가져오기 실패:', error);
      } else {
        console.log('Fetched level ID:', user.level_id);
        setLevelId(user.level_id);
      }
      setLoading(false); // 데이터 로딩 완료
    };

    if (userId) {
      fetchUserLevelId();
    } else {
      setLoading(false); // userId가 없을 때 로딩 중 상태 해제
    }
  }, [userId]);

  console.log(
    'Rendering GrowthSummary with membershipDays:',
    membershipDays,
    'nickname:',
    nickname,
    'levelName:',
    levelName
  );

  // 로딩 중이거나 데이터가 없는 경우 로딩 메시지 표시
  if (loading || !membershipDays || !nickname || !levelName) {
    return <div>로딩 중...</div>;
  }

  return (
    <>
      <FetchUserData />
      <FetchMembershipDays />

      <div className="flex flex-row w-[61.25rem] h-[9.5rem] pt-[1.5rem] pb-[2rem] bg-white rounded-tr-[20px] rounded-tl-[20px]">
        <div className="ml-[2rem]">{levelId && <ProfileStages levelId={levelId} size={70} />}</div>
        <div className="items-center ml-[1rem]">
          <span className="font-semibold text-[1.63rem] text-[#008A02]">{levelName}</span>
          <span className="font-semibold text-[1.63rem] ml-[1rem]">{nickname} 님의 정원</span>

          <div className="font-semibold text-[1.38rem] text-[#727272]">
            <p>플랜트리와 함께 {membershipDays}일째,</p>
            <div className="flex justify-between">열심히 나무를 키우고 계시네요!</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GrowthSummary;
