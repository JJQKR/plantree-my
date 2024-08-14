import React from 'react';
import Image from 'next/image';

const LandingAboutUS = () => {
  return (
    <div className="bg-custom-green w-full h-[600px] flex items-center justify-center">
      <div className="w-[1200px] flex flex-col items-center justify-center">
        <div className="mb-8">
          <p className="w-[200px] h-[50px] bg-green-800 text-5xl text-center text-white rounded-full pt-3 font-black">
            About Us
          </p>
        </div>

        <div className="w-full flex flex-row items-center gap-4 mb-8">
          <div className="w-[500px] h-[380px] flex flex-col items-center">
            <Image src="/images/sparta.png" alt="Sparta" width={380} height={380} className="image-size" />
            <div className="font-bold flex flex-col items-center mt-4 text-3xl">
              <p>플랜트리는</p>
              <p>스파르타코딩클럽 내일배움캠프</p>
              <p>React 트랙 5기의 최종 프로젝트 입니다.</p>
            </div>
          </div>
          <div className="w-[500px] h-[380px] flex flex-col items-center">
            <Image src="/images/aboutus2.png" alt="Sparta" width={380} height={380} className="image-size" />
            <div className="font-bold flex flex-col items-center mt-4 text-3xl">
              <p>개발자 5명과 디자이너 1명</p>
              <p>두 분의 메인 튜터님이</p>
              <p>프로젝트에 도움을 주셨습니다.</p>
            </div>
          </div>
          <div className="w-[500px] h-[380px] flex flex-col items-center">
            <Image src="/images/aboutus3.png" alt="Sparta" width={380} height={380} className="image-size" />
            <div className="font-bold flex flex-col items-center mt-4 text-3xl">
              <p>서비스를 보시고</p>
              <p>저희를 채용하고 싶으시다면?</p>
              <p>푸터를 참고해주세요.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingAboutUS;
