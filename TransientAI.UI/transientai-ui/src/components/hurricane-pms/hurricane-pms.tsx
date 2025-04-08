import { useEffect, useRef, useState } from "react";
import { useDeviceType } from "@/lib/hooks";
import styles from "./hurricane-pms.module.scss";
import { DataGrid } from "@/components/data-grid";
import {
  columnDefs,
  defaultGridOptions,
  managerDetailsColDefs,
  profitColDefs,
  lossColDefs,
} from "./hurricane-pms-config";
import {
  managers,
  manager_detail,
  top_gainers,
  top_losers,
} from "./pms_mock_data";
import { IManager } from "./model";
import AssetAllocationChart from "./pms-charts";
import WorldMapChart from "./geographic-map";
import BarChart from "./issue-explorer-chart";

export const HurricanePms = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [managerId, setManagerId] = useState<string>('1');
    const [managerDetails, setManagerDetails] = useState<any>(null);
    const managerDetailsRef = useRef<HTMLDivElement>(null);
    const deviceType = useDeviceType();
    const isMobile = deviceType !== 'desktop';

    const handleOnRowClicked = (event: any) => {
        const selectedRow = event.data;
        setManagerId(selectedRow.id.toString());
        managerDetailsRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
      setManagerDetails(manager_detail[managerId as keyof typeof manager_detail] || []);
    }, [managerId]);

  return (
    <div className={`${styles["hurricane-pms"]} scrollable-div gap-4`}>
      <section className="flex h-[600px] gap-4">
        <div className="w-[80%] flex gap-8">

          <section className="w-[60%]">
            <DataGrid 
                className="hurrican-grid"
                domLayout={'normal'}
                height={isMobile ? 500 : '95%'}
                isSummaryGrid={false}
                suppressStatusBar={false}
                suppressFloatingFilter={false}
                columnDefs={columnDefs}
                rowData={managers}
                gridOptions={{
                  ...defaultGridOptions,
                  onRowClicked: handleOnRowClicked,
                  rowClassRules: {
                    'ag-row-even': (params :any) => params.node.rowIndex % 2 === 0,
                    'ag-row-odd': (params :any) => params.node.rowIndex % 2 !== 0
                  },            
                  pinnedTopRowData: [
                    managers.reduce((totals, row) => {
                      Object.keys(row).forEach((key) => {
                        const typedKey = key as keyof IManager;
                        const value = row[typedKey];
                  
                        if (typeof value === 'number') {
                          const currentTotal = (totals[typedKey] ?? 0) as number;
                          totals[typedKey] = currentTotal + value;
                        }
                      });
                  
                      totals.name = 'Total';
                      return totals;
                    }, {} as Partial<any>),
                  ],
                  getRowClass: (params) => {
                    if (params.node.rowPinned === 'top') {
                        return styles["pinned-top-row"];
                    }
                    return '';
                }
              }}
                loading={isLoading}
            />
          </section>
          <section className="w-[40%]">
            <div className="h-1/2">
                <DataGrid 
                    className="hurrican-grid"
                    domLayout={'normal'}
                    height={isMobile ? 500 : '95%'}
                    isSummaryGrid={false}
                    suppressStatusBar={true}
                    suppressFloatingFilter={false}
                    columnDefs={profitColDefs}
                    rowData={top_gainers}
                    gridOptions={defaultGridOptions}
                    loading={isLoading}
                    getRowId={(params) => {
                        return `${params.data.portfolio_manager}-${params.data.security}`;
                    }}
                />
            </div>
            <div className="h-1/2">
                <DataGrid 
                    className="hurrican-grid"
                    domLayout={'normal'}
                    height={isMobile ? 500 : '95%'}
                    isSummaryGrid={false}
                    suppressStatusBar={true}
                    suppressFloatingFilter={false}
                    columnDefs={lossColDefs}
                    rowData={top_losers}
                    gridOptions={defaultGridOptions}
                    loading={isLoading}
                    getRowId={(params) => {
                      return `${params.data.portfolio_manager}-${params.data.security}`;
                  }}
                />
            </div>
          </section>

        </div>

        <div className="">
          <div className="rounded-md p-2 h-[250px] w-[350px]">
            <h4 className="text-white text-center mb-2">Asset Allocation</h4>
            <AssetAllocationChart />
          </div>
          <div className="rounded-md p-2 h-[250px]  w-[350px]">
            <h4 className="text-white text-center mb-2">Geographic Exposure map</h4>
            <WorldMapChart />
          </div>
        </div>
      </section>

      <section className="flex h-[600px] gap-4">
        <div className="w-[80%]" ref={managerDetailsRef}>
            <DataGrid 
            className="hurrican-grid"
            domLayout={'normal'}
            height={isMobile ? 500 : '95%'}
            isSummaryGrid={false}
            suppressStatusBar={true}
            suppressFloatingFilter={false}
            columnDefs={managerDetailsColDefs}
            rowData={managerDetails}
            gridOptions={defaultGridOptions}
            loading={isLoading}
            />
        </div>

        <div className="rounded-md p-2 h-[500px] w-[350px]">
          <h4 className="text-white text-center mb-2">Manager Exposure</h4>
          <BarChart />
        </div>
      </section>
    </div>
  );
};
