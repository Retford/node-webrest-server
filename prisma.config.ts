process.loadEnvFile();
import { defineConfig, env, PrismaConfig } from 'prisma/config';

type Env = {
  POSTGRES_URL: string;
};

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  engine: 'classic',
  datasource: {
    url: env<Env>('POSTGRES_URL'),
  },
} satisfies PrismaConfig);
