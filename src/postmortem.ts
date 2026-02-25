import type { JournalState } from './types.js';

function renderTimeline(state: JournalState): string {
  if (state.timeline.length === 0) return '- (no events yet)';
  return state.timeline
    .map((e) => `- ${new Date(e.ts).toISOString()} [${e.kind}] ${e.author}: ${e.text}`)
    .join('\n');
}

function renderActionItems(state: JournalState): string {
  const items = state.timeline.filter((e) => e.kind === 'action_item');
  if (items.length === 0) return '- (none yet)';
  return items.map((e) => `- [ ] ${e.text} (owner: ${e.author})`).join('\n');
}

export function generatePostmortem(state: JournalState): string {
  return [
    `# Incident Postmortem: ${state.title}`,
    '',
    `- Incident ID: ${state.incidentId}`,
    `- Severity: ${state.severity}`,
    `- Participants: ${state.participants.join(', ') || '(none)'}`,
    '',
    '## Timeline',
    renderTimeline(state),
    '',
    '## Impact',
    '- Describe affected users/systems and duration.',
    '',
    '## Root Cause',
    '- Summarize validated root cause and contributing factors.',
    '',
    '## Action Items',
    renderActionItems(state)
  ].join('\n');
}
