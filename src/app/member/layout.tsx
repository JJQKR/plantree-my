import ClientLayout from '@/components/templates/ClientLayout';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

const MemberLayout = ({ children }: Props) => {
  return (
    <div>
      <ClientLayout>{children}</ClientLayout>
    </div>
  );
};

export default MemberLayout;
