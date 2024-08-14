export type ParchmentType = {
  id: number;
  parchmentStyle: string;
  url: string;
};

export const parchments = [
  { id: 1, parchmentStyle: 'tenMinPlanner', url: '/images/tenMinPlannerImage.png' },
  { id: 2, parchmentStyle: 'lineNote', url: '/images/lineNoteImage.png' },
  { id: 3, parchmentStyle: 'blankNote', url: '/images/blankNoteImage.png' }
];
