import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/supabase/client';

export async function GET(request: NextRequest, { params }: { params: { DiaryId: string } }) {
  const { DiaryId } = params;

  const { data, error } = await supabase.from('diary_covers').select('*').eq('id', DiaryId).single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: NextRequest, { params }: { params: { DiaryId: string } }) {
  const { DiaryId } = params;
  const coverData = await request.json();

  const { data, error } = await supabase.from('diary_covers').update(coverData).eq('id', DiaryId).single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest, { params }: { params: { DiaryId: string } }) {
  const { DiaryId } = params;

  const { data, error } = await supabase.from('diary_covers').delete().eq('id', DiaryId).single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Cover삭제완료' });
}
