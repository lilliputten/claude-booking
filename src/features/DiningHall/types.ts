import { ExtendNullWithUndefined, ReplaceNullWithUndefined } from '@/lib/helpers/ts';
import { DiningHall } from '@/generated/prisma/client';

export type TDiningHall = ExtendNullWithUndefined<DiningHall>;
export type TDiningHallReal = ReplaceNullWithUndefined<DiningHall>;

export type TDiningHallId = TDiningHall['id'];
