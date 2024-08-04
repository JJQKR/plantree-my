import React, { useEffect, useState } from 'react';
import { totalBadges } from '../atoms/TotalBadges';
import useUserStore from '@/stores/user.store';

const ObtainedBadgesCount: React.FC = () => {
  const { diaryCount, membershipDays } = useUserStore((state) => state);
  const [obtainedBadgesCount, setObtainedBadgesCount] = useState(0);

  useEffect(() => {
    const calculateObtainedBadges = () => {
      let count = 0;
      totalBadges.forEach((badgeGroup) => {
        const badge = { ...badgeGroup[1] };
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
        if (isObtained) count++;
      });
      setObtainedBadgesCount(count);
    };

    calculateObtainedBadges();
  }, [diaryCount, membershipDays]);

  return <span>{obtainedBadgesCount}</span>;
};

export default ObtainedBadgesCount;
