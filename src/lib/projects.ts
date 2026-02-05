import projectsData from '@/lib/mock/projects.json';

import { sleep } from '@/lib/sleep';

export type ProjectStatus = 'active' | 'paused' | 'archived';

export type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  owner: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  tags: string[];
};

export type ProjectActivity = {
  id: string;
  timestamp: string; // ISO timestamp
  message: string;
};

type ProjectsMockData = {
  projects: Project[];
  activityByProjectId: Record<string, ProjectActivity[] | undefined>;
};

const mockData = projectsData as unknown as ProjectsMockData;

export async function getProjects(options?: { delayMs?: number }) {
  const delayMs = options?.delayMs ?? 0;
  if (delayMs > 0) {
    await sleep(delayMs);
  }

  return mockData.projects;
}

export async function getProjectById(id: string, options?: { delayMs?: number }) {
  const projects = await getProjects(options);
  return projects.find((project) => project.id === id) ?? null;
}

export async function getProjectActivity(id: string, options?: { delayMs?: number }) {
  const delayMs = options?.delayMs ?? 0;
  if (delayMs > 0) {
    await sleep(delayMs);
  }

  return mockData.activityByProjectId[id] ?? [];
}

export function getProjectStatusLabel(status: ProjectStatus) {
  switch (status) {
    case 'active':
      return 'Active';
    case 'paused':
      return 'Paused';
    case 'archived':
      return 'Archived';
    default: {
      const exhaustiveCheck: never = status;
      return exhaustiveCheck;
    }
  }
}

