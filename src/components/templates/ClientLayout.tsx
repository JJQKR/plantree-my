'use client';

import React from 'react';
import { useStore } from '@/stores/sidebar.store';
import Header from '@/components/molecules/Header';
import Sidebar from '@/components/molecules/Sidebar';
import { usePathname } from 'next/navigation';

// Next.js에서는 use client 지시어가 있는 컴포넌트에서 metadata를 내보내는 것이 허용되지 않습니다.
// 이 문제를 해결하기 위해서는 layout.tsx 파일을 클라이언트 컴포넌트와 서버 컴포넌트로 분리
// 클라이언트 컴포넌트로 분리한게 이 ClientLayout.tsx

const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sidebarOpen, toggleSidebar, toggleGrid } = useStore(); // 상태와 상태 변경 함수 가져오기

  if (usePathname() !== '/landing') {
    return (
      <div className="flex flex-col min-h-screen">
        <Header toggleSidebar={toggleSidebar} toggleGrid={toggleGrid} />
        <div className="flex flex-grow">
          {sidebarOpen && <Sidebar onClose={toggleSidebar} />}
          <main
            className={`bg-gray-400 ${
              sidebarOpen ? 'w-[764px]' : 'w-full'
            } h-[930px] flex items-center justify-center transition-all duration-300`}
          >
            {children}
          </main>
        </div>
      </div>
    );
  } else {
    return <>{children}</>;
  }
};

export default ClientLayout;
