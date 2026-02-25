export type Severity = 'sev0' | 'sev1' | 'sev2' | 'sev3';

export type IncidentEventKind =
  | 'detected'
  | 'impact_update'
  | 'mitigation'
  | 'root_cause_note'
  | 'recovery'
  | 'action_item';

export interface IncidentEvent {
  id: string;
  incidentId: string;
  deviceId: string;
  author: string;
  kind: IncidentEventKind;
  text: string;
  ts: number;
  lamport: number;
}

export interface JournalState {
  incidentId: string;
  title: string;
  severity: Severity;
  timeline: IncidentEvent[];
  participants: string[];
}
