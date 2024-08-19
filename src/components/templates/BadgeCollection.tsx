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

    updateBadges();
  }, [diaryCount, membershipDays]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 767) {
        setSliceIndex(2); // sm 사이즈일 때 2개 표시
      } else {
        setSliceIndex(4); // sm이 아닐 때 4개 표시
      }
    };

    handleResize(); // 초기 실행 시 현재 화면 크기에 따라 설정

    window.addEventListener('resize', handleResize); // 화면 크기 변경 시 실행
    return () => window.removeEventListener('resize', handleResize); // 이벤트 리스너 정리
  }, []);

  return (
    <div className="flex justify-center">
      <div className="rounded-[2rem] w-[90rem] h-auto sm:w-[38rem] sm:h-auto">
        <div className="grid grid-cols-4 sm:grid-cols-2 gap-4">
          {badgesState.slice(0, sliceIndex).map((badge, index) => (
            <div key={index} className="relative w-full h-[32.4rem] sm:h-[23.035rem]">
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
