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