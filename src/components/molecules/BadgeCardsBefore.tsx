'use client';

import useUserStore from '@/stores/user.store';
import { totalBadges } from '../atoms/TotalBadges';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const BadgeCardsBefore: React.FC = () => {
  const { diaryCount, membershipDays } = useUserStore((state) => state);
  const [badgesState, setBadgesState] = useState(
    totalBadges.map((badgeGroup) => ({
      ...badgeGroup[1],
      content: badgeGroup[1].content.replace('true', 'false')
    }))
  );

  useEffect(() => {
    const updateBadges = () => {
      setBadgesState((prevBadges) =>
        prevBadges.map((badge) => {
          let isObatained = false;
          if (badge.id.includes('다이어리수집가') && diaryCount !== null && diaryCount >= 3) {
            isObatained = true;
          } else if (badge.id.includes('문구점사장님') && diaryCount !== null && diaryCount >= 15) {
            isObatained = true;
          } else if (badge.id.includes('안녕하세요') && membershipDays !== null && membershipDays >= 1) {
            isObatained = true;
          } else if (badge.id.includes('빨리친해지길바라') && membershipDays !== null && membershipDays >= 7) {
            isObatained = true;
          } else if (badge.id.includes('찐친') && membershipDays !== null && membershipDays >= 30) {
            isObatained = true;
          }
          return {
            ...badge,
            isObatained,
            content: isObatained ? badge.content.replace('false', 'true') : badge.content.replace('true', 'false')
          };
        })
      );
    };
    updateBadges();
  }, [diaryCount, membershipDays]);

  return (
    <div className="grid grid-cols-4 sm:grid-cols-2">
      {badgesState.map((badge, index) => (
        <div
          key={index}
          className="relative w-[20.8rem] h-[32.4rem] m-[0.8rem] sm:m-[0.4rem]
        sm:w-[10rem] sm:h-[17.2rem] sm:mx-[0.8rem]"
        >
          {' '}
          <Image
            src={badge.content}
            alt={badge.isObtained ? 'Obtained Badge' : 'Unobtained Badge'}
            fill
            style={{ objectFit: 'contain' }}
            className="rounded=1.6rem]"
          />
        </div>
      ))}
    </div>
  );
};
export default BadgeCardsBefore;
