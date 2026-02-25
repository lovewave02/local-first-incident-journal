import { describe, expect, it } from 'vitest';

import { LocalIncidentJournal, generatePostmortem, mergeEventLogs } from '../src/index.js';
import type { IncidentEvent } from '../src/types.js';

function ev(partial: Partial<IncidentEvent> & Pick<IncidentEvent, 'id'>): IncidentEvent {
  return {
    id: partial.id,
    incidentId: partial.incidentId ?? 'INC-001',
    deviceId: partial.deviceId ?? 'macbook',
    author: partial.author ?? 'dw',
    kind: partial.kind ?? 'impact_update',
    text: partial.text ?? 'updated',
    ts: partial.ts ?? 1700000000000,
    lamport: partial.lamport ?? 1
  };
}

describe('mergeEventLogs', () => {
  it('deduplicates and sorts events deterministically', () => {
    const left = [
      ev({ id: 'e2', ts: 2000, lamport: 2 }),
      ev({ id: 'e1', ts: 1000, lamport: 1 })
    ];
    const right = [ev({ id: 'e3', ts: 3000, lamport: 1 }), ev({ id: 'e1', ts: 1000, lamport: 1 })];

    const merged = mergeEventLogs(left, right);
    expect(merged.map((e) => e.id)).toEqual(['e1', 'e2', 'e3']);
  });
});

describe('LocalIncidentJournal + postmortem', () => {
  it('builds merged state and renders markdown postmortem', () => {
    const journal = new LocalIncidentJournal('INC-001', 'API timeout storm', 'sev1');

    journal.append(ev({ id: 'a', kind: 'detected', text: '5xx error spike', author: 'alice', ts: 1000 }));
    journal.merge([
      ev({ id: 'b', kind: 'mitigation', text: 'scaled workers', author: 'bob', ts: 2000 }),
      ev({ id: 'c', kind: 'action_item', text: 'add circuit breaker', author: 'alice', ts: 3000 })
    ]);

    const state = journal.getState();
    expect(state.timeline).toHaveLength(3);
    expect(state.participants).toEqual(['alice', 'bob']);

    const postmortem = generatePostmortem(state);
    expect(postmortem).toContain('# Incident Postmortem: API timeout storm');
    expect(postmortem).toContain('add circuit breaker');
  });
});
