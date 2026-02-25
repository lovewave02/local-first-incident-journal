# Local-First Incident Journal

An offline-first engineering incident notebook that syncs later with deterministic merge semantics and postmortem generation.

## MVP implemented
- Local incident journal domain model (`LocalIncidentJournal`)
- Deterministic event-log merge (`mergeEventLogs`) with Lamport-aware conflict handling
- Markdown postmortem generator (`generatePostmortem`)
- Vitest test suite and runnable MVP example

## Why this is portfolio-worthy
- Shows distributed systems thinking in a practical workflow.
- Demonstrates local-first behavior: collect first, sync later.
- Produces concrete output (postmortem draft) from operational event data.

## Quick start
```bash
npm install
npm test
npm run build
npm run dev:example
```

## Project structure
- `src/types.ts`: core types for incident domain
- `src/crdt.ts`: merge logic for concurrent/offline logs
- `src/journal.ts`: local journal aggregate
- `src/postmortem.ts`: postmortem markdown renderer
- `tests/journal.test.ts`: merge + rendering tests
- `examples/mvp-flow.ts`: end-to-end sample flow

## Next roadmap
1. Persist local log in IndexedDB/SQLite adapter
2. Add real CRDT library adapter (Yjs/Automerge) for multi-device sync
3. Add timeline UI + diff view for conflicting edits
4. Add export to Slack/Notion/GitHub issue template
