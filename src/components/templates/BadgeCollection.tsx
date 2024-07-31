import React, { PropsWithChildren } from 'react';

const BadgeCollection = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="bg-white rounded-[10px] shadow-md w-[600px] h-[200px]">{children}</div>
    </>
  );
};

export default BadgeCollection;
