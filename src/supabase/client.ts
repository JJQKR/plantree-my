import { Database } from './../types/supabase';

import { createClient, UserAttributes as SupabaseUserAttributes } from '@supabase/supabase-js';

export type UserAttributes = SupabaseUserAttributes & { token?: string };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and API key are required.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// 인증 문제 해결 방향

// 클라이언트 초기화 옵션 추가:

// typescriptexport const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
//   auth: {
//     autoRefreshToken: true,
//     persistSession: true,
//     storage: typeof window !== 'undefined' ? window.localStorage : undefined
//   }
// });

// 세션 리스너 설정:

// typescript// 별도의 auth.ts 파일 등에서
// supabase.auth.onAuthStateChange((event, session) => {
//   // 세션 상태 변화 처리
// });
// 이런 설정들이 추가되면 인증 관련 문제를 줄일 수 있을 것입니다. 하지만 현재 기본 설정으로도 인증 기능 자체는 작동해야 합니다.
