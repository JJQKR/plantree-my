'use client';

import { supabase } from '@/supabase/client';
import { useSearchParams, useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import TenMinPlanner from '../molecules/parchment/TenMinPlanner';
import LineNote from '../molecules/parchment/LineNote';
import BlankNote from '../molecules/parchment/BlankNote';

const styleDbNames = {
  tenMinPlanner: 'ten_min_planner',
  lineNote: 'line_note',
  blankNote: 'blank_note'
};

// url에서 content_id(id) & style을 가져온다
// style을 보고 db를 정한 후 id를 이용하여 속지 데이터를 가져온다
// 컴포넌트에 데이터를 넣어준다
const EditParchment = () => {
  const searchParams = useSearchParams();
  const style = searchParams.get('style');
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      {style === 'tenMinPlanner' ? (
        <TenMinPlanner id={id} />
      ) : style === 'lineNote' ? (
        <LineNote id={id} />
      ) : style === 'blankNote' ? (
        <BlankNote id={id} />
      ) : null}
    </div>
  );
};

export default EditParchment;
