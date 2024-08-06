'use client';

import React, { useEffect } from 'react';
import { useStore } from '@/stores/sidebar.store';
import DiaryCase from '@/components/templates/DiaryCase';
import Swal from 'sweetalert2';
import '@/app/globals.css'; // 전역 스타일 시트 임포트

const HomePage = () => {
  const { sidebarOpen } = useStore(); // 사이드바의 열림 상태를 가져옵니다.

  useEffect(() => {
    if (localStorage.getItem('loginSuccess') === 'true') {
      Swal.fire({
        title: '로그인 성공',
        text: 'PlanTree에 오신 것을 환영합니다!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      localStorage.removeItem('loginSuccess');
    }
  }, []);

  useEffect(() => {
    // 페이지 로드 시 body 태그에 noScroll 클래스 추가
    document.body.classList.add('noScroll');
    // 페이지 언마운트 시 body 태그에서 noScroll 클래스 제거
    return () => {
      document.body.classList.remove('noScroll');
    };
  }, []);

  return (
    <div
      className={`${
        sidebarOpen ? 'w-[1280px]' : 'w-full'
      } h-[930px] flex items-center justify-center transition-all duration-300`} // 사이드바 상태에 따라 너비 조정
    >
      <DiaryCase />
    </div>
  );
};

export default HomePage;
