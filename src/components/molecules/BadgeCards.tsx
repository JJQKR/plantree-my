import React, { useState } from 'react';
import BadgeCard from '../atoms/BadgeCard';

const BadgeCards: React.FC = () => {
  const [hasBadge, setHasBadge] = useState(true);
  return (
    <div className="bg-yellow-100 w-[700px] h-[150px]">
      <div>{hasBadge ? <BadgeCard /> : <div>획득한 배지가 없습니다</div>}</div>
    </div>
  );
};

export default BadgeCards;
