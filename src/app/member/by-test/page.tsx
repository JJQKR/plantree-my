// import TenMinplanner from '@/components/molecules/parchment/TenMinPlanner';
import BlankNote from '@/components/molecules/parchment/BlankNote';
import React from 'react';

const page = () => {
  //테스트용 blank_note테이블 id
  // const blankId = 'a2c154e1-6da3-49ae-9bdc-1ddac61a1748';
  const blankId = '';

  return (
    <div>
      <BlankNote blankId={blankId} />
    </div>
  );
};

export default page;
