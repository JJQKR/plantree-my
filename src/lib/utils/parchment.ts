export type ParchmentType = {
  id: number;
  parchmentStyle: string;
  url: string;
};

export const parchments = [
  { id: 1, parchmentStyle: 'tenMinPlanner', url: '/images/tenMinPlanner.png' },
  { id: 2, parchmentStyle: 'lineNote', url: '/images/lineNote.png' },
  { id: 3, parchmentStyle: 'BlankNote', url: '/images/blankNote.png' }
];
