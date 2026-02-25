import { LocalIncidentJournal, generatePostmortem } from '../src/index.js';

const journal = new LocalIncidentJournal('INC-2026-02-26', 'Redis latency spike', 'sev2');

journal.append({
  id: 'evt-1',
  incidentId: 'INC-2026-02-26',
  deviceId: 'mac',
  author: 'dw',
  kind: 'detected',
  text: 'p95 latency > 900ms',
  ts: Date.now() - 60_000,
  lamport: 1
});

journal.merge([
  {
    id: 'evt-2',
    incidentId: 'INC-2026-02-26',
    deviceId: 'ubuntu',
    author: 'dw',
    kind: 'mitigation',
    text: 'restarted shard and enabled throttling',
    ts: Date.now(),
    lamport: 2
  }
]);

console.log(generatePostmortem(journal.getState()));
