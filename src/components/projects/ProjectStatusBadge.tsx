import { Badge } from '@/components/ui/Badge';
import { getProjectStatusLabel, type ProjectStatus } from '@/lib/projects';

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const variant =
    status === 'active' ? 'success' : status === 'paused' ? 'warning' : 'neutral';

  return <Badge variant={variant}>{getProjectStatusLabel(status)}</Badge>;
}

