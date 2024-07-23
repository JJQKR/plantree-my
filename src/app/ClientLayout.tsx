'use client';

import React, { useState } from 'react';
import { useStore } from '@/stores/sidebar.store';
import Header from '@/components/molecules/Header';
import Sidebar from '@/components/molecules/Sidebar';

// Next.js에서는 use client 지시어가 있는 컴포넌트에서 metadata를 내보내는 것이 허용되지 않습니다.
// 이 문제를 해결하기 위해서는 layout.tsx 파일을 클라이언트 컴포넌트와 서버 컴포넌트로 분리
// 클라이언트 컴포넌트로 분리한게 이 ClientLayout.tsx

const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sidebarOpen, toggleSidebar } = useStore();
  const [isSorted, setIsSorted] = useState(false);

  const handleSort = () => {
    setIsSorted(!isSorted);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header toggleSidebar={toggleSidebar} handleSort={handleSort} />
      <div className="flex flex-grow">
        {sidebarOpen && <Sidebar onClose={toggleSidebar} />}
        <main className={`flex-grow transition-all duration-300 ${sidebarOpen ? 'ml-0' : ''}`}>
          {React.cloneElement(children as React.ReactElement<any>, { handleSort, isSorted })}
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;
