import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/supabase/client';

export async function POST(request: NextRequest) {
  const {
    cover_title,
    cover_title_position,
    cover_title_fontsize,
    cover_title_width,
    cover_image,
    cover_image_position,
    cover_image_size,
    cover_bg_color,
    cover_scale,
    cover_stage_size,
    cover_title_rotation,
    cover_image_rotation
  } = await request.json();

  const { data, error } = await supabase
    .from('diary_covers')
    .insert([
      {
        cover_title,
        cover_title_position: JSON.stringify(cover_title_position),
        cover_title_fontsize,
        cover_title_width,
        cover_image,
        cover_image_position: JSON.stringify(cover_image_position),
        cover_image_size: JSON.stringify(cover_image_size),
        cover_bg_color,
        cover_scale,
        cover_stage_size: JSON.stringify(cover_stage_size),
        cover_title_rotation,
        cover_image_rotation
      }
    ])
    .select();

  return NextResponse.json({ data, error });
}
