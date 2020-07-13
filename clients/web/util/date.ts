import {formatDistance, format} from 'date-fns';

export function generateRandomId(): number {
  return Date.now() + Math.random();
}

// https://date-fns.org/v2.13.0/docs/format
export function formatTime(time: number | Date): string {
  return format(time, 'MMMM do yyyy, h:mm aaaa');
}

export function formatTimeDistance(time: number | Date): string {
  return formatDistance(time, new Date().getTime());
}
