import { isNumeric, numberFormatter } from "@/lib/utility-functions";
import { ColDef } from "ag-grid-community";

export function getNumberColDefTemplate(numberOfDecimals = 0, isZeroBlank = true): ColDef {
  return {
    filter: 'agNumberColumnFilter',
    cellClass: 'text-end',
    valueFormatter: params => {
      if (!isNumeric(params.value)) {
        return '';
      }

      if(isZeroBlank && params.value === 0) {
        return '';
      }

      return numberFormatter(params.value, numberOfDecimals);
    }
  };
}

export function getCurrencyColDefTemplate(currency = 'USD', isZeroBlank = true): ColDef {
  return {
    filter: 'agNumberColumnFilter',
    cellClass: 'text-end justify-end orange-color',
    valueFormatter: params => {
      if (!isNumeric(params.value)) {
        return '';
      }

      if (isZeroBlank && params.value === 0) {
        return '';
      }

      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(params.value);
    }
  };
}
