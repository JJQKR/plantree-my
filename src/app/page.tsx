import LandingFooter from '@/components/molecules/LandingFooter';
import LandingHeader from '@/components/molecules/LandingHeader';
import LandingMain from '@/components/molecules/LandingMain';
import React from 'react';

const page = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="flex flex-col items-center flex-grow">
        <LandingHeader />
        <LandingMain />
        <LandingFooter />
      </div>
    </div>
  );
};

export default page;
