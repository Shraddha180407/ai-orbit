import Link from "next/link";

interface RepositoryBreadcrumbProps {
  owner: string;
  name: string;
}

export function RepositoryBreadcrumb({ owner, name }: RepositoryBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 md:mb-6 text-sm text-foreground-faint relative z-10">
      <Link href="/" className="hover:text-white transition-colors">
        Home
      </Link>
      <span className="mx-2 text-white/40">&gt;</span>
      <Link href="/companies" className="hover:text-white transition-colors">
        Companies
      </Link>
      <span className="mx-2 text-white/40">&gt;</span>
      <Link href={`/companies/${owner.toLowerCase()}`} className="hover:text-white transition-colors">
        {owner}
      </Link>
      <span className="mx-2 text-white/40">&gt;</span>
      <Link href="/repositories" className="hover:text-white transition-colors">
        Repositories
      </Link>
      <span className="mx-2 text-white/40">&gt;</span>
      <span className="text-white/60">{name}</span>
    </nav>
  );
}
