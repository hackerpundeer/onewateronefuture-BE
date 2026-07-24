import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseBookingListQuery } from '../src/legacy/validation.js';
import {
  buildAppointmentFilterQuery,
  matchesAppointmentFilters,
} from '../src/modules/appointment/repository.js';
import { pickAllowedFields } from '../src/shared/http/allowlist.js';
import {
  buildPaginationMeta,
  parsePagination,
  DEFAULT_LIMIT,
  MAX_LIMIT,
} from '../src/shared/http/pagination.js';
import { APPOINTMENT_PATCH_FIELDS } from '../src/modules/appointment/service.js';
import { ValidationError } from '../src/shared/errors/index.js';

test('parseBookingListQuery: valid from/to and status', () => {
  const { filters, error } = parseBookingListQuery({
    from: '2026-08-01',
    to: '2026-08-31',
    status: 'New',
    isDeleted: 'false',
  });
  assert.equal(error, null);
  assert.equal(filters.from, '2026-08-01');
  assert.equal(filters.to, '2026-08-31');
  assert.equal(filters.status, 'New');
  assert.equal(filters.isDeleted, false);
});

test('parseBookingListQuery: invalid from date returns error', () => {
  const { error } = parseBookingListQuery({ from: '08-01-2026' });
  assert.equal(error, 'from must be a valid YYYY-MM-DD date');
});

test('parseBookingListQuery: from after to returns error', () => {
  const { error } = parseBookingListQuery({ from: '2026-09-01', to: '2026-08-01' });
  assert.equal(error, 'from must be on or before to');
});

test('parseBookingListQuery: invalid isDeleted returns error', () => {
  const { error } = parseBookingListQuery({ isDeleted: 'yes' });
  assert.equal(error, 'isDeleted must be true or false');
});

test('parseBookingListQuery: deleted filter true', () => {
  const { filters, error } = parseBookingListQuery({ isDeleted: 'true' });
  assert.equal(error, null);
  assert.equal(filters.isDeleted, true);
});

test('buildAppointmentFilterQuery includes preferredDate range', () => {
  const query = buildAppointmentFilterQuery({
    isDeleted: false,
    status: 'New',
    from: '2026-08-01',
    to: '2026-08-10',
  });
  assert.equal(query.status, 'New');
  assert.deepEqual(query.preferredDate, { $gte: '2026-08-01', $lte: '2026-08-10' });
});

test('matchesAppointmentFilters: date range and status and deleted', () => {
  const doc = {
    preferredDate: '2026-08-05',
    status: 'New',
    isDeleted: false,
  };
  assert.equal(
    matchesAppointmentFilters(doc, {
      isDeleted: false,
      status: 'New',
      from: '2026-08-01',
      to: '2026-08-10',
    }),
    true
  );
  assert.equal(
    matchesAppointmentFilters(doc, {
      isDeleted: false,
      from: '2026-08-06',
      to: '2026-08-10',
    }),
    false
  );
  assert.equal(
    matchesAppointmentFilters(doc, { isDeleted: true }),
    false
  );
  assert.equal(
    matchesAppointmentFilters({ ...doc, isDeleted: true }, { isDeleted: true }),
    true
  );
});

test('parsePagination: defaults and max limit', () => {
  const defaults = parsePagination({});
  assert.equal(defaults.page, 1);
  assert.equal(defaults.limit, DEFAULT_LIMIT);
  assert.equal(defaults.skip, 0);

  const capped = parsePagination({ page: '2', limit: '999' });
  assert.equal(capped.page, 2);
  assert.equal(capped.limit, MAX_LIMIT);
  assert.equal(capped.skip, MAX_LIMIT);

  assert.throws(() => parsePagination({ page: '0' }), ValidationError);
  assert.throws(() => parsePagination({ limit: '-1' }), ValidationError);
});

test('buildPaginationMeta computes totalPages', () => {
  assert.deepEqual(buildPaginationMeta({ page: 1, limit: 20 }, 45), {
    page: 1,
    limit: 20,
    total: 45,
    totalPages: 3,
  });
  assert.deepEqual(buildPaginationMeta({ page: 1, limit: 20 }, 0), {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
});

test('pickAllowedFields strips protected mass-assignment fields', () => {
  const safe = pickAllowedFields(
    {
      status: 'Done',
      websiteId: 'hack',
      contactId: 'hack',
      schemaVersion: 99,
      isDeleted: true,
      deletedAt: new Date(),
      createdAt: new Date(),
      fullName: 'Ada',
    },
    APPOINTMENT_PATCH_FIELDS
  );
  assert.deepEqual(safe, { status: 'Done', fullName: 'Ada' });
  assert.equal('websiteId' in safe, false);
  assert.equal('contactId' in safe, false);
  assert.equal('isDeleted' in safe, false);
});
