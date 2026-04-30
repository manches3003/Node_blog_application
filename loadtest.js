import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // Load test: 500 concurrent users for 60 seconds
  stages: [
    { duration: '10s', target: 100 },   // Ramp up to 100 users
    { duration: '10s', target: 300 },   // Ramp up to 300 users
    { duration: '10s', target: 500 },   // Ramp up to 500 users
    { duration: '60s', target: 500 },   // Stay at 500 users for 60 seconds
    { duration: '10s', target: 0 },     // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],   // 95% of requests should complete within 500ms
    http_req_failed: ['rate<0.1'],      // Error rate should be less than 10%
  },
};

export default function () {
  // Test GET /api/posts endpoint
  const res = http.get('http://localhost:5000/api/posts');

  check(res, {
    'status is 200 or 404': (r) => r.status === 200 || r.status === 404,
  });

  sleep(0.5);

  // Test health endpoint
  const healthRes = http.get('http://localhost:5000/health');

  check(healthRes, {
    'health check passes': (r) => r.status === 200,
  });

  sleep(0.5);
}
