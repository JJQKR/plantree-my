import React, { PropsWithChildren } from 'react';

const Garden = ({ children }: PropsWithChildren) => {
  return <div className="bg-[#1edaaa] w-[600px] h-[300px]">{children}</div>;
};

export default Garden;
