export type { IncidentEvent, IncidentEventKind, JournalState, Severity } from './types.js';
export { mergeEventLogs } from './crdt.js';
export { LocalIncidentJournal } from './journal.js';
export { generatePostmortem } from './postmortem.js';

export const health = () => ({ status: 'ok' as const });
