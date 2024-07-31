'use client';

import React, { useEffect, useState } from 'react';
import LineNote from '@/components/molecules/parchment/LineNote';
import { supabase } from '@/supabase/client';

const Page = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
        error
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Error fetching session:', error);
      } else {
        setUserId(session?.user?.id || null);
      }
    };

    getUser();
  });

  if (!userId) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <LineNote userId={userId} />
    </div>
  );
};

export default Page;
