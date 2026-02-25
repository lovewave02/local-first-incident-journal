const form = document.getElementById('incidentForm');
const output = document.getElementById('output');
const hint = document.getElementById('hint');
const fillExampleBtn = document.getElementById('fillExampleBtn');

fillExampleBtn.addEventListener('click', () => {
  document.getElementById('incidentId').value = 'INC-2026-001';
  document.getElementById('title').value = 'API Gateway timeout spike';
  document.getElementById('severity').value = 'sev1';
  document.getElementById('events').value = [
    'detected|alice|API 5xx 비율이 12%까지 증가',
    'impact_update|bob|결제 요청 일부 실패, 응답 지연 3배 증가',
    'mitigation|carol|트래픽 일부를 보조 리전으로 우회',
    'recovery|alice|에러율 정상 범위로 복귀',
    'action_item|dave|rate-limit 및 circuit breaker 임계값 재조정'
  ].join('\n');
  hint.textContent = '예시가 채워졌습니다. 그대로 생성하거나 텍스트를 수정해 사용하세요.';
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const incidentId = document.getElementById('incidentId').value.trim();
  const title = document.getElementById('title').value.trim();
  const severity = document.getElementById('severity').value;
  const eventsRaw = document.getElementById('events').value.trim();

  if (!eventsRaw) {
    hint.textContent = '이벤트를 최소 1줄 이상 입력해야 합니다.';
    return;
  }

  const lines = eventsRaw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const events = lines.map((line) => {
    const [kind = 'impact_update', author = 'unknown', ...rest] = line.split('|');
    const text = rest.join('|').trim();
    return {
      kind: kind.trim() || 'impact_update',
      author: author.trim() || 'unknown',
      text: text || line,
    };
  });

  hint.textContent = `총 ${events.length}개 이벤트를 분석 중...`;

  const res = await fetch('/api/postmortem', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ incidentId, title, severity, events }),
  });

  if (!res.ok) {
    output.textContent = `오류: ${res.status}`;
    hint.textContent = '요청 실패. 입력 형식(kind|author|text)을 확인해주세요.';
    return;
  }

  const data = await res.json();
  output.textContent = data.postmortem;
  hint.textContent = `완료: ${events.length}개 이벤트로 포스트모템 초안을 생성했습니다.`;
});
