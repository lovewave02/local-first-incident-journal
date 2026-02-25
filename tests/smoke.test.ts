import { describe, expect, it } from 'vitest';

import { health } from '../src/index.js';

describe('health', () => {
  it('returns ok', () => {
    expect(health().status).toBe('ok');
  });
});
