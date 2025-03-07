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

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
});

export function formatCurrency(amount: number|undefined, defaultValue: string = '') {
    if (amount) {
        if (Number.isNaN(amount)) {
            return defaultValue;
        }
        return formatter.format(amount);
    }
    return defaultValue;
}