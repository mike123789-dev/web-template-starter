'use client';

import { useCallback, useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/cn';

type FormValues = {
  name: string;
  owner: string;
  status: 'active' | 'paused' | 'archived';
  description: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>> & { form?: string };

const DEFAULT_VALUES: FormValues = {
  name: '',
  owner: '',
  status: 'active',
  description: '',
};

const API_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) errors.name = 'Name is required.';
  if (!values.owner.trim()) errors.owner = 'Owner is required.';
  if (!values.description.trim()) errors.description = 'Description is required.';

  return errors;
}

export function NewProjectForm({ className }: { className?: string }) {
  const router = useRouter();

  const [values, setValues] = useState<FormValues>(DEFAULT_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return !isSubmitting;
  }, [isSubmitting]);

  const update = useCallback(<K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((curr) => ({ ...curr, [key]: value }));
  }, []);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const nextErrors = validate(values);
      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        return;
      }

      setErrors({});
      setIsSubmitting(true);
      try {
        const res = await fetch(`${API_BASE_PATH}/api/projects`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          let message = 'Failed to create project.';
          try {
            const data = (await res.json()) as { error?: unknown };
            if (typeof data.error === 'string' && data.error.trim()) {
              message = data.error;
            }
          } catch {
            try {
              const text = await res.text();
              if (text.trim()) message = text;
            } catch {
              // ignore
            }
          }

          setErrors({ form: message });
          return;
        }

        router.push('/?created=1');
      } catch {
        setErrors({ form: 'Network error. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    },
    [router, values]
  );

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          This form validates required fields and posts to a mock API route.
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <form onSubmit={onSubmit} className="grid gap-4" noValidate>
          {errors.form ? (
            <div
              role="alert"
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-100"
            >
              {errors.form}
            </div>
          ) : null}

          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium text-slate-900 dark:text-slate-50">
              Name
            </label>
            <input
              id="name"
              name="name"
              value={values.name}
              onChange={(e) => update('name', e.target.value)}
              className={cn(
                'h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus-visible:ring-slate-50/20',
                errors.name ? 'border-rose-300 dark:border-rose-900/60' : ''
              )}
              placeholder="e.g. Payments refactor"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
              disabled={isSubmitting}
            />
            {errors.name ? (
              <p id="name-error" className="text-sm text-rose-700 dark:text-rose-200" role="alert">
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="owner"
              className="text-sm font-medium text-slate-900 dark:text-slate-50"
            >
              Owner
            </label>
            <input
              id="owner"
              name="owner"
              value={values.owner}
              onChange={(e) => update('owner', e.target.value)}
              className={cn(
                'h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus-visible:ring-slate-50/20',
                errors.owner ? 'border-rose-300 dark:border-rose-900/60' : ''
              )}
              placeholder="e.g. Mina Lee"
              aria-invalid={Boolean(errors.owner)}
              aria-describedby={errors.owner ? 'owner-error' : undefined}
              disabled={isSubmitting}
            />
            {errors.owner ? (
              <p
                id="owner-error"
                className="text-sm text-rose-700 dark:text-rose-200"
                role="alert"
              >
                {errors.owner}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="status"
              className="text-sm font-medium text-slate-900 dark:text-slate-50"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={values.status}
              onChange={(e) => update('status', e.target.value as FormValues['status'])}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus-visible:ring-slate-50/20"
              disabled={isSubmitting}
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-slate-900 dark:text-slate-50"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={values.description}
              onChange={(e) => update('description', e.target.value)}
              className={cn(
                'min-h-24 resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus-visible:ring-slate-50/20',
                errors.description ? 'border-rose-300 dark:border-rose-900/60' : ''
              )}
              placeholder="What is this project about?"
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? 'description-error' : undefined}
              disabled={isSubmitting}
            />
            {errors.description ? (
              <p
                id="description-error"
                className="text-sm text-rose-700 dark:text-rose-200"
                role="alert"
              >
                {errors.description}
              </p>
            ) : null}
          </div>

          <CardFooter className="px-0 pb-0">
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex touch-manipulation items-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus-visible:ring-slate-50/20"
            >
              {isSubmitting ? 'Creating…' : 'Create'}
            </button>

            <button
              type="button"
              onClick={() => router.push('/')}
              disabled={isSubmitting}
              className="inline-flex touch-manipulation items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:hover:bg-slate-900 dark:focus-visible:ring-slate-50/20"
            >
              Cancel
            </button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}

