export function numberFormatter(value: any, decimal: number) {
  return parseFloat(parseFloat(value).toFixed(decimal)).toLocaleString(
    "en-US",
    {
      useGrouping: true,
    }
  );
}