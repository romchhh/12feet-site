export type TableNumber = 1 | 2 | 3;

export const TABLE_NUMBERS: TableNumber[] = [1, 2, 3];

export const PARTY_TABLE: TableNumber = 3;
export const PARTY_SEATS = 20;

export function parseTableNumber(value: unknown): TableNumber | null {
  if (value === 1 || value === 2 || value === 3) return value;
  if (value === "1" || value === "2" || value === "3") {
    return Number(value) as TableNumber;
  }
  return null;
}

export function isTableNumber(value: unknown): value is TableNumber {
  return parseTableNumber(value) !== null;
}
