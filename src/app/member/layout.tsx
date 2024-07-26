import ClientLayout from '@/components/templates/ClientLayout';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

const MemberLayout = ({ children }: Props) => {
  return (
    <div className="flex">
      <ClientLayout>{children}</ClientLayout>
    </div>
  );
};

export default MemberLayout;
