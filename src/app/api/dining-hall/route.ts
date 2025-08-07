import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db/prisma';
import { defaultDiningHallId } from '@/features/DiningHall/constants';

export async function GET() {
  try {
    const diningHall = await prisma.diningHall.findUnique({
      where: { id: defaultDiningHallId },
    });
    return NextResponse.json(diningHall);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[src/app/api/dining-hall/route.ts]', error);
    debugger; // eslint-disable-line no-debugger
    return NextResponse.json({ error: 'Failed to fetch dining hall' }, { status: 500 });
  }
}
