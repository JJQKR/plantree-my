'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DiAptana } from 'react-icons/di';
import useUserStore from '@/stores/user.store';
import AttendanceCheck from '@/lib/utils/AttendanceCheck';
import FetchUserData from '@/lib/utils/FetchUserData';
import ProfileStages from './ProfileStages';
import { supabase } from '@/supabase/client';
import { DiaryCover, MainSidebarProps } from '@/types/main';
import Image from 'next/image';

const Sidebar: React.FC<MainSidebarProps> = ({ onClose }) => {
  const [nickname, levelName, attendance, userId] = useUserStore((state) => state);
  const [diaryCovers, setDiaryCovers] = useState<DiaryCover[]>([]);
  const [levelId, setLevelId] = useState<string | null>(null);

  //컴포넌트 마운트 시 유저 정보 및 다이어리 커버 가져오는 useEffect

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('id, level_id')
          .eq('id', userId)
          .single();

        if (userError) {
          console.error('레벨 ID가져오기 실패:', userError);
        } else {
          setLevelId(user.level_id);

          const { data: coversData, error: coversError } = await supabase
            .from('diary_covers')
            .select('*')
            .eq('user_id', user.id);

          if (coversError) {
            console.error('다이어리 커버 정보 가져오기 실패:', coversError);
          } else {
            setDiaryCovers(coversData);
          }
        }
      }
    };

    fetchData();
  }, [userId]);

  return (
    <>
      <div>
        <FetchUserData />
        <AttendanceCheck />
        <div>
          <button onClick={onClose}> Close </button>
        </div>
      </div>
    </>
  );
};
