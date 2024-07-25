'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ResetPasswordModal from '@/components/molecules/ResetPasswordModal';

const ResetPasswordPage: React.FC = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    setToken(token);
    setLoading(false);
  }, []);

  const handleClose = () => {
    router.push('/');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return <div>{token ? <ResetPasswordModal token={token} onClose={handleClose} /> : <div>Invalid token</div>}</div>;
};

export default ResetPasswordPage;
