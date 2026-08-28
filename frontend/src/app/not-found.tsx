import Link from "next/link";
import FileQuestion from 'lucide-react/dist/esm/icons/file-question';

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <FileQuestion size={32} className="text-foreground-faint" aria-hidden="true" />
      <div>
        <h1 className="font-medium text-foreground">Page not found</h1>
        <p className="mt-1 text-sm text-foreground-muted">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
      </div>
      <Link
        href="/tools"
        className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
      >
        Browse AI Tools
      </Link>
    </main>
  );
}
