export function numberFormatter(value: any, decimal: number) {
  return parseFloat(parseFloat(value).toFixed(decimal)).toLocaleString(
    "en-US",
    {
      useGrouping: true,
    }
  );
}

export function isNumeric(str: any) {
  return !isNaN(str) && !isNaN(parseFloat(str));
}