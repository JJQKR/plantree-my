'use client';

import QueryProvider from '@/providers/query.provider';
import { PropsWithChildren } from 'react';

function ProviderLayout({ children }: PropsWithChildren) {
  return <QueryProvider>{children}</QueryProvider>;
}

export default ProviderLayout;
