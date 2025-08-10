import { ExtendNullWithUndefined, ReplaceNullWithUndefined } from '@/lib/helpers/ts';
import { Table } from '@/generated/prisma/client';

export type TTable = ExtendNullWithUndefined<Table>;
export type TTableReal = ReplaceNullWithUndefined<Table>;

export type TTableId = TTable['id'];
