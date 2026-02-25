import { createServer } from 'node:http';

import { LocalIncidentJournal, generatePostmortem } from './index.js';

function demoPayload() {
  const journal = new LocalIncidentJournal('INC-PORT-001', 'Portainer demo incident', 'sev2');
  journal.append({
    id: 'evt-1',
    incidentId: 'INC-PORT-001',
    deviceId: 'ubuntu',
    author: 'system',
    kind: 'detected',
    text: 'Latency spike detected in api-gateway',
    ts: Date.now() - 60_000,
    lamport: 1
  });
  journal.merge([
    {
      id: 'evt-2',
      incidentId: 'INC-PORT-001',
      deviceId: 'mac',
      author: 'operator',
      kind: 'mitigation',
      text: 'Rerouted traffic to healthy region',
      ts: Date.now(),
      lamport: 2
    }
  ]);

  const state = journal.getState();
  return {
    state,
    postmortem: generatePostmortem(state)
  };
}

const port = Number(process.env.PORT ?? 18085);

createServer((req, res) => {
  if ((req.url ?? '/').startsWith('/health')) {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  const data = demoPayload();
  res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}).listen(port, '0.0.0.0', () => {
  console.log(`local-first-incident-journal listening on ${port}`);
});
