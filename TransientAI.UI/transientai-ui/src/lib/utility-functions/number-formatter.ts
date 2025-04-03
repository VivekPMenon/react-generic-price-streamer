export function numberFormatter(value: any, decimal: number) {
  return parseFloat(parseFloat(value).toFixed(decimal)).toLocaleString(
    "en-US",
    {
      useGrouping: true,
      maximumFractionDigits: decimal,
      minimumFractionDigits: decimal,
    }
  );
}

export function isNumeric(str: any) {
  return str !== undefined && str !== null && !isNaN(str) && !isNaN(parseFloat(str));
}

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
});

const formatterNoSymbol = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    currencyDisplay: 'code'
});

export function formatCurrency(amount: number|undefined|null, defaultValue: string = '', showSymbol: boolean = true) {
    if (amount === undefined || amount === null || Number.isNaN(amount)) {
        return defaultValue;
    }

    return showSymbol
        ? formatter.format(amount)
        : formatterNoSymbol.format(amount).replace('USD', '').trim();
}

export function formatShortened(amount: number|undefined|null, defaultValue: string = '') {
    if (amount === undefined || amount === null || Number.isNaN(amount)) {
        return defaultValue;
    }

    if (Math.abs(amount) >= 1_000_000_000_000) {
        return (amount / 1_000_000_000_000).toFixed(1) + 'T';
    } else if (Math.abs(amount) >= 1_000_000_000) {
        return (amount / 1_000_000_000).toFixed(1) + 'B';
    } else if (Math.abs(amount) >= 1_000_000) {
        return (amount / 1_000_000).toFixed(1) + 'M';
    } else {
        return amount.toString();
    }
}


const percentFormatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 2,
});

export function formatPercent(amount: number|undefined|null, defaultValue: string = '') {
    if (amount === undefined || amount === null || Number.isNaN(amount)) {
        return defaultValue;
    }

    return percentFormatter.format(amount);
}

export function formatDecimal(amount: number|undefined|null, defaultValue: string = '', decimalPlaces: number = 2) {
    if (amount === undefined || amount === null || Number.isNaN(amount)) {
        return defaultValue;
    }

    return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        maximumFractionDigits: decimalPlaces,
        minimumFractionDigits: decimalPlaces,
    }).format(amount);
}

const integerFormatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
    useGrouping: true,
});

export function formatInteger(amount: number|undefined|null, defaultValue: string = '') {
    if (amount === undefined || amount === null || Number.isNaN(amount)) {
        return defaultValue;
    }

    return integerFormatter.format(amount);
}