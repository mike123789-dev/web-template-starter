import Link from 'next/link';

import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { PageHeader } from '@/components/ui/PageHeader';

export default function SettingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-10">
      <PageHeader
        title="Settings"
        description="A minimal preferences page that demonstrates client state and persistence."
        actions={
          <Link
            href="/"
            className="inline-flex touch-manipulation items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:hover:bg-slate-900 dark:focus-visible:ring-slate-50/20"
          >
            Back to projects
          </Link>
        }
      />

      <SettingsPanel />
    </div>
  );
}

