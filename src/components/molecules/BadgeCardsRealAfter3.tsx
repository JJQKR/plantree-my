import React, { useMemo } from 'react';
import useUserStore from '@/stores/user.store';
import { totalBadges } from '../atoms/TotalBadges';

// 가장 좋은 방법은 각 badgeCondition이 어떤 인자를 필요로 하는지 명확히 하는 것입니다.
// 예를 들어, 각 badgeCondition에 conditionType을 추가하여
//  그 값에 따라 diaryCount나 membershipDays를 전달하도록 코드를 작성할 수 있습니다.
//  => 하지만 확장성이 1에 수렴하는 상태임을 잊지 마세요
// 이 코드도 과정이야..

const BadgeCardsRealAfter3 = () => {
  const { diaryCount, membershipDays } = useUserStore((state) => state);
  const badgeConditions = [
    {
      idPart: '다이어리수집가',
      conditionType: 'diaryCount',
      condition: (diaryCount: number | null) => diaryCount !== null && diaryCount >= 3
    },
    {
      idPart: '문구점사장님',
      conditionType: 'diaryCount',
      condition: (diaryCount: number | null) => diaryCount !== null && diaryCount >= 15
    },
    {
      idPart: '안녕하세요',
      conditionType: 'membershipDays',
      condition: (membershipDays: number | null) => membershipDays !== null && membershipDays >= 1
    },
    {
      idPart: '빨리친해지길바라',
      conditionType: 'membershipDays',
      condition: (membershipDays: number | null) => membershipDays !== null && membershipDays >= 7
    },
    {
      idPart: '찐친',
      conditionType: 'membershipDays',
      condition: (membershipDays: number | null) => membershipDays !== null && membershipDays >= 30
    }
  ];

  const badgesState = useMemo(() => {
    return totalBadges.map((badgeGroup) => {
      const badge = { ...badgeGroup[1] };
      const matchingCondition = badgeConditions.find((cond) => badge.id.includes(cond.idPart));

      const isObtained = matchingCondition
        ? matchingCondition.condition(matchingCondition.conditionType === 'diaryCount' ? diaryCount : membershipDays)
        : false;

      badge.isObtained = isObtained;
      badge.content = isObtained ? badge.content.replace('false', 'true') : badge.content.replace('true', 'false');

      return badge;
    });
  }, [diaryCount, membershipDays]);

  return <div>BadgeCardsRealAfter3</div>;
};

export default BadgeCardsRealAfter3;
