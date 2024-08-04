import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/supabase/client';

export async function GET(request: NextRequest, { params }: { params: { diaryId: string } }) {
  const { diaryId } = params;

  const { data, error } = await supabase.from('diaries').select('*').eq('id', diaryId).single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: NextRequest, { params }: { params: { diaryId: string } }) {
  const { diaryId } = params;
  const parchmentData = await request.json();

  const { data, error } = await supabase.from('diaries').update(parchmentData).eq('id', diaryId).single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest, { params }: { params: { diaryId: string } }) {
  const { diaryId } = params;

  const { data, error } = await supabase.from('diaries').delete().eq('id', diaryId).single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: '다이어리 삭제완료' });
}
