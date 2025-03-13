import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/supabase/client';

export async function POST(request: NextRequest) {
  const {} = await request.json();

  const { data, error } = await supabase.from('diaries').insert([{}]).select();

  return NextResponse.json({ data, error });
}
