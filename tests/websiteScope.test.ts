import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildWebsiteScopeFilter,
  matchesWebsiteScope,
  mergeWebsiteScope,
  setDefaultWebsiteId,
} from '../src/shared/db/websiteScope.js';

const DEFAULT_ID = 'default-website-id';
const OTHER_ID = 'other-website-id';

test('websiteScope: setup default id', () => {
  setDefaultWebsiteId(DEFAULT_ID);
});

test('buildWebsiteScopeFilter: default website includes legacy missing websiteId', () => {
  const filter = buildWebsiteScopeFilter(DEFAULT_ID);
  assert.deepEqual(filter, {
    $or: [
      { websiteId: DEFAULT_ID },
      { websiteId: { $exists: false } },
      { websiteId: null },
    ],
  });
});

test('buildWebsiteScopeFilter: other website is strict websiteId only', () => {
  const filter = buildWebsiteScopeFilter(OTHER_ID);
  assert.deepEqual(filter, { websiteId: OTHER_ID });
});

test('buildWebsiteScopeFilter: explicit isDefaultWebsite override', () => {
  assert.ok('$or' in buildWebsiteScopeFilter(OTHER_ID, { isDefaultWebsite: true }));
  assert.deepEqual(buildWebsiteScopeFilter(DEFAULT_ID, { isDefaultWebsite: false }), {
    websiteId: DEFAULT_ID,
  });
});

test('matchesWebsiteScope: legacy docs match default only', () => {
  const legacy = { websiteId: undefined };
  const nullish = { websiteId: null };
  assert.equal(matchesWebsiteScope(legacy, DEFAULT_ID), true);
  assert.equal(matchesWebsiteScope(nullish, DEFAULT_ID), true);
  assert.equal(matchesWebsiteScope(legacy, OTHER_ID), false);
  assert.equal(matchesWebsiteScope(nullish, OTHER_ID), false);
});

test('matchesWebsiteScope: scoped docs match owning website only', () => {
  assert.equal(matchesWebsiteScope({ websiteId: DEFAULT_ID }, DEFAULT_ID), true);
  assert.equal(matchesWebsiteScope({ websiteId: DEFAULT_ID }, OTHER_ID), false);
  assert.equal(matchesWebsiteScope({ websiteId: OTHER_ID }, OTHER_ID), true);
  assert.equal(matchesWebsiteScope({ websiteId: OTHER_ID }, DEFAULT_ID), false);
});

test('mergeWebsiteScope: combines default $or with extra query via $and', () => {
  const merged = mergeWebsiteScope(DEFAULT_ID, {
    $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
  });
  assert.ok('$and' in merged);
  const andClause = (merged as { $and: unknown[] }).$and;
  assert.equal(andClause.length, 2);
});

test('mergeWebsiteScope: non-default merges websiteId without $and', () => {
  const merged = mergeWebsiteScope(OTHER_ID, { status: 'New' });
  assert.deepEqual(merged, { status: 'New', websiteId: OTHER_ID });
});
