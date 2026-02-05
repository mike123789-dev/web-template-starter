'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/cn';

type Settings = {
  compactView: boolean;
  showArchived: boolean;
  confirmNavigation: boolean;
};

const STORAGE_KEY = 'starter.settings.v1';

const DEFAULT_SETTINGS: Settings = {
  compactView: false,
  showArchived: false,
  confirmNavigation: false,
};

function readSettingsFromStorage(): Settings | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      compactView: Boolean(parsed.compactView),
      showArchived: Boolean(parsed.showArchived),
      confirmNavigation: Boolean(parsed.confirmNavigation),
    };
  } catch {
    return null;
  }
}

function writeSettingsToStorage(settings: Settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore write failures (private mode, quota, etc.)
  }
}

function Row({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-50">{title}</p>
        <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>
      </div>
      <div className="pt-1">{children}</div>
    </div>
  );
}

export function SettingsPanel({ className }: { className?: string }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    // We intentionally sync localStorage after hydration to avoid SSR/CSR mismatches.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings(readSettingsFromStorage() ?? DEFAULT_SETTINGS);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    writeSettingsToStorage(settings);
  }, [isHydrated, settings]);

  const update = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((curr) => ({ ...curr, [key]: value }));
  }, []);

  const summary = useMemo(() => {
    const enabled = Object.entries(settings)
      .filter(([, value]) => Boolean(value))
      .map(([key]) => key);
    if (enabled.length === 0) return 'No settings enabled.';
    return `Enabled: ${enabled.join(', ')}.`;
  }, [settings]);

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Stored locally in your browser (no backend).
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        {!isHydrated ? (
          <div className="grid gap-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <div className="grid gap-3">
            <Row title="Compact view" description="Use tighter spacing in dense screens.">
              <input
                type="checkbox"
                checked={settings.compactView}
                onChange={(e) => update('compactView', e.target.checked)}
                className="h-4 w-4 accent-slate-900 dark:accent-slate-50"
              />
            </Row>
            <Row title="Show archived" description="Include archived projects in lists by default.">
              <input
                type="checkbox"
                checked={settings.showArchived}
                onChange={(e) => update('showArchived', e.target.checked)}
                className="h-4 w-4 accent-slate-900 dark:accent-slate-50"
              />
            </Row>
            <Row
              title="Confirm navigation"
              description="Ask before leaving forms with unsaved changes."
            >
              <input
                type="checkbox"
                checked={settings.confirmNavigation}
                onChange={(e) => update('confirmNavigation', e.target.checked)}
                className="h-4 w-4 accent-slate-900 dark:accent-slate-50"
              />
            </Row>

            <p className="pt-1 text-xs text-slate-500 dark:text-slate-400">{summary}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

