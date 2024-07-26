import Link from 'next/link';
import React from 'react';

const LandingMain = () => {
  return (
    <main className="bg-green-900 text-white h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">환영합니다!</h1>
        <p className="text-lg mb-6">밑에 버튼을 눌러보세용</p>
        <Link href="/member" className="bg-white text-black px-6 py-3 rounded-lg">
          다이어리 만들어보기!
        </Link>
      </div>
    </main>
  );
};

export default LandingMain;
