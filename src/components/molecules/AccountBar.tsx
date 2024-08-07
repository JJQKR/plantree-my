import useUserStore from '@/stores/user.store';
import React from 'react';

const AccountBar = () => {
  const { email } = useUserStore((state) => state);
  return (
    <>
      <div className="flex items-center justify-between mt-3 pl-3 p-2 bg-white rounded-[10px] shadow-md w-[600px] h-[50px]">
        <h3>계정 설정</h3>
        <p className="mr-5">{email}</p>
      </div>
    </>
  );
};

export default AccountBar;
