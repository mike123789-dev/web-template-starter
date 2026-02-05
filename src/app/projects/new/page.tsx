import { NewProjectForm } from '@/components/projects/NewProjectForm';
import { PageHeader } from '@/components/ui/PageHeader';

export default function NewProjectPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-10">
      <PageHeader
        title="New project"
        description="A simple form with basic validation and a redirect."
        backHref="/"
        backLabel="Back to projects"
      />

      <NewProjectForm />
    </div>
  );
}

