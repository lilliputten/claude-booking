/* eslint-disable no-console */

/**
 * It'll be work only for empty database.
 * `DROP SCHEMA public CASCADE;` sql command to drop all databases.
 *
 * TODO: Add a command-line option to clear the databses.
 */

import { DiningHall, PrismaClient, Table, TableStatus } from '../src/generated/prisma';

const prisma = new PrismaClient();

const now = new Date();

const initialDiningHall: DiningHall = {
  id: 1,
  name: 'Default Hall',
  width: 800,
  height: 600,
  backgroundColor: '#f5f5f5',
  tableColorAvailable: '#4caf50',
  tableColorOccupied: '#f44336',
  tableColorReserved: '#ff9800',
  tableDefaultColor: '#3434f0',
  createdAt: now,
  updatedAt: now,
};

const initialTables: Array<Omit<Table, 'id'>> = [
  {
    diningHallId: 1,
    tableNumber: 1,
    seats: 4,
    status: TableStatus.AVAILABLE,
    x: 100,
    y: 150,
    width: 80,
    height: 80,
    rotation: 30,
    color: '#3434f0',
  },
  {
    diningHallId: 1,
    tableNumber: 2,
    seats: 4,
    status: TableStatus.AVAILABLE,
    x: 250,
    y: 150,
    width: 80,
    height: 80,
    rotation: 0,
    color: '#9d17b2',
  },
  {
    diningHallId: 1,
    tableNumber: 3,
    seats: 6,
    status: TableStatus.RESERVED,
    x: 400,
    y: 200,
    width: 120,
    height: 80,
    rotation: 0,
    color: '#008b98',
  },
  {
    diningHallId: 1,
    tableNumber: 4,
    seats: 4,
    status: TableStatus.OCCUPIED,
    x: 600,
    y: 300,
    width: 80,
    height: 80,
    rotation: 15,
    color: '#0a4d98',
  },
];

async function main() {
  // Check if tables already exist
  const existingDiningHalls = await prisma.diningHall.count();
  const existingTables = await prisma.table.count();

  if (existingDiningHalls > 0 || existingTables > 0) {
    console.log('Database already contains data. Skipping seed operation.');
    console.log(`Found ${existingDiningHalls} dining hall(s) and ${existingTables} table(s)`);
    return;
  }

  console.log('Database is empty. Proceeding with seed operation...');

  const diningHall = await prisma.diningHall.create({
    data: initialDiningHall,
  });

  for (const table of initialTables) {
    await prisma.table.create({
      data: {
        tableNumber: table.tableNumber,
        seats: table.seats,
        status: table.status,
        x: table.x,
        y: table.y,
        width: table.width ?? undefined,
        height: table.height ?? undefined,
        rotation: table.rotation ?? undefined,
        color: table.color ?? undefined,
        diningHallId: diningHall.id,
      },
    });
  }

  console.log('Dining hall and tables seeded successfully');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
