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
} from "./pms_mock_data";
import { IManager } from "./model";
import AssetAllocationChart from "./pms-charts";
import WorldMapChart from "./geographic-map";
import BarChart from "./issue-explorer-chart";
import { TaDropDown } from '../shared'

const PortfolioSelectOptions = [
  { value: 'all', label: 'All' },
  ...managers.map((m) => ({
    value: m.id?.toString() ?? '',
    label: m.name ?? '',
  }))
];

const topProfitOption = [
  { value: '10', label: '10' },
  { value: '5', label: '5' },
];

const topLossOption = [
  { value: '10', label: '10' },
  { value: '5', label: '5' },
];

export const HurricanePms = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [managerId, setManagerId] = useState<string>('all');
    const [managerDetails, setManagerDetails] = useState<any>(null);
    const [selectedProfit, setSelectedProfit] = useState<string>('10');
    const [selectedLoss, setSelectedLoss] = useState<string>('10');
    const [topGainers, setTopGainers] = useState<any[] | null>(null);
    const [topLosers, setTopLosers] = useState<any[] | null>(null);
    const managerDetailsRef = useRef<HTMLDivElement>(null);
    const deviceType = useDeviceType();
    const isMobile = deviceType !== 'desktop';

    const handleOnRowClicked = (event: any) => {
        const selectedRow = event.data;
        setManagerId(selectedRow.id.toString());
        managerDetailsRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const getTopRecords = <T extends Record<string, any>>(
      data: any[],
      count: number,
      key: string
    ): any[] => {
      return data
        .slice()
        .sort((a, b) => (b[key] as number) - (a[key] as number))
        .slice(0, count);
    };
    
    useEffect(() => {
      setIsLoading(true);
      
      if (managerId === 'all') {
        const allDetails = Object.values(manager_detail)
          .flat(); 
        setManagerDetails(allDetails);
      } else {
        console.log(managerId)
        setManagerDetails(manager_detail[managerId as keyof typeof manager_detail] || []);
      }
    
      setIsLoading(false);
    }, [managerId]);

    useEffect(() => {
      const newTopGainers = getTopRecords(top_gainers['1'], parseInt(selectedProfit), 'pl');
      const newTopLoser = getTopRecords(top_gainers['1'], parseInt(selectedLoss), 'pl');
      console.log(newTopGainers)
      setTopGainers(newTopGainers);
      setTopLosers(newTopLoser);
    }, [])

    const handleManagerChange = (selectedOption: { value: string; label: string } | null) => {
      if (selectedOption) {
        setManagerId(selectedOption.value);
        managerDetailsRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    };

    const handleProfitChange = (selectedOption: { value: string; label: string } | null) => {
      if (selectedOption) {
        setSelectedProfit(selectedOption.value);
        const newTopGainers = getTopRecords(top_gainers['1'], parseInt(selectedOption.value), 'pl');
        setTopGainers(newTopGainers);
      }
    };
  
    const handleLossChange = (selectedOption: { value: string; label: string } | null) => {
      if (selectedOption) {
        setSelectedLoss(selectedOption.value);
        const newTopLoser = getTopRecords(top_gainers['1'], parseInt(selectedOption.value), 'pl');
        setTopLosers(newTopLoser);
      }
    };

  return (
    <div className={`${styles["hurricane-pms"]} scrollable-div gap-4`}>
      <section className="flex h-[600px] gap-4">
        <div className="w-[80%] flex gap-8">

          <section className="w-[60%]">
            <div className="inline-block min-w-44">
              <TaDropDown  
                options={PortfolioSelectOptions}
                value={PortfolioSelectOptions.find((m) => m.value === managerId) || null}
                onChange={handleManagerChange}
                isSearchable={true}
                prefix="Portfolio"
              />
            </div>

            <DataGrid 
                className="hurrican-grid"
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
            <div className="h-[45%]">
                <div className="inline-block min-w-10">
                    <TaDropDown
                    options={topProfitOption}
                    value={topProfitOption.find(p => p.value === selectedProfit) || null}
                    onChange={handleProfitChange}
                    isSearchable={false}
                    prefix="Top"
                  />
                </div>
                <DataGrid 
                    className="hurrican-grid"
                    domLayout={'normal'}
                    height={isMobile ? 500 : '95%'}
                    isSummaryGrid={false}
                    suppressStatusBar={true}
                    suppressFloatingFilter={true}
                    columnDefs={profitColDefs}
                    rowData={topGainers}
                    gridOptions={defaultGridOptions}
                    loading={isLoading}
                    getRowId={(params) => {
                        return `${params.data.portfolio_manager}-${params.data.security}`;
                    }}
                />
            </div>
            <div className="h-[45%] mt-10">
                <div className="inline-block min-w-10">
                  <TaDropDown
                    options={topLossOption}
                    value={topLossOption.find(l => l.value === selectedLoss) || null}
                    onChange={handleLossChange}
                    isSearchable={false}
                    prefix="Top"
                  />
                </div>
                <DataGrid 
                    className="hurrican-grid"
                    domLayout={'normal'}
                    height={isMobile ? 500 : '95%'}
                    isSummaryGrid={false}
                    suppressStatusBar={true}
                    suppressFloatingFilter={true}
                    columnDefs={lossColDefs}
                    rowData={topLosers}
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
