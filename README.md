# Local-First Incident Journal

An offline-first engineering incident notebook that syncs later with CRDT conflict resolution.

## Why this is portfolio-worthy
- Shows distributed systems thinking in a tangible UX.
- Demonstrates local-first architecture and conflict handling.
- Practical for SRE/dev teams.

## MVP scope
- Create incident timeline offline
- Merge notes from multiple devices using CRDT
- Render postmortem template automatically

## Tech stack
- Frontend: TypeScript
- Local store: IndexedDB
- Sync: CRDT (Automerge or Yjs)

## Roadmap
1. Add device-to-device sync over WebRTC
2. Add markdown postmortem export
3. Add replay timeline animation
