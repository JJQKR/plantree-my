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
      <p>{levelName}</p>
      {nickname}님의 정원✨
      <p>플랜트리와 함께 {membershipDays}일째,</p>
      <p>열심히 나무를 키우고 계시네요!</p>
    </div>
  );
};

export default GrowthSummary;
