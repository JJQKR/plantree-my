import React, { useEffect } from 'react';
import FetchUserData from '@/lib/utils/FetchUserData';
import FetchMembershipDays from '@/lib/utils/FetchMembershipDays';
import useUserStore from '@/stores/user.store';
import ProfileStages from '../molecules/ProfileStages';
import { supabase } from '@/supabase/client';

const GrowthSummary = () => {
  const { nickname, levelName, membershipDays, userId, setLevelId, updatedLevelId } = useUserStore((state) => state);

  useEffect(() => {
    const fetchUserLevelId = async () => {
      if (userId) {
        const { data: user, error } = await supabase.from('users').select('level_id').eq('id', userId).single();

        if (!error && user) {
          setLevelId(user.level_id); // Global 상태 업데이트
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

      <div className="flex flex-row w-[98rem] h-[16rem] pt-[3.2rem] pb-[3.2rem] bg-white rounded-tr-[2rem] rounded-tl-[2rem]">
        <div className="mx-[4rem]">{updatedLevelId && <ProfileStages size={100} />}</div> {/* updatedLevelId 사용 */}
        <div className="items-center">
          <span className="font-semibold text-[2.6rem] text-[#008A02]">{levelName}</span>
          <span className="font-semibold text-[2.6rem] ml-[2rem]">{nickname} 님의 정원</span>

          <div className="font-semibold text-[2rem] text-[#727272]">
            <p>플랜트리와 함께 {membershipDays}일째,</p>
            <div className="flex justify-between">열심히 나무를 키우고 계시네요!</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GrowthSummary;
