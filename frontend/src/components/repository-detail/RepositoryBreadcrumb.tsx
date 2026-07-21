import Link from "next/link";

interface RepositoryBreadcrumbProps {
  owner: string;
  name: string;
}

export function RepositoryBreadcrumb({ owner, name }: RepositoryBreadcrumbProps) {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className="sticky top-navbar z-20 bg-black/95 backdrop-blur-md py-3 border-b border-white/[0.06] -mx-8 px-8 text-sm text-white/60 transition-all duration-200"
    >
      <div className="flex items-center flex-wrap">
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
        <span className="text-white hover:text-white/90 truncate max-w-[200px] sm:max-w-xs">{name}</span>
      </div>
    </nav>
  );
}
