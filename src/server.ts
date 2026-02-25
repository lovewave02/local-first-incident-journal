import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { LocalIncidentJournal, generatePostmortem } from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webDir = path.resolve(__dirname, 'web');

const port = Number(process.env.PORT ?? 18085);

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

async function serveStatic(url: string, res: import('node:http').ServerResponse) {
  const fileName = url === '/' ? 'index.html' : url.slice(1);
  const filePath = path.join(webDir, fileName);
  try {
    const body = await readFile(filePath);
    const ext = path.extname(filePath);
    const contentType = ext === '.css' ? 'text/css' : ext === '.js' ? 'text/javascript' : 'text/html';
    res.writeHead(200, { 'content-type': contentType });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('not found');
  }
}

createServer(async (req, res) => {
  const method = req.method ?? 'GET';
  const url = req.url ?? '/';

  if ((method === 'GET' || method === 'HEAD') && url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    if (method === 'HEAD') {
      res.end();
      return;
    }
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  if (method === 'GET' && url === '/api/demo') {
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(demoPayload()));
    return;
  }

  if (method === 'POST' && url === '/api/postmortem') {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk.toString();
    });
    req.on('end', () => {
      try {
        const payload = JSON.parse(raw) as {
          incidentId: string;
          title: string;
          severity: 'sev0' | 'sev1' | 'sev2' | 'sev3';
          events: Array<{ kind: any; author: string; text: string }>;
        };

        const journal = new LocalIncidentJournal(payload.incidentId, payload.title, payload.severity ?? 'sev2');
        (payload.events ?? []).forEach((ev, idx) => {
          journal.append({
            id: `evt-${idx + 1}`,
            incidentId: payload.incidentId,
            deviceId: 'web',
            author: ev.author || 'unknown',
            kind: ev.kind || 'impact_update',
            text: ev.text || '',
            ts: Date.now() + idx,
            lamport: idx + 1,
          });
        });

        const state = journal.getState();
        const postmortem = generatePostmortem(state);

        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ state, postmortem }));
      } catch {
        res.writeHead(400, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ error: 'invalid payload' }));
      }
    });
    return;
  }

  if (method === 'HEAD') {
    if (url === '/' || url === '/index.html') {
      res.writeHead(200, { 'content-type': 'text/html' });
      res.end();
      return;
    }
    res.writeHead(200);
    res.end();
    return;
  }

  if (method === 'GET') {
    await serveStatic(url, res);
    return;
  }

  res.writeHead(405, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ error: 'method not allowed' }));
}).listen(port, '0.0.0.0', () => {
  console.log(`local-first-incident-journal listening on ${port}`);
});
