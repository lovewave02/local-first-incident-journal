const form = document.getElementById('incidentForm');
const output = document.getElementById('output');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const incidentId = document.getElementById('incidentId').value.trim();
  const title = document.getElementById('title').value.trim();
  const severity = document.getElementById('severity').value;
  const eventsRaw = document.getElementById('events').value.trim();

  const events = eventsRaw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [kind = 'impact_update', author = 'unknown', ...rest] = line.split('|');
      return {
        kind: kind.trim(),
        author: author.trim(),
        text: rest.join('|').trim() || line,
      };
    });

  const res = await fetch('/api/postmortem', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ incidentId, title, severity, events }),
  });

  if (!res.ok) {
    output.textContent = `오류: ${res.status}`;
    return;
  }

  const data = await res.json();
  output.textContent = data.postmortem;
});
