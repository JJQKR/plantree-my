import MyPageLayout from '@/components/templates/MypageLayout';
import React, { PropsWithChildren } from 'react';

const MyLayout = ({ children }: PropsWithChildren) => {
  return <MyPageLayout>{children}</MyPageLayout>;
};

export default MyLayout;
