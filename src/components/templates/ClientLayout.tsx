'use client';

import React from 'react';
import { useStore } from '@/stores/sidebar.store';
import Header from '@/components/molecules/Header';
import Sidebar from '@/components/molecules/Sidebar';

// Next.js에서는 use client 지시어가 있는 컴포넌트에서 metadata를 내보내는 것이 허용되지 않습니다.
// 이 문제를 해결하기 위해서는 layout.tsx 파일을 클라이언트 컴포넌트와 서버 컴포넌트로 분리
// 클라이언트 컴포넌트로 분리한게 이 ClientLayout.tsx

const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sidebarOpen, toggleSidebar, toggleGrid } = useStore();

  return (
    <div className="flex flex-col min-h-screen relative">
      <Header toggleSidebar={toggleSidebar} toggleGrid={toggleGrid} />
      <div className="flex flex-grow">
        {sidebarOpen && <Sidebar onClose={toggleSidebar} />}
        <main
          className={`${
            sidebarOpen ? 'w-[100%]' : 'w-full'
          } h-auto flex items-center justify-center transition-all duration-300`}
        >
          {children}
        </main>
        {/* 배경 오버레이 추가 */}
        {sidebarOpen && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10"
            onClick={toggleSidebar} // 오버레이를 클릭하면 사이드바가 닫히도록 설정
          />
        )}
      </div>
    </div>
  );
};

export default ClientLayout;
