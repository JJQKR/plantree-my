import Link from 'next/link';
import React from 'react';

const LandingMain = () => {
  return (
    <main className="bg-green-900 text-white h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">환영합니다!</h1>
        <p className="text-xl mb-6">함께 다이어리를 만들어봐요!</p>
        <Link href="/member/hub" className="bg-white text-black px-6 py-3 rounded-lg">
          다이어리 만들어보기!
        </Link>
      </div>

      <section className="w-full max-w-4xl mx-auto">
        <div className="space-y-12">
          <div className="text-center bg-green-700 p-8 rounded-lg shadow-lg">
            <h3 className="text-3xl font-bold mb-4">커버 커스텀과 속지 선택</h3>
            <p className="text-lg">10분 단위로 색칠이 가능한 일정관리 다이어리로 나만의 스타일을 만드세요!</p>
          </div>
          <div className="text-center bg-green-700 p-8 rounded-lg shadow-lg">
            <h3 className="text-3xl font-bold mb-4">레벨 업과 나만의 정원</h3>
            <p className="text-lg">플랜트리를 사용할수록 레벨이 오르고 나만의 정원을 가꿀 수 있어요!</p>
          </div>
          <div className="text-center bg-green-700 p-8 rounded-lg shadow-lg">
            <h3 className="text-3xl font-bold mb-4">다꾸의 재미와 생산성 향상</h3>
            <p className="text-lg">다꾸의 재미와 생산성 향상이라는 두 마리 토끼를 잡을 수 있습니다.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingMain;
