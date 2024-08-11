import { NoteLine } from '@/components/molecules/parchment/LineNote';

// NoteLine 객체의 배열인지 검사하는 util
export function isNoteLineArray(data: any): data is NoteLine[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item) => typeof item.text === 'string' && typeof item.fontSize === 'number' && typeof item.textColor === 'string'
    )
  );
}
