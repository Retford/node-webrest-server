process.loadEnvFile();
import { defineConfig, PrismaConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  engine: 'classic',
  datasource: {
    url: process.env.POSTGRES_URL!,
  },
} satisfies PrismaConfig);
