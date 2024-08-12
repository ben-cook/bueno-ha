/** Returns true for valid, finite numbers */
export function isValidNumber(num: number): boolean {
  return !isNaN(num) && Number.isFinite(num);
}

export function safeParseFloat(num: string): number | undefined {
  const parsedInt = parseFloat(num);
  if (!isValidNumber(parsedInt)) return;
  return parsedInt;
}
