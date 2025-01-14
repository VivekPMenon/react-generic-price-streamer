import { numberFormatter } from "@/lib/utility-functions";
import { ColDef } from "ag-grid-community";

export function getNumberColDefTemplate(numberOfDecimals = 0): ColDef {
  return {
    filter: 'agNumberColumnFilter',
    cellClass: 'text-end',
    valueFormatter: params => numberFormatter(params.value, numberOfDecimals)
  };
}