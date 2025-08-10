import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db/prisma';
import { TAwaitedProps } from '@/lib/helpers/ts';

type TAwaitedParamsProps = TAwaitedProps<{ id: string }>;

export async function GET(_request: Request, { params }: TAwaitedParamsProps) {
  try {
    const { id } = await params;
    const diningHall = await prisma.diningHall.findUnique({
      where: { id: parseInt(id) },
    });

    if (!diningHall) {
      return NextResponse.json({ error: 'Dining hall not found' }, { status: 404 });
    }

    return NextResponse.json(diningHall);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[src/app/api/dining-hall/[id]/route.ts]', error);
    debugger; // eslint-disable-line no-debugger
    return NextResponse.json({ error: 'Failed to fetch dining hall' }, { status: 500 });
  }
}
