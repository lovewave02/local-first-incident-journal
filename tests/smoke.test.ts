import { health } from '../src/index';

if (health().status !== 'ok') {
  throw new Error('health check failed');
}
