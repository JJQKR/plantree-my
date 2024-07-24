import React, { PropsWithChildren } from 'react';

const Garden = ({ children }: PropsWithChildren) => {
  return <div className="bg-[#1edaaa] w-[300px] h-[100px]">{children}</div>;
};

export default Garden;
