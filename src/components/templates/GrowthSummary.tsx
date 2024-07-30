import React from 'react';
import FetchUserData from '@/lib/utils/FetchUserData';
import FetchMembershipDays from '@/lib/utils/FetchMembershipDays';
import useUserStore from '@/stores/user.store';

const GrowthSummary = () => {
  const { nickname, levelName, membershipDays } = useUserStore((state) => state);

  return (
    <div>
      <FetchUserData />
      <FetchMembershipDays />
      <div>
        <div className="w-[80px] h-[80px] mt-8 bg-white rounded-full mb-2"></div> {/* 프로필 이미지 영역 */}
        <h3 className="font-semibold mt-3 mb-3 text-[14px]">
          {levelName}, {nickname} 님의 정원✨
        </h3>
        <div className="mb-4">
          <p>플랜트리와 함께 {membershipDays}일째,</p>
          <p>열심히 나무를 키우고 계시네요!</p>
        </div>
      </div>
    </div>
  );
};

export default GrowthSummary;
