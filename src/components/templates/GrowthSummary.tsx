'use client';

import React, { useEffect, useState } from 'react';
import FetchUserData from '@/lib/utils/FetchUserData';
import FetchMembershipDays from '@/lib/utils/FetchMembershipDays';
import useUserStore from '@/stores/user.store';
import ProfileStages from '../molecules/ProfileStages';
import { supabase } from '@/supabase/client';

// GrowthSummary 컴포넌트:

// GrowthSummary에서는 useEffect를 사용하여 컴포넌트가 마운트될 때마다
// 사용자의 레벨 ID를 supabase로부터 가져오고, 해당 레벨 ID가 상태에 저장되면 렌더링이 이루어집니다.
// loading 상태를 사용하여 데이터가 로딩 중일 때는 "로딩 중..." 메시지를 보여주고,
// 데이터 로딩이 완료된 후에만 정보를 표시합니다.
// 이로 인해 사용자의 프로필 이미지가 변경되면,
// 해당 상태가 즉시 반영되고, 한 번의 새로고침으로 변경된 상태가 바로 적용됩니다.

// GrowthSummary에서는 loading 상태를 통해
// 데이터 로딩이 완료될 때까지 컴포넌트가 리렌더링되지 않도록 처리하고있어,
// 데이터가 준비된 후에는 한 번의 새로고침으로 모든 상태가 갱신됩니다.

const GrowthSummary = () => {
  const { nickname, levelName, membershipDays, userId, levelId, setLevelId } = useUserStore((state) => state);
  // const [levelId, setLevelId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserLevelId = async () => {
      if (userId) {
        const { data: user, error } = await supabase.from('users').select('level_id').eq('id', userId).single();

        if (!error && user) {
          setLevelId(user.level_id); //Global 상태 업데이트
        } else {
          console.error('사용자 레벨ID 가져오기 실패: ', error);
        }
      }
    };
    fetchUserLevelId();
  }, [userId, setLevelId]);

  return (
    <>
      <FetchUserData />
      <FetchMembershipDays />

      <div className="flex flex-row w-[61.25rem] h-[9.5rem] pt-[1.5rem] mb-0 pb-[2rem] bg-white rounded-tr-[20px] rounded-tl-[20px]">
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
