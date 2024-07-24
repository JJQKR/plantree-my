import React, { PropsWithChildren } from 'react';

const BadgeCollection = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="bg-[#ddaab1] w-[600px] h-[300px]">{children}</div>
    </>
  );
};

export default BadgeCollection;
