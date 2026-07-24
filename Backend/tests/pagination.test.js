import test from 'node:test';
import assert from 'node:assert/strict';
import { encodeCursor, decodeCursor, buildCursorPagination } from '../pagination/index.js';

test('encodeCursor and decodeCursor round-trip values', () => {
  const cursor = { created_at: '2026-07-24T10:00:00.000Z', id: '123e4567-e89b-12d3-a456-426614174000' };

  const encoded = encodeCursor(cursor);
  assert.equal(typeof encoded, 'string');
  assert.deepEqual(decodeCursor(encoded), cursor);
});

test('buildCursorPagination returns a next cursor when more rows are available', () => {
  const result = buildCursorPagination({
    items: [{ id: '1', created_at: '2026-07-24T09:00:00.000Z' }, { id: '2', created_at: '2026-07-24T08:00:00.000Z' }],
    limit: 2,
    hasMore: true,
  });

  assert.equal(result.hasMore, true);
  assert.ok(result.nextCursor);
  assert.deepEqual(result.items.length, 2);
});

test('buildCursorPagination omits next cursor when there are no more rows', () => {
  const result = buildCursorPagination({
    items: [{ id: '1', created_at: '2026-07-24T09:00:00.000Z' }],
    limit: 2,
    hasMore: false,
  });

  assert.equal(result.hasMore, false);
  assert.equal(result.nextCursor, null);
});
