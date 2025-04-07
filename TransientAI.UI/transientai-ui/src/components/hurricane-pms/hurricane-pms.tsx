import { useEffect, useState } from "react";
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

export const HurricanePms = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [managerId, setManagerId] = useState<string>('1');
    const [managerDetails, setManagerDetails] = useState<any>(null);
    const deviceType = useDeviceType();
    const isMobile = deviceType !== 'desktop';

    const handleOnRowClicked = (event: any) => {
        const selectedRow = event.data;
        setManagerId(selectedRow.id.toString());
    };

    useEffect(() => {
      setManagerDetails(manager_detail[managerId as keyof typeof manager_detail] || []);
    }, [managerId]);

  return (
    <div className={`${styles["hurricane-pms"]} scrollable-div gap-4`}>
      <section className="flex h-[600px] gap-4 flex-1">
        <div className="w-[80%] flex gap-8">

          <section className="w-[60%]">
            <DataGrid 
                domLayout={'normal'}
                height={isMobile ? 500 : '95%'}
                isSummaryGrid={false}
                suppressStatusBar={true}
                suppressFloatingFilter={false}
                columnDefs={columnDefs}
                rowData={managers}
                gridOptions={{
                  ...defaultGridOptions,
                  onRowClicked: handleOnRowClicked,
                }}
                loading={isLoading}
            />
          </section>
          <section className="w-[40%]">
            <div className="h-1/2">
                <DataGrid 
                    domLayout={'normal'}
                    height={isMobile ? 500 : '95%'}
                    isSummaryGrid={false}
                    suppressStatusBar={true}
                    suppressFloatingFilter={false}
                    columnDefs={profitColDefs}
                    rowData={top_gainers}
                    gridOptions={defaultGridOptions}
                    loading={isLoading}
                />
            </div>
            <div className="h-1/2">
                <DataGrid 
                    domLayout={'normal'}
                    height={isMobile ? 500 : '95%'}
                    isSummaryGrid={false}
                    suppressStatusBar={true}
                    suppressFloatingFilter={false}
                    columnDefs={lossColDefs}
                    rowData={top_losers}
                    gridOptions={defaultGridOptions}
                    loading={isLoading}
                />
            </div>
          </section>

        </div>

        <div className="">
          <section>charts</section>
          <section>charts</section>
        </div>
      </section>

      <section className="flex h-[600px] gap-4">
        <div className="w-[80%]">
            <DataGrid 
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
        <div>charts</div>
      </section>
    </div>
  );
};
