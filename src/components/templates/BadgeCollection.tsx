import React, { PropsWithChildren } from 'react';

const BadgeCollection = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="bg-[#ddaab1] w-[700px] h-[200px]">{children}</div>
    </>
  );
};

export default BadgeCollection;
