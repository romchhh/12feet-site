export const WEEKDAY_PRICE = 20;
export const WEEKEND_PRICE = 25;

export function getBookingRate(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return WEEKDAY_PRICE;
  const day = new Date(y, m - 1, d).getDay();
  return day === 0 || day === 5 || day === 6 ? WEEKEND_PRICE : WEEKDAY_PRICE;
}

export function isValidDateISO(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return (
    dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
  );
}

export function isValidTime(timeStr: string): boolean {
  if (!/^\d{2}:\d{2}$/.test(timeStr)) return false;
  const [h, min] = timeStr.split(":").map(Number);
  if (h < 12 || h > 23) return false;
  if (min < 0 || min > 59) return false;
  if (h === 23 && min > 30) return false;
  return true;
}
