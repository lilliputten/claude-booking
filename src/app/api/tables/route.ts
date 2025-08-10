import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const tables = await prisma.table.findMany({
      include: {
        diningHall: true,
      },
    });

    return NextResponse.json(tables);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[src/app/api/tables/route.ts]', error);
    debugger; // eslint-disable-line no-debugger
    return NextResponse.json({ error: 'Failed to fetch tables' }, { status: 500 });
  }
}
