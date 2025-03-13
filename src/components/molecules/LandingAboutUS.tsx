import React from 'react';
import Image from 'next/image';

const LandingAboutUS = () => {
  return (
    <div className="bg-custom-green w-full h-[43.625rem] sm:h-[32.4375rem] flex items-center justify-center py-16 sm:py-8">
      <div className="w-[73rem] flex flex-col items-center justify-center">
        <div className="mb-[3.5rem] mt-[10rem] sm:mt-0">
          <div className="w-[21.7rem] h-[3.5rem] pt-3 pb-3 rounded-2xl bg-green-800 text-white text-[1.5rem] font-bold flex items-center sm:flex sm:items-center">
            <p className="w-fit mx-auto">플랜트리 팀을 소개합니다✋🏻</p>
          </div>
        </div>

        <div className="w-full flex flex-row items-center mb-8 gap-[1.5rem] font-bold sm:mb-[5rem] sm:flex-row sm:items-center sm:justify-center">
          <div className="w-[23.75rem] h-[38rem] flex flex-col items-center sm:w-[11.2rem] sm:h-[11.2rem] sm:items-center">
            <Image
              src="/images/랜딩페이지_Carrousel 1.png"
              alt="Sparta"
              width={237.5}
              height={237.5}
              className="image-size"
              style={{ width: '23.75rem', height: '23.75rem' }}
              sizes="(max-width: 640px) 15.2rem, 23.75rem"
            />
            <div className="flex flex-col items-center mt-4 text-xl sm:text-base text-left">
              플랜트리는 스파르타코딩클럽 React 트랙 5기의 최종 프로젝트 입니다.
            </div>
          </div>
          <div className="w-[23.75rem] h-[38rem] flex flex-col items-center sm:w-[11.2rem] sm:h-[11.2rem] sm:items-center">
            <Image
              src="/images/랜딩페이지_Carrousel_2.png"
              alt="About Us"
              width={237.5}
              height={237.5}
              className="image-size"
              style={{ width: '23.75rem', height: '23.75rem' }}
              sizes="(max-width: 640px) 15.2rem, 23.75rem"
            />
            <div className="flex flex-col items-center mt-4 text-xl sm:text-base text-left">
              개발자 5명과 디자이너 1명 두 분의 메인 튜터님이 프로젝트에 도움을 주셨습니다.
            </div>
          </div>
          <div className="w-[23.75rem] h-[38rem] flex flex-col items-center sm:w-[11.2rem] sm:h-[11.2rem] sm:items-center">
            <Image
              src="/images/랜딩페이지_Carrousel_3.png"
              alt="About Us"
              width={237.5}
              height={237.5}
              className="image-size"
              style={{ width: '23.75rem', height: '23.75rem' }}
              sizes="(max-width: 640px) 15.2rem, 23.75rem"
            />
            <div className="flex flex-col items-center mt-4 text-xl sm:text-base">
              서비스를 보시고 저희를 채용하고 싶으시다면? 푸터를 참고해주세요.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingAboutUS;
