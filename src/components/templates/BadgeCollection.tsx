import React, { PropsWithChildren } from 'react';

const BadgeCollection = ({ children }: PropsWithChildren) => {
  return (
    <>
      {/* <div className="flex flex-row justify-between">
      <div className="m-4">
        <Image src="/images/leaf.png" alt="badge_example" width="100" height="190" />
      </div>
      <div className="m-4">
        <Image src="/images/leaf.png" alt="badge_example" width="100" height="190" />
      </div>
      <div className="m-4">
        <Image src="/images/leaf.png" alt="badge_example" width="100" height="190" />
      </div>
      <div className="m-4">
        <Image src="/images/leaf.png" alt="badge_example" width="100" height="190" />
      </div>
    </div> */}

      <div className="bg-white rounded-[10px] shadow-md w-[600px] h-[200px]">{children}</div>
    </>
  );
};

export default BadgeCollection;
