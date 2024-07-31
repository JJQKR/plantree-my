import React, { useState } from 'react';
import Image from 'next/image';

const BadgeCards: React.FC = () => {
  // 4개 하드 코딩,
  // 획득한 배지가 없을 때, 획득한 총 배지가 4개 이상일 때 어떻게 보여줄지 고민!
  return (
    <div className="flex flex-row justify-between">
      <div className="m-4">
        <Image src="/images/leaf.png" alt="badge_example" width="100" height="190" />
      </div>
      <div className="m-4">
        <Image src="/images/leaf.png" alt="badge_example" width="100" height="190" />
      </div>
      <div className="m-4">
        <Image src="/images/leaf.png" alt="badge_example" width="100" height="190" />
      </div>
      <div className="m-4">
        <Image src="/images/leaf.png" alt="badge_example" width="100" height="190" />
      </div>
    </div>
  );
};

export default BadgeCards;
