import React, { PropsWithChildren } from 'react';

const BadgeCollection = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="bg-[#ddaab1] w-[200px] h-[100px]">{children}</div>
    </>
  );
};

export default BadgeCollection;
