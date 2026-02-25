import type { IncidentEvent } from './types.js';

function eventSortKey(e: IncidentEvent): [number, number, string, string] {
  return [e.ts, e.lamport, e.deviceId, e.id];
}

export function mergeEventLogs(a: IncidentEvent[], b: IncidentEvent[]): IncidentEvent[] {
  const map = new Map<string, IncidentEvent>();
  for (const e of [...a, ...b]) {
    const existing = map.get(e.id);
    if (!existing) {
      map.set(e.id, e);
      continue;
    }

    // Last-writer-wins by Lamport clock, then wall-clock timestamp.
    if (
      e.lamport > existing.lamport ||
      (e.lamport === existing.lamport && e.ts > existing.ts)
    ) {
      map.set(e.id, e);
    }
  }

  return [...map.values()].sort((x, y) => {
    const sx = eventSortKey(x);
    const sy = eventSortKey(y);
    for (let i = 0; i < sx.length; i += 1) {
      if (sx[i] < sy[i]) return -1;
      if (sx[i] > sy[i]) return 1;
    }
    return 0;
  });
}
