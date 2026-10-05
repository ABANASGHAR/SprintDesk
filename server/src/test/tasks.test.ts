import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../index.js';

let accessToken = '';

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ username: 'emilys', password: 'emilyspass' });
  accessToken = res.body.accessToken;
});

describe('Tasks endpoints', () => {
  let createdTaskId = '';

  it('GET /api/tasks - returns task list', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.tasks)).toBe(true);
    expect(res.body.total).toBeGreaterThan(0);
  });

  it('GET /api/tasks - returns 401 without token', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(401);
  });

  it('POST /api/tasks - creates a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Test task from API',
        priority: 'high',
        type: 'bug',
        storyPoints: 3,
        sprintId: 's4',
      });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test task from API');
    expect(res.body.id).toBeDefined();
    createdTaskId = res.body.id;
  });

  it('GET /api/tasks/:id - gets a specific task', async () => {
    const res = await request(app)
      .get(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdTaskId);
  });

  it('PATCH /api/tasks/:id - updates a task', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Updated title', priority: 'critical' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated title');
    expect(res.body.priority).toBe('critical');
  });

  it('PATCH /api/tasks/:id/move - moves task to different column', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${createdTaskId}/move`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ status: 'in-progress' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('in-progress');
  });

  it('POST /api/tasks/:id/comments - adds a comment', async () => {
    const res = await request(app)
      .post(`/api/tasks/${createdTaskId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ text: 'This is a test comment' });
    expect(res.status).toBe(201);
    expect(res.body.text).toBe('This is a test comment');
  });

  it('DELETE /api/tasks/:id - deletes a task', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(204);
  });

  it('GET /api/tasks/:id - returns 404 for deleted task', async () => {
    const res = await request(app)
      .get(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(404);
  });
});

describe('Analytics endpoints', () => {
  it('GET /api/analytics/summary - returns summary stats', async () => {
    const res = await request(app)
      .get('/api/analytics/summary')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(typeof res.body.total).toBe('number');
    expect(typeof res.body.done).toBe('number');
  });

  it('GET /api/analytics/velocity - returns velocity per sprint', async () => {
    const res = await request(app)
      .get('/api/analytics/velocity')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/analytics/status-breakdown - returns status counts', async () => {
    const res = await request(app)
      .get('/api/analytics/status-breakdown')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
