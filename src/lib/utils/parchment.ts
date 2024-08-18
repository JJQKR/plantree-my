export type ParchmentType = {
  id: number;
  parchmentStyle: string;
  url: string;
  name: string;
};

export const parchments = [
  { id: 1, parchmentStyle: 'tenMinPlanner', url: '/images/tenMinPlannerImage.png', name: '10분 플래너' },
  { id: 2, parchmentStyle: 'lineNote', url: '/images/lineNoteImage.png', name: '줄글 속지' },
  { id: 3, parchmentStyle: 'blankNote', url: '/images/blankNoteImage.png', name: '무지 속지' }
];
