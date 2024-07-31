import React from 'react';
import Image from 'next/image';

const profileStages = [
  {
    id: 'lv1',
    content: (
      <Image src="/images/Abstract0.png" alt="badge_example" width={120} height={120} className=" rounded-full mb-2" />
    ),
    name: '씨앗'
  },
  {
    id: 'lv2',
    content: (
      <Image src="/images/Abstract1.png" alt="badge_example" width={120} height={120} className=" rounded-full mb-2" />
    ),
    name: '새싹'
  },
  {
    id: 'lv3',
    content: (
      <Image src="/images/Abstract2.png" alt="badge_example" width={120} height={120} className=" rounded-full mb-2" />
    ),
    name: '풀'
  },
  {
    id: 'lv4',
    content: (
      <Image src="/images/Abstract3.png" alt="badge_example" width={120} height={120} className="rounded-full mb-2" />
    ),
    name: '묘목'
  },
  {
    id: 'lv5',
    content: (
      <Image src="/images/Abstract4.png" alt="badge_example" width={120} height={120} className="rounded-full mb-2" />
    ),
    name: '나무'
  },
  {
    id: 'lv6',
    content: (
      <Image src="/images/Abstract5.png" alt="badge_example" width={120} height={120} className="rounded-full mb-2" />
    ),
    name: '열매나무'
  }
];

const ProfileStages = ({ levelId }) => {
  const profileStage = profileStages.find((stage) => stage.id === levelId);
  return profileStage ? profileStage.content : <div className="w-[120px] h-[120px] bg-white rounded-full mb-2"></div>;
};

export default ProfileStages;
