'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { totalBadges } from '../atoms/TotalBadges';
import useUserStore from '@/stores/user.store';

const BadgeCollection: React.FC = () => {
  const { diaryCount, membershipDays } = useUserStore((state) => state);
  const [badgesState, setBadgesState] = useState(
    totalBadges.map((badgeGroup) => ({
      ...badgeGroup[1],
      content: badgeGroup[1].content.replace('true', 'false')
    }))
  );

  const [sliceIndex, setSliceIndex] = useState(4);

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

    const handleResize = () => {
      const mediaQuery = window.matchMedia('(max-width: 767px)');
      if (mediaQuery.matches) {
        setSliceIndex(2); // 화면이 sm 사이즈일 때 2개 요소만 보여줌
      } else {
        setSliceIndex(4); // 화면이 sm 사이즈가 아닐 때 4개 요소를 보여줌
      }
    };

    updateBadges();

    // 초기 화면 크기에 따라 설정
    handleResize();

    // 화면 크기가 변경될 때마다 설정 변경
    window.addEventListener('resize', handleResize);

    // 클린업: 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [diaryCount, membershipDays]);

  return (
    <div className="flex justify-center">
      <div className="rounded-[2rem] w-[90rem] h-[32.4rem] sm:w-[38rem] sm:h-[29.735rem]">
        <div className="flex flex-row justify-between">
          {badgesState.slice(0, sliceIndex).map((badge, index) => (
            <div key={index} className="relative w-[20.8rem] h-[32.4rem] sm:w-[15.47rem] sm:h-[23.035rem]">
              <Image
                src={badge.content}
                alt={badge.isObtained ? 'Obtained Badge' : 'Unobtained Badge'}
                fill
                style={{ objectFit: 'contain' }}
                className="rounded-[1.6rem]"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BadgeCollection;
