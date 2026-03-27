import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function getPrismaDatasourceUrl() {
  const rawDatabaseUrl = process.env.DATABASE_URL;

  // --- TEMP DEBUG ---
  console.log('[prisma] DATABASE_URL (redacted):', rawDatabaseUrl?.replace(/:([^:@]+)@/, ':***@'));
  console.log('[prisma] NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  // ------------------

  if (!rawDatabaseUrl) return rawDatabaseUrl;

  // Normalise postgres:// → postgresql://
  let url = rawDatabaseUrl.startsWith('postgres://')
    ? 'postgresql://' + rawDatabaseUrl.slice('postgres://'.length)
    : rawDatabaseUrl;

  if (!url.startsWith('postgresql://')) return rawDatabaseUrl;

  // Match: postgresql://user:password@host:port/db?query
  const match = url.match(
    /^(postgresql:\/\/)([^:]+):(.+)@([^/?]+)(\/[^?]*)?(\?.*)?$/i
  );

  if (!match) return rawDatabaseUrl;

  let [, prefix, username, rawPassword, hostPart, databasePart = '/postgres', queryString = ''] = match;

  // Supabase pooler (pooler.supabase.com) requires username in the form
  // "postgres.PROJECT_REF". If the username has no dot, extract the
  // project ref from NEXT_PUBLIC_SUPABASE_URL and append it.
  if (hostPart.includes('pooler.supabase.com') && !username.includes('.')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    const projectRef = supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1];
    if (projectRef) {
      username = `${username}.${projectRef}`;
    }
  }

  // Percent-encode special characters in the password
  let safePassword = rawPassword;
  try {
    safePassword = encodeURIComponent(decodeURIComponent(rawPassword));
  } catch {
    safePassword = encodeURIComponent(rawPassword);
  }

  return `${prefix}${username}:${safePassword}@${hostPart}${databasePart}${queryString}`;
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: getPrismaDatasourceUrl(),
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
