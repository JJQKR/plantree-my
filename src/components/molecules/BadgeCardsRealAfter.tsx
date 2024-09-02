'use client';

import useUserStore from '@/stores/user.store';
import { useMemo } from 'react';
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
  {
    idPart: '안녕하세요',
    condition: (membershipDays: number | null) => membershipDays !== null && membershipDays >= 30
  }
];

const BadgeCardsRealAfter: React.FC = () => {
  const { diaryCount, membershipDays } = useUserStore((state) => state);

  const badgesState = useMemo(() => {
    return totalBadges.map((badgeGroup) => {
      const badge = { ...badgeGroup[1] }; //무조건 false인 애
      const matchingCondition = badgeConditions.find((cond) => badge.id.includes(cond.idPart));
      //여기는 직접 문자열을 입력하는 게 아니라 cond.idPart로 리팩토링 완료!
      const isObtained = matchingCondition //id 일치하는 애를 찾고 걔의 획득 여부 true, false를 보자는 건데
        ? //이거 좀 이상하지 않나?
          matchingCondition.condition(badge.id.includes(matchingCondition.idPart) ? diaryCount : membershipDays)
        : false;
      //근데 지금 보니까 이 로직에도 문제가 있네
      //기준이 되는 데이터가 diaryCount나 membershipDays외에 더 추가가 되면 어쩔 건데?
      //또 손으로 일일이 적을 겁니까, 휴먼?

      badge.isObtained = isObtained;
      badge.content = isObtained ? badge.content.replace('false', 'true') : badge.content.replace('true', 'false');
      return badge;
    });
  }, [diaryCount, membershipDays]);
  //그럼 여기 의존성 배열의 내용도 하나로 통합해서 따로 관리해야 되겠다

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

export default BadgeCardsRealAfter;
