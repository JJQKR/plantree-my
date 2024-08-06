import MyPageLayout from '@/components/templates/MypageLayout';
import React, { PropsWithChildren } from 'react';

const MyParchmentLayout = ({ children }: PropsWithChildren) => {
  return <MyPageLayout>{children}</MyPageLayout>;
};

export default MyParchmentLayout;
