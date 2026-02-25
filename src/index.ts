export type IncidentEvent = {
  id: string;
  ts: number;
  author: string;
  text: string;
};

export const health = () => ({ status: 'ok' });
