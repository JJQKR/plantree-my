import React, { useState } from 'react';
import Image from 'next/image';
import { totalBadges } from '../atoms/TotalBadges';
import useMyModalStore from '@/stores/my.modal.store';

const BadgeModal: React.FC = () => {
  const { isBadgeModalOpen, toggleBadgeModal } = useMyModalStore((state) => state);

  // 각 그룹의 배지 상태를 관리하기 위한 useState
  const [badgesState, setBadgesState] = useState(totalBadges.map((group) => group[0]));

  const handleBackGroundClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      toggleBadgeModal();
    }
  };

  // 특정 그룹의 배지 상태를 토글하는 함수
  const toggleBadgeObtained = (groupIndex: number) => {
    setBadgesState((prevBadges) =>
      prevBadges.map((badge, index) => (index === groupIndex ? { ...badge, isObtained: !badge.isObtained } : badge))
    );
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={handleBackGroundClick}
      >
        <div className="bg-white p-4 rounded-[10px] w-[500px] h-[500px]">
          <div onClick={(e) => e.stopPropagation()} className="h-full overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">도전과제 확인 1/9</h2>
            <div className="grid grid-cols-3 gap-2">
              {badgesState.map((badge, index) => (
                <div key={index} onClick={() => toggleBadgeObtained(index)}>
                  <Image
                    className="m-5"
                    src={badge.isObtained ? badge.content : badge.content.replace('true', 'false')}
                    alt={badge.isObtained ? 'Obtained Badge' : 'Unobtained Badge'}
                    width={100}
                    height={150}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BadgeModal;
