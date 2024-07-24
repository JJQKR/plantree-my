import Image from 'next/image';
import React from 'react';
import badge_example from '../../public/images/badge_example.jpg';

const BadgeCard = () => {
  return (
    <>
      <Image src="/images/badge_example.jpg" alt="badge_example" width={100} height={100} />
    </>
  );
};

export default BadgeCard;
