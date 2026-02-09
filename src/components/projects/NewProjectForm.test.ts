import { describe, expect, it } from 'vitest';

import { validateProjectForm } from './NewProjectForm';

describe('validateProjectForm', () => {
  it('returns required errors for empty values', () => {
    const errors = validateProjectForm({
      name: '',
      owner: '',
      status: 'active',
      description: '',
    });

    expect(errors).toEqual({
      name: 'Name is required.',
      owner: 'Owner is required.',
      description: 'Description is required.',
    });
  });

  it('treats whitespace-only fields as empty', () => {
    const errors = validateProjectForm({
      name: '   ',
      owner: '\n\t',
      status: 'paused',
      description: '  ',
    });

    expect(errors.name).toBe('Name is required.');
    expect(errors.owner).toBe('Owner is required.');
    expect(errors.description).toBe('Description is required.');
  });

  it('returns no field errors for valid required values', () => {
    const errors = validateProjectForm({
      name: 'Project A',
      owner: 'Mina Lee',
      status: 'archived',
      description: 'Internal migration.',
    });

    expect(errors).toEqual({});
  });
});

