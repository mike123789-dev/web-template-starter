import { getProjects } from '@/lib/projects';

type CreateProjectPayload = {
  name?: unknown;
  owner?: unknown;
  status?: unknown;
  description?: unknown;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isStatus(value: unknown): value is 'active' | 'paused' | 'archived' {
  return value === 'active' || value === 'paused' || value === 'archived';
}

export async function GET() {
  const projects = await getProjects();
  return Response.json({ projects }, { status: 200 });
}

export async function POST(request: Request) {
  let payload: CreateProjectPayload;
  try {
    payload = (await request.json()) as CreateProjectPayload;
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (!isNonEmptyString(payload.name)) {
    return Response.json({ error: 'Name is required.' }, { status: 400 });
  }
  if (!isNonEmptyString(payload.owner)) {
    return Response.json({ error: 'Owner is required.' }, { status: 400 });
  }
  if (!isStatus(payload.status)) {
    return Response.json({ error: 'Status must be active, paused, or archived.' }, { status: 400 });
  }
  if (!isNonEmptyString(payload.description)) {
    return Response.json({ error: 'Description is required.' }, { status: 400 });
  }

  const now = new Date().toISOString();
  const project = {
    id: `mock-${Math.random().toString(16).slice(2, 10)}`,
    name: payload.name.trim(),
    owner: payload.owner.trim(),
    status: payload.status,
    description: payload.description.trim(),
    createdAt: now,
    updatedAt: now,
    tags: [],
  };

  return Response.json({ project }, { status: 201 });
}

