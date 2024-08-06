import MyPageLayout from '@/components/templates/MypageLayout';
import React, { PropsWithChildren } from 'react';

const MyCoverLayout = ({ children }: PropsWithChildren) => {
  return <MyPageLayout>{children}</MyPageLayout>;
};

export default MyCoverLayout;
