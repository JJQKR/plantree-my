import React from 'react';
import fetchNickname from '@/lib/utils/fetchNickname';
import useNickname from '@/lib/utils/fetchNickname';

const GrowthSummary = () => {
  const nicknameRef = useNickname();
  return (
    <div>
      씨앗 {nicknameRef}님의 정원.
      <p>플랜트리와 함께 100일째,</p>
      <p>열심히 나무를 키우고 계시네요!</p>
    </div>
  );
};

export default GrowthSummary;
