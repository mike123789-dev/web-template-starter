import { describe, expect, it } from 'vitest';

import { POST } from './route';

function buildRequest(body: string) {
  return new Request('http://localhost:3000/api/projects', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
  });
}

describe('POST /api/projects', () => {
  it('returns 400 for invalid JSON', async () => {
    const res = await POST(buildRequest('{'));
    const data = (await res.json()) as { error: string };

    expect(res.status).toBe(400);
    expect(data.error).toBe('Invalid JSON body.');
  });

  it('returns 400 when required name is missing', async () => {
    const res = await POST(
      buildRequest(
        JSON.stringify({
          owner: 'Mina',
          status: 'active',
          description: 'desc',
        })
      )
    );
    const data = (await res.json()) as { error: string };

    expect(res.status).toBe(400);
    expect(data.error).toBe('Name is required.');
  });

  it('returns 400 when status is invalid', async () => {
    const res = await POST(
      buildRequest(
        JSON.stringify({
          name: 'Project',
          owner: 'Mina',
          status: 'invalid',
          description: 'desc',
        })
      )
    );
    const data = (await res.json()) as { error: string };

    expect(res.status).toBe(400);
    expect(data.error).toBe('Status must be active, paused, or archived.');
  });

  it('returns 201 and normalized project for valid payload', async () => {
    const res = await POST(
      buildRequest(
        JSON.stringify({
          name: '  Project A  ',
          owner: '  Mina Lee ',
          status: 'paused',
          description: '  Internal migration. ',
        })
      )
    );
    const data = (await res.json()) as {
      project: {
        id: string;
        name: string;
        owner: string;
        status: string;
        description: string;
        tags: unknown[];
      };
    };

    expect(res.status).toBe(201);
    expect(data.project.id).toMatch(/^mock-/);
    expect(data.project.name).toBe('Project A');
    expect(data.project.owner).toBe('Mina Lee');
    expect(data.project.status).toBe('paused');
    expect(data.project.description).toBe('Internal migration.');
    expect(data.project.tags).toEqual([]);
  });
});

