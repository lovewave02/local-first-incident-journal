# Architecture

- All writes go to local log first.
- Sync worker merges changesets using CRDT semantics.
- UI reads materialized incident timeline.
