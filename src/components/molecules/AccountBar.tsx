import useUserStore from '@/stores/user.store';
import React from 'react';

const AccountBar = () => {
  const { email } = useUserStore((state) => state);
  return (
    <>
      <div>
        <h3>계정 및 데이터 관리</h3>
        <p>@{email}</p>
      </div>
    </>
  );
};

export default AccountBar;
