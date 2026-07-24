import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();

test('GET /api returns status string', async () => {
  const res = await request(app).get('/api');
  assert.equal(res.status, 200);
  assert.equal(res.text, 'Kangen Water API Running');
});

test('GET /api/health returns ok', async () => {
  const res = await request(app).get('/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
  assert.ok('mongoConnected' in res.body);
});

test('POST /api/book-demo with missing fields returns 400', async () => {
  const res = await request(app).post('/api/book-demo').send({});
  assert.equal(res.status, 400);
  assert.equal(res.body.error, 'Required fields missing');
});

test('GET /api/v2/health returns V2 envelope', async () => {
  const res = await request(app).get('/api/v2/health');
  assert.equal(res.status, 200);
  assert.ok(res.body.data);
  assert.equal(res.body.error, null);
  assert.equal(res.body.data.status, 'ok');
});
