import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

const LandingMain = () => {
  return (
    <main className="w-[80rem] bg-white text-black flex flex-col flex-grow items-center justify-center p-6">
      <div className="w-full relative mb-12 image-container">
        <Image
          src="/images/main2.jpg"
          alt="Main Image"
          layout="responsive"
          width={1600}
          height={900}
          className="rounded-2xl"
        />
        <div className="overlay"></div>
      </div>
      <div className="text-center mb-12">
        <p className="text-4xl font-bold mb-4">소중한 우리의 일상을</p>
        <p className="text-4xl font-bold mb-4 text-lime-500">
          자유롭게<span className="text-black">,</span> 재미있게<span className="text-black">,</span> 언제 어디든지
        </p>
        <p className="text-4xl mb-8">기록하는 새로운 방법</p>
        <p className="text-5xl font-bold mb-4">
          <span className="text-lime-400">Plantree</span> 에 오신것을 환영합니다!
        </p>
        {/* <Link href="/member/hub" className="bg-white text-black px-6 py-3 rounded-lg">
        다이어리 만들어보기!
      </Link> */}
      </div>

      <section className="w-full max-w-4xl mx-auto"></section>
    </main>
  );
};

export default LandingMain;
