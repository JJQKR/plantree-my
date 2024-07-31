import React from 'react';
import FetchUserData from '@/lib/utils/FetchUserData';
import FetchMembershipDays from '@/lib/utils/FetchMembershipDays';
import useUserStore from '@/stores/user.store';
import Link from 'next/link';

const GrowthSummary = () => {
  const { nickname, levelName, membershipDays } = useUserStore((state) => state);

  return (
    <div className="mt-10 flex flex-col">
      <FetchUserData />
      <FetchMembershipDays />
      <div className="w-[80px] h-[80px] mt-10 bg-white rounded-full mb-2"></div> {/* 프로필 이미지 영역 */}
      <div className="flex items-center">
        <h3 className="font-semibold mt-3 mb-3 text-[14px]">
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
