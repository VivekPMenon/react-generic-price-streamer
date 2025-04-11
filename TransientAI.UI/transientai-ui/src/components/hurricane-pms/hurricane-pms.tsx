import React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDeviceType } from "@/lib/hooks";
import styles from "./hurricane-pms.module.scss";
import { DataGrid } from "@/components/data-grid";
import {
  columnDefs,
  defaultGridOptions,
  managerDetailsColDefs,
  profitColDefs,
  lossColDefs,
  managerPositionColDefs
} from "./hurricane-pms-config";
import {
  managers,
  manager_detail,
  top_gainers,
  managerPositions
} from "./pms_mock_data";
import { IManager } from "./model";
import AssetAllocationChart from "./pms-charts";
import WorldMapChart from "./geographic-map";
import BarChart from "./issue-explorer-chart";
import { TaTabs, TaDropDown } from '../shared'
import { Spinner } from "@radix-ui/themes";

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

const sortOptions = [
  { value: 'pl', label: 'P&L' },
  { value: 'pl_bps', label: 'PLBPs' },
];

const tabsConfig = [
  {
    value: "positions",
    label: "POSITIONS",
  },
  {
    value: "orders-traders",
    label: "ORDERS/TRADES",
  }
];

export const HurricanePms = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [managerId, setManagerId] = useState<string>('all');
    const [managerDetails, setManagerDetails] = useState<any[]>([]);
    const [managerPositionDetails, setManagerPositionDetails] = useState<any[]>([]);
    const [selectedProfit, setSelectedProfit] = useState<string>('10');
    const [selectedLoss, setSelectedLoss] = useState<string>('10');
    const [gainersSort, setGainersSort] = useState<string>('pl');
    const [losersSort, setLosersSort] = useState<string>('pl');
    const [topGainers, setTopGainers] = useState<any[]>([]);
    const [topLosers, setTopLosers] = useState<any[]>([]);
    const managerDetailsRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState("positions");
    const deviceType = useDeviceType();
    const isMobile = deviceType !== 'desktop';
    const MemoizedDataGrid = React.memo(DataGrid);

    const handleOnRowClicked = (event: any) => {
        const selectedRow = event.data;
        setManagerId(selectedRow.id.toString());
        managerDetailsRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleTabChange = (value: string) => {
      setActiveTab(value);
    };

    const getRecords = (
      data: any[],
      count: number,
      key: string,
      ascending: boolean = false
    ): any[] => {
      if (!data || !Array.isArray(data) || data.length === 0) {
        return [];
      }
      
      return data
        .slice()
        .sort((a, b) => {
          const valueA = a[key] as number;
          const valueB = b[key] as number;
          
          if (ascending) {
            return valueA - valueB;  
          } else {
            return valueB - valueA; 
          }
        })
        .slice(0, count);
    };
    
    useEffect(() => {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
      }, 2000)
      try {
        const details = managerId === 'all' 
          ? Object.values(manager_detail).flat()
          : manager_detail[managerId as keyof typeof manager_detail] || [];
        setManagerDetails(Array.isArray(details) ? details : []);
        
        const managerPositionDetail = managerId === 'all' 
        ? Object.values(managerPositions).flat()
        : managerPositions[managerId as keyof typeof managerPositions] || [];
        setManagerPositionDetails(Array.isArray(managerPositionDetail) ? managerPositionDetail : []);

        // Process top gainers/losers
        const allGainersData = Object.values(top_gainers).flat();
        const selectedManager = managers.find(m => m.id.toString() === managerId);
        const managerName = selectedManager?.name || '';
        
        let filteredData = allGainersData;
        if (managerId !== 'all' && managerName) {
          filteredData = allGainersData.filter(item => 
            item.portfolio_manager === managerName
          );
        }
        
        setTopGainers(getRecords(filteredData, parseInt(selectedProfit), gainersSort, false));
        setTopLosers(getRecords(filteredData, parseInt(selectedLoss), losersSort, true));
      } catch (error) {
        console.error("Error processing data:", error);
        setManagerDetails([]);
        setTopGainers([]);
        setTopLosers([]);
      } finally {
        // setIsLoading(false);
      }
    }, [managerId, selectedProfit, selectedLoss, gainersSort, losersSort]);

// Use these memoized versions in your grids
    const handleManagerChange = (selectedOption: { value: string; label: string } | null) => {
      if (selectedOption) {
        setManagerId(selectedOption.value);
        managerDetailsRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    };

    const handleProfitChange = (selectedOption: { value: string; label: string } | null) => {
      if (selectedOption) {
        setSelectedProfit(selectedOption.value);
      }
    };
  
    const handleLossChange = (selectedOption: { value: string; label: string } | null) => {
      if (selectedOption) {
        setSelectedLoss(selectedOption.value);
      }
    };

    const handleGainersSortChange = (selectedOption: { value: string; label: string } | null) => {
      if (selectedOption) {
        setGainersSort(selectedOption.value);
      }
    };

    const handleLosersSortChange = (selectedOption: { value: string; label: string } | null) => {
      if (selectedOption) {
        setLosersSort(selectedOption.value);
      }
    };

    const gridOptions = useMemo(() => ({
        ...defaultGridOptions,
        onRowClicked: handleOnRowClicked,
        rowClassRules: {
          'ag-row-even': (params: any) => params.node.rowIndex % 2 === 0,
          'ag-row-odd': (params: any) => params.node.rowIndex % 2 !== 0
        },
      }), []);

      if(isLoading){
        return <div className="absolute top-1/2 left-1/2 ">
             <Spinner size={"3"} />
        </div>
      }

  return (
    <div className={`${styles["hurricane-pms"]} scrollable-div gap-4`}>
      <section className="flex h-[600px] gap-4">
        <div className="w-[80%] flex gap-8">
          <section className="w-[60%]">
            <div className="inline-block min-w-44">
              <TaDropDown
                options={PortfolioSelectOptions}
                value={
                  PortfolioSelectOptions.find((m) => m.value === managerId) ||
                  null
                }
                onChange={handleManagerChange}
                isSearchable={true}
                prefix="Portfolio"
              />
            </div>

            <MemoizedDataGrid
              className="hurrican-grid"
              domLayout={"normal"}
              height={isMobile ? 500 : "95%"}
              isSummaryGrid={false}
              suppressScrollOnNewData={true}
              suppressStatusBar={true}
              suppressFloatingFilter={false}
              columnDefs={columnDefs}
              rowData={
                managerId === "all"
                  ? managers
                  : managers.filter(
                      (manager) => manager.id.toString() === managerId
                    )
              }
              gridOptions={{
                ...gridOptions,
                pinnedTopRowData: [
                  managers.reduce((totals, row) => {
                    Object.keys(row).forEach((key) => {
                      const typedKey = key as keyof IManager;
                      const value = row[typedKey];

                      if (typeof value === "number") {
                        const currentTotal = (totals[typedKey] ?? 0) as number;
                        totals[typedKey] = currentTotal + value;
                      }
                    });

                    totals.name = "Total";
                    return totals;
                  }, {} as Partial<any>),
                ],
                getRowClass: (params) => {
                  if (params.node.rowPinned === "top") {
                    return styles["pinned-top-row"];
                  }
                  return "";
                },
              }}
              loading={isLoading}
            />
          </section>
          <section className="w-[40%]">
            <div className="h-[45%]">
              <div className="flex gap-2">
                <div className="inline-block min-w-10">
                  <TaDropDown
                    options={topProfitOption}
                    value={
                      topProfitOption.find((p) => p.value === selectedProfit) ||
                      null
                    }
                    onChange={handleProfitChange}
                    isSearchable={false}
                    prefix="Top"
                  />
                </div>
                <div className="inline-block min-w-20">
                  <TaDropDown
                    options={sortOptions}
                    value={
                      sortOptions.find((s) => s.value === gainersSort) || null
                    }
                    onChange={handleGainersSortChange}
                    isSearchable={false}
                    prefix="Sort"
                  />
                </div>
              </div>
              <MemoizedDataGrid
                className="hurrican-grid"
                domLayout={"normal"}
                height={isMobile ? 500 : "95%"}
                isSummaryGrid={false}
                suppressScrollOnNewData={true}
                suppressStatusBar={true}
                suppressFloatingFilter={true}
                columnDefs={profitColDefs}
                rowData={topGainers}
                gridOptions={{
                  ...defaultGridOptions,
                  getRowId: (params) => {
                    return `gain-${params.data.portfolio_manager}-${params.data.security}`;
                  },
                }}
                loading={isLoading}
              />
            </div>
            <div className="h-[45%] mt-10">
              <div className="flex gap-2">
                <div className="inline-block min-w-10">
                  <TaDropDown
                    options={topLossOption}
                    value={
                      topLossOption.find((l) => l.value === selectedLoss) ||
                      null
                    }
                    onChange={handleLossChange}
                    isSearchable={false}
                    prefix="Top"
                  />
                </div>
                <div className="inline-block min-w-20">
                  <TaDropDown
                    options={sortOptions}
                    value={
                      sortOptions.find((s) => s.value === losersSort) || null
                    }
                    onChange={handleLosersSortChange}
                    isSearchable={false}
                    prefix="Sort"
                  />
                </div>
              </div>
              <MemoizedDataGrid
                className="hurrican-grid"
                domLayout={"normal"}
                height={isMobile ? 500 : "95%"}
                isSummaryGrid={false}
                suppressScrollOnNewData={true}
                suppressStatusBar={true}
                suppressFloatingFilter={true}
                columnDefs={lossColDefs}
                rowData={topLosers}
                gridOptions={{
                  ...defaultGridOptions,
                  getRowId: (params) => {
                    return `loss-${params.data.portfolio_manager}-${params.data.security}`;
                  },
                }}
                loading={isLoading}
              />
            </div>
          </section>
        </div>

        <div className="">
          <div className="rounded-md p-2 h-[250px] w-[350px]">
            <h4 className="text-white text-center mb-2">Asset Allocation</h4>
            <AssetAllocationChart data={activeTab === 'positions' ? managerPositionDetails : managerDetails} />
          </div>
          <div className="rounded-md p-2 h-[250px]  w-[350px]">
            <h4 className="text-white text-center mb-2">
              Geographic Exposure map
            </h4>
            <WorldMapChart data={activeTab === 'positions' ? managerPositionDetails : managerDetails} />
          </div>
        </div>
      </section>

      <section className="flex h-[600px] gap-4 mt-5">
        <div className="w-[80%]" ref={managerDetailsRef}>
          <TaTabs
            tabs={tabsConfig}
            onTabChange={handleTabChange}
            defaultTab="positions"
            value={activeTab}
            className="inline-block"
          />
          {activeTab == "positions" ? (
            <MemoizedDataGrid
              className="hurrican-grid"
              domLayout={"normal"}
              height={isMobile ? 500 : "95%"}
              isSummaryGrid={false}
              suppressScrollOnNewData={true}
              suppressStatusBar={true}
              suppressFloatingFilter={false}
              columnDefs={managerPositionColDefs}
              rowData={managerPositionDetails}
              gridOptions={{
                ...defaultGridOptions,
                rowClassRules: {
                  "ag-row-even1": (params: any) =>
                    params.node.rowIndex % 2 === 0,
                  "ag-row-odd": (params: any) => params.node.rowIndex % 2 !== 0,
                },
                pinnedTopRowData: [
                  managerPositionDetails.reduce((totals, row) => {
                    const positionValue = row.market_value || 0;
                    totals.market_value = (totals.market_value || 0) + positionValue;
                    // totals.name = "Total"; // Add a label for the "name" column
                  return totals;
                  }, {} as Partial<any>),
                ],
                getRowClass: (params) => {
                  if (params.node.rowPinned === "top") {
                    return styles["pinned-top-row"];
                  }
                  return "";
                },
                getRowId: (params) => {
                  return `detail-${
                    params.data.id || params.data.security || params.data.ticker
                  }`;
                },
              }}
              loading={isLoading}
            />
          ) : (
            <MemoizedDataGrid
              className="hurrican-grid"
              domLayout={"normal"}
              height={isMobile ? 500 : "95%"}
              isSummaryGrid={false}
              suppressScrollOnNewData={true}
              suppressStatusBar={true}
              suppressFloatingFilter={false}
              columnDefs={managerDetailsColDefs}
              rowData={managerDetails}
              gridOptions={{
                ...defaultGridOptions,
                pinnedTopRowData: [
                  managerDetails.reduce((totals, row) => {
                    const positionValue = row.market_value || 0;
                    totals.market_value = (totals.market_value || 0) + positionValue;
                    // totals.name = "Total"; // Add a label for the "name" column
                  return totals;
                  }, {} as Partial<any>),
                ],
                getRowClass: (params) => {
                  if (params.node.rowPinned === "top") {
                    return styles["pinned-top-row"];
                  }
                  return "";
                },
                // getRowId: (params) => {
                //   return `detail-${
                //     params.data.id || params.data.security || params.data.ticker
                //   }`;
                // },
              }}
              loading={isLoading}
            />
          )}
        </div>

        <div className="rounded-md p-2 h-[500px] w-[350px]">
          <h4 className="text-white text-center mb-2">Manager Exposure</h4>
          <BarChart data={activeTab === 'positions' ? managerPositionDetails : managerDetails} />
        </div>
      </section>
    </div>
  );
};