import React from 'react';
import Image from 'next/image';

const LandingAboutUS = () => {
  return (
    <div className="bg-custom-green w-full h-[45.125rem] flex items-center justify-center">
      <div className="w-[73rem] flex flex-col items-center justify-center">
        <div className="mb-[3.5rem] mt-[10rem]">
          <p className="font-normal w-[11.6875rem] h-[3.25rem] bg-green-800 text-2xl text-center text-white rounded-full pt-3">
            About Us
          </p>
        </div>

        <div className="w-full flex flex-row items-center mb-8 gap-[1.5rem]">
          <div className="w-[23.75rem] h-[38rem] flex flex-col items-center">
            <Image
              src="/images/sparta.png"
              alt="Sparta"
              width={23.75 * 10}
              height={23.75 * 10}
              className="image-size"
              style={{ width: '23.75rem', height: '23.75rem' }}
            />
            <div className="font-normal flex flex-col items-center mt-4 text-xl">
              <p>플랜트리는</p>
              <p>스파르타코딩클럽 내일배움캠프</p>
              <p>React 트랙 5기의 최종 프로젝트 입니다.</p>
            </div>
          </div>
          <div className="w-[23.75rem] h-[38rem] flex flex-col items-center">
            <Image
              src="/images/aboutus2.png"
              alt="About Us"
              width={23.75 * 10}
              height={23.75 * 10}
              className="image-size"
              style={{ width: '23.75rem', height: '23.75rem' }}
            />
            <div className="font-normal flex flex-col items-center mt-4 text-xl">
              <p>개발자 5명과 디자이너 1명</p>
              <p>두 분의 메인 튜터님이</p>
              <p>프로젝트에 도움을 주셨습니다.</p>
            </div>
          </div>
          <div className="w-[23.75rem] h-[38rem] flex flex-col items-center">
            <Image
              src="/images/aboutus3.png"
              alt="About Us"
              width={23.75 * 10}
              height={23.75 * 10}
              className="image-size"
              style={{ width: '23.75rem', height: '23.75rem' }}
            />
            <div className="font-normal flex flex-col items-center mt-4 text-xl">
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
