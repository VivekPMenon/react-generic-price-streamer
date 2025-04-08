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
    const [managerDetails, setManagerDetails] = useState<any[]>([]);
    const [selectedProfit, setSelectedProfit] = useState<string>('10');
    const [selectedLoss, setSelectedLoss] = useState<string>('10');
    const [topGainers, setTopGainers] = useState<any[]>([]);
    const [topLosers, setTopLosers] = useState<any[]>([]);
    const managerDetailsRef = useRef<HTMLDivElement>(null);
    const deviceType = useDeviceType();
    const isMobile = deviceType !== 'desktop';

    const handleOnRowClicked = (event: any) => {
        const selectedRow = event.data;
        setManagerId(selectedRow.id.toString());
        managerDetailsRef.current?.scrollIntoView({ behavior: "smooth" });
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
      setIsLoading(true);
      
      try {
        if (managerId === 'all') {
          const allDetails = Object.values(manager_detail).flat();
          setManagerDetails(allDetails);
        } else {
          // For a specific manager, get details directly from the object using the manager ID
          const managerData = manager_detail[managerId as keyof typeof manager_detail];
          
          if (Array.isArray(managerData) && managerData.length > 0) {
            setManagerDetails(managerData);
          } else {
            // If no data found for this manager ID, set empty array
            console.warn(`No details found for manager ID: ${managerId}`);
            setManagerDetails([]);
          }
        }
      } catch (error) {
        console.error("Error loading manager details:", error);
        setManagerDetails([]);
      } finally {
        setIsLoading(false);
      }
    }, [managerId]);

    useEffect(() => {
      setIsLoading(true);
      
      try {
        // Get all manager data
        const allGainersData = Object.values(top_gainers).flat();
        
        // Find the selected manager's name based on ID
        const selectedManager = managers.find(m => m.id.toString() === managerId);
        const managerName = selectedManager?.name || '';
        
        // Filter data based on manager name if a specific manager is selected
        let filteredData = allGainersData;
        if (managerId !== 'all' && managerName) {
          filteredData = allGainersData.filter(item => 
            item.portfolio_manager === managerName
          );
        }
        
        // Get top gainers (highest pl values)
        const newTopGainers = getRecords(filteredData, parseInt(selectedProfit), 'pl', false);
        
        // Get top losers (lowest pl values)
        const newTopLosers = getRecords(filteredData, parseInt(selectedLoss), 'pl', true);
        
        setTopGainers(newTopGainers);
        setTopLosers(newTopLosers);
      } catch (error) {
        console.error("Error processing top gainers/losers:", error);
        setTopGainers([]);
        setTopLosers([]);
      } finally {
        setIsLoading(false);
      }
    }, [managerId, selectedProfit, selectedLoss]);

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
                    gridOptions={{
                      ...defaultGridOptions,
                      getRowId: (params) => {
                        return `gain-${params.data.portfolio_manager}-${params.data.security}`;
                      }
                    }}
                    loading={isLoading}
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
                    gridOptions={{
                      ...defaultGridOptions,
                      getRowId: (params) => {
                        return `loss-${params.data.portfolio_manager}-${params.data.security}`;
                      }
                    }}
                    loading={isLoading}
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
            gridOptions={{
              ...defaultGridOptions,
              getRowId: (params) => {
                return `detail-${params.data.id || params.data.security || params.data.ticker }`;
              }
            }}
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