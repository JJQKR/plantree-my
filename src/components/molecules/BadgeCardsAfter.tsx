'use client';

// 개방폐쇄원칙(OCP, Open-Closed Principle)은
// "소프트웨어 엔티티(클래스, 모듈, 함수 등)는 확장에는 열려 있어야 하고, 수정에는 닫혀 있어야 한다"는 원칙입니다.
// 이 원칙을 적용하려면 코드가 새로운 기능을 추가할 때 기존 코드를 변경하지 않고도 확장 가능해야 합니다.

// 현재 코드를 개방폐쇄원칙에 맞게 리팩터링하기 위해서는 조건을 평가하는 로직을 외부로 분리하고,
// 이 로직을 쉽게 확장할 수 있도록 만들어야 합니다.
// 아래는 badgeConditions 배열을 활용하여 이 원칙을 적용한 코드입니다.

// 이건 알겠는데, 배지 획득 조건이 결국 supabaseDB에 들어가 있고
// 그걸 충족하느냐 마느냐를 판단해서 코드를 돌리고 싶다면???

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { totalBadges } from '../atoms/TotalBadges';
import useUserStore from '@/stores/user.store';

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
  {
    idPart: '안녕하세요',
    condition: (membershipDays: number | null) => membershipDays !== null && membershipDays >= 30
  }
];

const BadgeCardsAfter: React.FC = () => {
  const { diaryCount, membershipDays } = useUserStore((state) => state);

  const badgesState = useMemo(() => {
    return totalBadges.map((badgeGroup) => {
      const badge = { ...badgeGroup[1] };
      const matchingCondition = badgeConditions.find((cond) => badge.id.includes(cond.idPart));

      const isObtained = matchingCondition
        ? matchingCondition.condition(badge.id.includes(matchingCondition.idPart) ? diaryCount : membershipDays)
        : false;

      badge.isObtained = isObtained;
      badge.content = isObtained ? badge.content.replace('false', 'true') : badge.content.replace('true', 'false');

      return badge;
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

export default BadgeCardsAfter;
