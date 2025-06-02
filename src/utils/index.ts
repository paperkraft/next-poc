import { baseColors } from "@/registry/registry-base-colors";

export function getLocalTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: "2-digit", hour12: true });
}

export function getFormattedDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export function getFormattedDateTime(date: Date): string {
  return `${getFormattedDate(date)}, ${getLocalTime(date)}`
}

// Helper: convert VAPID public key
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

export function getLightValues(themeName: string) {
  const theme = baseColors.find(t => t.name === themeName);
  return theme ? theme.activeColor.light : null;
}

export function debounce<T extends (...args: any[]) => void>(callback: T, delay: number) {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}


export const parseToDate = (val: string): Date | null => {
  // ISO 8601: 1990-12-31  ➜ [yyyy, mm, dd]
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/;
  const isoM = val.match(iso);
  if (isoM) return new Date(`${isoM[1]}-${isoM[2]}-${isoM[3]}`);

  // DMY: 31-12-1990      ➜ [dd, mm, yyyy]
  const dmy = /^(\d{2})-(\d{2})-(\d{4})$/;
  const dmyM = val.match(dmy);
  if (dmyM) return new Date(`${dmyM[3]}-${dmyM[2]}-${dmyM[1]}`);

  return null; // unsupported format
};