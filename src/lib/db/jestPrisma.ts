// NOTE: Is it required? (Used only for jest.)

import { PrismaClient } from '@/generated/prisma/client';

import 'server-only';

export const jestPrisma = new PrismaClient();
