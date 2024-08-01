import { NoteLine } from '@/components/molecules/parchment/LineNote';

export function isNoteLineArray(data: any): data is NoteLine[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item) => typeof item.text === 'string' && typeof item.fontSize === 'number' && typeof item.textColor === 'string'
    )
  );
}
