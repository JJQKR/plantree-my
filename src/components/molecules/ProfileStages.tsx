import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import useUserStore from '@/stores/user.store';

const profileStages = [
  { id: 'lv1', src: '/images/profileImage1.png', name: '씨앗' },
  { id: 'lv2', src: '/images/profileImage2.png', name: '새싹' },
  { id: 'lv3', src: '/images/profileImage3.png', name: '풀' },
  { id: 'lv4', src: '/images/profileImage4.png', name: '묘목' },
  { id: 'lv5', src: '/images/profileImage5.png', name: '나무' },
  { id: 'lv6', src: '/images/profileImage6.png', name: '열매' }
];

interface ProfileStagesProps {
  size?: number;
}

const ProfileStages: React.FC<ProfileStagesProps> = ({ size = 120 }) => {
  const updatedLevelId = useUserStore((state) => state.updatedLevelId);

  const profileStage = profileStages.find((stage) => stage.id === updatedLevelId);

  if (!profileStage) {
    return <div style={{ width: size, height: size }} className="bg-gray-200 rounded-full mb-2"></div>;
  }

  return (
    <Image src={profileStage.src} alt={profileStage.name} width={size} height={size} className="rounded-full mb-2" />
  );
};

export default ProfileStages;
