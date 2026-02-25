import { mergeEventLogs } from './crdt.js';
import type { IncidentEvent, JournalState, Severity } from './types.js';

export class LocalIncidentJournal {
  private readonly incidentId: string;
  private readonly title: string;
  private readonly severity: Severity;
  private readonly events: IncidentEvent[] = [];

  constructor(incidentId: string, title: string, severity: Severity = 'sev2') {
    this.incidentId = incidentId;
    this.title = title;
    this.severity = severity;
  }

  append(event: IncidentEvent): void {
    if (event.incidentId !== this.incidentId) {
      throw new Error('incidentId mismatch');
    }
    this.events.push(event);
  }

  merge(remoteEvents: IncidentEvent[]): void {
    const merged = mergeEventLogs(this.events, remoteEvents);
    this.events.length = 0;
    this.events.push(...merged);
  }

  getState(): JournalState {
    const participants = [...new Set(this.events.map((e) => e.author))].sort();
    return {
      incidentId: this.incidentId,
      title: this.title,
      severity: this.severity,
      timeline: [...this.events],
      participants
    };
  }
}
