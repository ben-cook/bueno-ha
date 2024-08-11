/** Returns true for valid, finite numbers */
export function isValidNumber(num: number): boolean {
  return !isNaN(num) && Number.isFinite(num);
}

export function safeParseInt(num: string, radix?: number): number | undefined {
  const parsedInt = parseInt(num, radix);
  if (!isValidNumber(parsedInt)) return;
  return parsedInt;
}
