import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/sleep', () => ({
  sleep: vi.fn().mockResolvedValue(undefined),
}));

import { sleep } from '@/lib/sleep';
import {
  getProjectActivity,
  getProjectById,
  getProjectStatusLabel,
  getProjects,
} from '@/lib/projects';

const sleepMock = vi.mocked(sleep);

describe('projects data access contract', () => {
  afterEach(() => {
    sleepMock.mockClear();
  });

  it('returns null when project id does not exist', async () => {
    await expect(getProjectById('p-999')).resolves.toBeNull();
  });

  it('returns an empty array when project activity does not exist', async () => {
    await expect(getProjectActivity('p-999')).resolves.toEqual([]);
  });

  it('applies delay only when delayMs is greater than zero', async () => {
    await getProjects();
    await getProjects({ delayMs: 0 });
    await getProjects({ delayMs: -1 });

    expect(sleepMock).not.toHaveBeenCalled();

    await getProjects({ delayMs: 10 });
    expect(sleepMock).toHaveBeenCalledTimes(1);
    expect(sleepMock).toHaveBeenLastCalledWith(10);
  });

  it('maps project statuses to user-facing labels', () => {
    expect(getProjectStatusLabel('active')).toBe('Active');
    expect(getProjectStatusLabel('paused')).toBe('Paused');
    expect(getProjectStatusLabel('archived')).toBe('Archived');
  });

  it('applies delay boundary rule consistently for by-id and activity lookups', async () => {
    await getProjectById('p-001', { delayMs: 0 });
    await getProjectActivity('p-001', { delayMs: -5 });
    expect(sleepMock).not.toHaveBeenCalled();

    await getProjectById('p-001', { delayMs: 5 });
    await getProjectActivity('p-001', { delayMs: 7 });

    expect(sleepMock).toHaveBeenCalledTimes(2);
    expect(sleepMock).toHaveBeenNthCalledWith(1, 5);
    expect(sleepMock).toHaveBeenNthCalledWith(2, 7);
  });
});
