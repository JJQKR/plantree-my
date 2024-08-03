import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { totalBadges } from '../atoms/TotalBadges';
import useUserStore from '@/stores/user.store';
import FetchDiaryCount from '@/lib/utils/FetchDiaryCount';
import FetchMembershipDays from '@/lib/utils/FetchMembershipDays';

const BadgeCards: React.FC = () => {
  const { diaryCount, membershipDays } = useUserStore((state) => state);
  const [badgesState, setBadgesState] = useState(totalBadges);

  useEffect(() => {
    const updateBadges = () => {
      setBadgesState((prevBadges) =>
        prevBadges.map((badgeGroup) =>
          badgeGroup.map((badge) => {
            const isObtained =
              (badge.id.includes('다이어리수집가') && diaryCount >= 3) ||
              (badge.id.includes('문구점사장님') && diaryCount >= 15) ||
              (badge.id.includes('안녕하세요') && membershipDays >= 1) ||
              (badge.id.includes('빨리친해지길바라') && membershipDays >= 7) ||
              (badge.id.includes('찐친') && membershipDays >= 30);

            return isObtained ? { ...badge, isObtained: true } : badge;
          })
        )
      );
    };

    updateBadges();
  }, [diaryCount, membershipDays]);

  return (
    <div className="grid grid-cols-3 gap-2">
      {badgesState.map((badgeGroup, index) => (
        <div key={index} className="m-5">
          {badgeGroup.map((badge, idx) => (
            <Image
              key={idx}
              src={badge.isObtained ? badge.content : badge.content.replace('true', 'false')}
              alt={badge.isObtained ? 'Obtained Badge' : 'Unobtained Badge'}
              width={100}
              height={150}
            />
          ))}
        </div>
      ))}
      <FetchDiaryCount />
      <FetchMembershipDays />
    </div>
  );
};

export default BadgeCards;
