import React from 'react';
import Image from 'next/image';

const LandingAboutUS = () => {
  return (
    <div className="bg-custom-green w-full h-[722px] flex items-center justify-center">
      <div className="w-[960px] flex items-center justify-center gap-1">
        <div className="w-[380px] h-[380px] flex items-center justify-center">
          <Image src="/images/sparta.png" alt="Sparta" width={380} height={380} objectFit="cover" />
        </div>
        <div className="w-[380px] h-[380px]"></div>
        <div className="w-[380px] h-[380px] "></div>
      </div>
    </div>
  );
};

export default LandingAboutUS;
