// Accept both PrismaClient and the Omit<> type from $transaction callback
type PrismaLike = {
  repository: {
    findUnique: (args: { where: { slug: string }; select: { githubId: true } }) => Promise<{ githubId: number } | null>;
  };
};

/**
 * Sanitize a string into a URL-friendly slug.
 * Matches the behaviour in scripts/sync-repositories.ts.
 */
export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Build a repository slug from owner and name.
 * Matches the behaviour in scripts/sync-repositories.ts.
 */
export function buildRepoSlug(owner: string, name: string): string {
  return sanitizeSlug(`${owner}-${name}`);
}

/**
 * Resolve slug collisions. If the desired slug is already occupied by a
 * different repository (different githubId), append the last 6 digits of
 * the githubId as a suffix — identical to the sync-repositories.ts logic.
 */
export async function resolveSlugCollision(
  prisma: PrismaLike,
  desiredSlug: string,
  githubId: number,
): Promise<string> {
  const existing = await prisma.repository.findUnique({
    where: { slug: desiredSlug },
    select: { githubId: true },
  });

  if (existing && existing.githubId !== githubId) {
    const suffix = githubId.toString().slice(-6);
    return `${desiredSlug}-${suffix}`;
  }

  return desiredSlug;
}
