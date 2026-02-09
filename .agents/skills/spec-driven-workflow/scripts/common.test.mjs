import test from 'node:test';
import assert from 'node:assert/strict';

import { setFeatureReadmeMetadata, setFrontmatterField } from './common.mjs';

test('setFrontmatterField updates quoted status', () => {
  const input = [
    '---',
    'status: "In Progress"',
    'last_updated: "2026-02-09"',
    '---',
    '',
  ].join('\n');

  const output = setFrontmatterField(input, 'status', 'Done');
  assert.match(output, /^status: "Done"$/m);
});

test('setFrontmatterField updates unquoted status', () => {
  const input = [
    '---',
    'status: In Progress',
    'last_updated: 2026-02-09',
    '---',
    '',
  ].join('\n');

  const output = setFrontmatterField(input, 'status', 'Done');
  assert.match(output, /^status: "Done"$/m);
});

test('setFeatureReadmeMetadata syncs status and date', () => {
  const input = [
    '# F-002 Project Filter/Sort',
    '',
    '- Status: `In Progress`',
    '- Owner: `unassigned`',
    '- Last Updated: `2026-02-08`',
    '',
  ].join('\n');

  const output = setFeatureReadmeMetadata(input, 'Done', '2026-02-09');
  assert.match(output, /^- Status: `Done`$/m);
  assert.match(output, /^- Last Updated: `2026-02-09`$/m);
});
