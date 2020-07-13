export function getClientUUID(id: string): string {
  return id.split('_')[2] || 'unknown';
}
