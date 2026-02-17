export function serializeValue(value: any): string {
  if (typeof value === 'bigint') {
    return value.toString(10);
  } else if (value && typeof value === 'object') {
    return `␣${JSON.stringify(value, (_, v) => (typeof v === 'bigint' ? v.toString(10) : v))}␣`;
  } else {
    return value?.toString();
  }
}
