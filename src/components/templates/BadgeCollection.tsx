import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { totalBadges } from '../atoms/TotalBadges';
import useUserStore from '@/stores/user.store';

const BadgeCollection: React.FC = () => {
  const { diaryCount, membershipDays } = useUserStore((state) => state);
  const [badgesState, setBadgesState] = useState(
    totalBadges.map((badgeGroup) => ({
      ...badgeGroup[1], // 초기값으로 획득되지 않은 배지를 설정
      content: badgeGroup[1].content.replace('true', 'false')
    }))
  );

  useEffect(() => {
    const updateBadges = () => {
      setBadgesState((prevBadges) =>
        prevBadges.map((badge) => {
          let isObtained = false;
          if (badge.id.includes('다이어리수집가') && diaryCount !== null && diaryCount >= 3) {
            isObtained = true;
          } else if (badge.id.includes('문구점사장님') && diaryCount !== null && diaryCount >= 15) {
            isObtained = true;
          } else if (badge.id.includes('안녕하세요') && membershipDays !== null && membershipDays >= 1) {
            isObtained = true;
          } else if (badge.id.includes('빨리친해지길바라') && membershipDays !== null && membershipDays >= 7) {
            isObtained = true;
          } else if (badge.id.includes('찐친') && membershipDays !== null && membershipDays >= 30) {
            isObtained = true;
          }
          return {
            ...badge,
            isObtained,
            content: isObtained ? badge.content.replace('false', 'true') : badge.content.replace('true', 'false')
          };
        })
      );
    };

    updateBadges();
  }, [diaryCount, membershipDays]);

  return (
    <div className="bg-white rounded-[10px] shadow-md w-[600px] h-[200px]">
      <div className="flex flex-row justify-between">
        {badgesState.slice(0, 4).map((badge, index) => (
          <div key={index} className="m-5">
            <Image
              src={badge.content}
              alt={badge.isObtained ? 'Obtained Badge' : 'Unobtained Badge'}
              width={100}
              height={150}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgeCollection;
