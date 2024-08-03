import React, { PropsWithChildren, ReactNode } from 'react';

interface BadgeCollectionProps extends PropsWithChildren {}

const BadgeCollection: React.FC<BadgeCollectionProps> = ({ children }) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <div className="bg-white rounded-[10px] shadow-md w-[600px] h-[200px]">
      <div className="flex flex-row justify-between">{childrenArray.slice(0, 4)}</div>
    </div>
  );
};

export default BadgeCollection;
