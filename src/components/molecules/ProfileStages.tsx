import React from 'react';
import Image from 'next/image';

const profileStages = [
  {
    id: 'lv1',
    src: '/images/Abstract0.png',
    name: '씨앗'
  },
  {
    id: 'lv2',
    src: '/images/Abstract1.png',
    name: '새싹'
  },
  {
    id: 'lv3',
    src: '/images/Abstract2.png',
    name: '풀'
  },
  {
    id: 'lv4',
    src: '/images/Abstract3.png',
    name: '묘목'
  },
  {
    id: 'lv5',
    src: '/images/Abstract4.png',
    name: '나무'
  },
  {
    id: 'lv6',
    src: '/images/Abstract5.png',
    name: '열매'
  }
];

interface ProfileStagesProps {
  levelId: string;
  size?: number;
}

const ProfileStages: React.FC<ProfileStagesProps> = ({ levelId, size = 120 }) => {
  const profileStage = profileStages.find((stage) => stage.id === levelId);

  // if (!profileStage) {
  //   return <div style={{ width: size, height: size }} className="bg-gray-200 rounded-full mb-2"></div>;
  // }

  return profileStage ? (
    <Image src={profileStage.src} alt="profile" width={size} height={size} className="rounded-full mb-2" />
  ) : (
    <div style={{ width: size, height: size }} className="bg-white rounded-full mb-2"></div>
  );
};

export default ProfileStages;
