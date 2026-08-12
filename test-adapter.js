const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const { PrismaClient } = require('@prisma/client');

try {
  const adapter = new PrismaBetterSqlite3({ url: 'file:./prisma/dev.db' });
  const client = new PrismaClient({ adapter });
  console.log('Successfully created PrismaClient with url option');
} catch (err) {
  console.error('Error with url option:', err.message);
}
