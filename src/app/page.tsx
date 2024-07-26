import LandingFooter from '@/components/molecules/LandingFooter';
import LandingHeader from '@/components/molecules/LandingHeader';
import LandingMain from '@/components/molecules/LandingMain';
import React from 'react';

const page = () => {
  return (
    <div>
      <LandingHeader />
      <LandingMain />
      <LandingFooter />
    </div>
  );
};

export default page;
