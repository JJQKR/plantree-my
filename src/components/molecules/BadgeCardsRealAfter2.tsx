'use client';

import useUserStore from '@/stores/user.store';
import React, { useMemo } from 'react';
import { totalBadges } from '../atoms/TotalBadges';
import Image from 'next/image';

const badgeConditions = [
  { idPart: '다이어리수집가', condition: (diaryCount: number | null) => diaryCount !== null && diaryCount >= 3 },

  { idPart: '문구점사장님', condition: (diaryCount: number | null) => diaryCount !== null && diaryCount >= 15 },

  {
    idPart: '안녕하세요',
    condition: (membershipDays: number | null) => membershipDays !== null && membershipDays >= 1
  },
  {
    idPart: '빨리친해지길바라',
    condition: (membershipDays: number | null) => membershipDays !== null && membershipDays >= 7
  },
  { idPart: '찐친', condition: (membershipDays: number | null) => membershipDays !== null && membershipDays >= 30 }
];

const BadgeCardsRealAfter2: React.FC = () => {
  const { diaryCount, membershipDays } = useUserStore((state) => state);

  const badgesState = useMemo(() => {
    return totalBadges.map((badgeGroup) => {
      const falseBadge = { ...badgeGroup[1] };
      const matchingCondition = badgeConditions.find((cond) => badgeConditions.falseBadge.id.includes(cond.idPart));
      //객체 하나네 이거
      //그래서 그 객체 안에서 condition함수로 점표기법 접근
      const isObtained = matchingCondition
        ? matchingCondition.condition(
            matchingCondition.idPart.includes('다이어리수집가') || matchingCondition.idPart.includes('문구점사장님')
              ? diaryCount
              : membershipDays
          ) //존재하면 다음 조건 확인하는 건데 개별로 딱딱 매칭 안됨 개판이네용~~~
        : false;
      //가독성 왜이난리야..
      falseBadge.isObtained = isObtained;
      falseBadge.content = isObtained
        ? falseBadge.content.replace('false', 'true')
        : falseBadge.content.replace('true', 'false');
      return falseBadge;
    });
  }, [diaryCount, membershipDays]);

  return (
    <div className="grid grid-cols-4 sm:grid-cols-2">
      {badgesState.map((badge, index) => (
        <div
          key={index}
          className="relative w-[20.8rem] h-[32.4rem] m-[0.8rem] sm:m-[0.4rem] sm:w-[10rem] sm:h-[17.2rem] sm:mx-[0.8rem]"
        >
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
  );
};
