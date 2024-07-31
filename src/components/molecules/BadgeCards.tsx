import React, { useState } from 'react';
import Image from 'next/image';

const BadgeCards: React.FC = () => {
  return (
    <div className="flex flex-row">
      <div className="m-3 bg-red-300 w-[90px] h-[170px]">
        <Image src="/images/leaf.png" alt="badge_example" width="600" height="300" />
      </div>
      <div className="m-3 bg-red-300 w-[90px] h-[170px]">
        <Image src="/images/leaf.png" alt="badge_example" width="600" height="300" />
      </div>
    </div>
  );
};

export default BadgeCards;
