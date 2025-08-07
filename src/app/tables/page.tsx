'use client';

import React from 'react';

import { cn } from '@/lib/helpers/react';
import { isDev } from '@/constants';
import { defaultDiningHallId } from '@/features/DiningHall/constants';
import { TDiningHallReal } from '@/features/DiningHall/types';
import { TTableReal } from '@/features/Table/types';
import { TableStatus } from '@/generated/prisma/client';

export default function TablesPage() {
  const [tables, setTables] = React.useState<TTableReal[]>([]);
  const [diningHall, setDiningHall] = React.useState<TDiningHallReal | null>(null);
  const [isPending, startTransition] = React.useTransition();
  const [selectedTables, setSelectedTables] = React.useState<string[]>([]);

  React.useEffect(() => {
    async function fetchData() {
      const [tablesResponse, diningHallResponse] = await Promise.all([
        fetch('/api/tables'),
        fetch(`/api/dining-hall/${defaultDiningHallId}`),
      ]);
      const tables = await tablesResponse.json();
      const diningHall = await diningHallResponse.json();
      startTransition(() => {
        setTables(tables);
        setDiningHall(diningHall);
      });
    }
    fetchData();
  }, []);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      {isPending || !diningHall ? (
        <div className="flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Loading tables...</div>
        </div>
      ) : (
        <>
          <h1 className="mb-4 text-2xl font-bold">Tables Layout</h1>
          <div
            className={cn(
              isDev && '__layout_bg', // DEBUG
              'relative rounded-lg border border-[1px] border-gray-500/20 bg-gray-500/5',
            )}
            style={{ width: diningHall.width, height: diningHall.height }}
          >
            {tables.map((table) => {
              const color = table.color || diningHall.tableDefaultColor;
              const isSelected = selectedTables.includes(String(table.id));
              const backgroundColor =
                table.status === TableStatus.AVAILABLE
                  ? diningHall.tableColorAvailable
                  : table.status === TableStatus.OCCUPIED
                    ? diningHall.tableColorOccupied
                    : diningHall.tableColorReserved;

              return (
                <div
                  key={table.id}
                  className="absolute flex cursor-pointer items-center justify-center rounded-lg opacity-80 transition-all hover:opacity-95"
                  style={{
                    left: table.x,
                    top: table.y,
                    width: table.width || 80,
                    height: table.height || 60,
                    backgroundColor,
                    border: `4px solid ${color}`,
                    boxShadow: isSelected ? `0 0 10px 5px ${color}` : undefined,
                    transform: table.rotation
                      ? `rotate(${table.rotation}deg) translate3d(0, 0, 0)`
                      : undefined,
                  }}
                  onClick={() => {
                    setSelectedTables((prev) =>
                      prev.includes(String(table.id))
                        ? prev.filter((id) => id !== String(table.id))
                        : [...prev, String(table.id)],
                    );
                  }}
                  title={`Table ${table.id}: ${table.seats} seats`}
                >
                  <span className="truncate text-sm font-medium">Table {table.tableNumber}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* // Debug list - commented for future use
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Debug: Tables List</h2>
        <div className="space-y-4">
          {tables.map((table) => (
            <div key={table.id} className="border p-4 rounded-lg">
              <h3 className="font-semibold">Table #{table.tableNumber}</h3>
              <div className="mt-2 space-y-1 text-sm">
                <p><strong>ID:</strong> {table.id}</p>
                <p><strong>Seats:</strong> {table.seats}</p>
                <p><strong>Status:</strong> {table.status}</p>
                <p><strong>Dining Hall:</strong> {table.diningHall.name}</p>
                <p><strong>Position:</strong> x: {table.x}, y: {table.y}</p>
                {table.width && <p><strong>Width:</strong> {table.width}</p>}
                {table.height && <p><strong>Height:</strong> {table.height}</p>}
                {table.rotation !== null && table.rotation !== undefined && (
                  <p><strong>Rotation:</strong> {table.rotation}°</p>
                )}
                {table.color && <p><strong>Color:</strong> {table.color}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
      */}
    </div>
  );
}
