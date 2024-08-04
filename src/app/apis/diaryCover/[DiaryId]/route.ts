import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/supabase/client';

export async function GET(request: NextRequest, { params }: { params: { diaryId: string } }) {
  const { diaryId } = params;
  const { data, error } = await supabase.from('diary_covers').select('*').eq('diary_id', diaryId).maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: NextRequest, { params }: { params: { diaryId: string } }) {
  const { diaryId } = params;
  const coverData = await request.json();

  const { data, error } = await supabase.from('diary_covers').update(coverData).eq('diary_id', diaryId).single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest, { params }: { params: { diaryId: string } }) {
  const { diaryId } = params;

  const { data, error } = await supabase.from('diary_covers').delete().eq('id', diaryId).single();
  // const { data:ddasd, error:add } = await supabase.from('diaries').delete().eq('id', diaryId).single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Cover삭제완료' });
}
