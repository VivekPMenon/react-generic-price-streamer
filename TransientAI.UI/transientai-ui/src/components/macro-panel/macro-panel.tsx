import React, {useState} from 'react';
import { useMacroPanelDataStore } from "@/services/macro-panel-data/macro-panel-data-store";
import {DataGrid} from "@/components/data-grid";
import { CellDoubleClickedEvent } from 'ag-grid-community';
import {CustomGroupCellRenderer} from "@/components/macro-panel/customGroupCellRenderer";
import {Instrument, marketDataService} from "@/services/market-data";
import * as Dialog from '@radix-ui/react-dialog';
import {Cross1Icon} from "@radix-ui/react-icons";
import {MarketDataTile} from "@/components/market-data/market-data-tile";
import {
    equityFuturesColumnDefs, fxColumnDefs, treasuryColumnDefs, cryptoColumnDefs,
    handleGridSizeChanged, handleFirstDataRendered, groupRowRendererParams, getRowHeight,
    getLargerRowHeight, fxGridOptions, treasuryGridOptions, equityFuturesGridOptions, cryptoGridOptions
} from './macro-panel-config';
import styles from './macro-panel.module.scss';
import {useDeviceType} from "@/lib/hooks";

export function MacroPanel() {
    const { reportGenerationDate, treasuryYields, fxRates, cryptos, equityFutures, isTreasuryLoading, isFxLoading, isCryptoLoading, isEquityFuturesLoading } = useMacroPanelDataStore();
    const [open, setOpen] = useState(false);
    const [instrument, setInstrument] = useState<Instrument|null>(null);
    const deviceType = useDeviceType();
    function handleCellDoubleClicked(params: CellDoubleClickedEvent) {
        if (params.colDef.field === 'name') {
            setOpen(true);
            marketDataService.getMarketData(params.data.name)
                .then(data => {
                    if (data) {
                        setInstrument(data);
                    }
                })
        }
    }

    function handleOpenChange(open: boolean) {
        setOpen(open);
        if (!open) {
            setInstrument(null);
        }
    }

    const isMobile = deviceType !== 'desktop';

    return (
      <div>
        <div className={`${styles['header']} sub-header`}>Macro Report: Generated {reportGenerationDate?.toLocaleString() ?? ''}</div>
        <div className={`${styles['macro-panel']}`}>
            <div className={styles['left_panel']}>
                <div className={styles['equity-futures-container']}>
                    <DataGrid
                        domLayout={isMobile ? 'autoHeight' : 'normal'}
                        height={isMobile ? undefined : '100%'}
                        isSummaryGrid={false}
                        suppressStatusBar={true}
                        suppressFloatingFilter={true}
                        rowData={equityFutures}
                        columnDefs={equityFuturesColumnDefs}
                        loading={isEquityFuturesLoading}
                        gridOptions={equityFuturesGridOptions}
                        groupDisplayType={'groupRows'}
                        groupRowRendererParams={groupRowRendererParams}
                        groupRowRenderer={CustomGroupCellRenderer}
                        groupDefaultExpanded={1}
                        getRowHeight={getLargerRowHeight}
                        onGridSizeChanged={handleGridSizeChanged}
                        onFirstDataRendered={handleFirstDataRendered}
                    />
                </div>
                <div className={styles['fx-container']}>
                    <div className={`${styles['header']} sub-header`}>FX Moves</div>
                    <div className={`${styles['header']} sub-header`}>Change from the close</div>
                    <DataGrid
                        domLayout={isMobile ? 'autoHeight' : 'normal'}
                        height={isMobile ? undefined : '80%'}
                        isSummaryGrid={false}
                        suppressStatusBar={true}
                        suppressFloatingFilter={true}
                        rowData={fxRates}
                        columnDefs={fxColumnDefs}
                        loading={isFxLoading}
                        gridOptions={fxGridOptions}
                        groupDisplayType={'groupRows'}
                        groupRowRendererParams={groupRowRendererParams}
                        groupRowRenderer={CustomGroupCellRenderer}
                        groupDefaultExpanded={1}
                        getRowHeight={getRowHeight}
                        onCellDoubleClicked={handleCellDoubleClicked}
                        onGridSizeChanged={handleGridSizeChanged}
                        onFirstDataRendered={handleFirstDataRendered}
                    />
                </div>
            </div>
            <div className={styles['yields-container']}>
                <div className={`${styles['header']} sub-header`}>Yield Curve Changes</div>
                <div className={`${styles['header']} sub-header`}>Closing Yields Delayed T-2</div>
                <DataGrid
                    domLayout={isMobile ? 'autoHeight' : 'normal'}
                    height={isMobile ? undefined : 575}
                    isSummaryGrid={false}
                    suppressStatusBar={true}
                    suppressFloatingFilter={true}
                    rowData={treasuryYields}
                    columnDefs={treasuryColumnDefs}
                    loading={isTreasuryLoading}
                    gridOptions={treasuryGridOptions}
                    groupDisplayType={'groupRows'}
                    groupRowRendererParams={groupRowRendererParams}
                    groupRowRenderer={CustomGroupCellRenderer}
                    groupDefaultExpanded={1}
                    getRowHeight={getRowHeight}
                    onGridSizeChanged={handleGridSizeChanged}
                    onFirstDataRendered={handleFirstDataRendered}
                />
            </div>
            <div className={styles['crypto-container']}>
                <div className={`${styles['header']} sub-header`}>Crypto</div>
                <div className={`${styles['header']} sub-header`}>Change from the close</div>
                <DataGrid
                    domLayout={isMobile ? 'autoHeight' : 'normal'}
                    height={isMobile ? undefined : 575}
                    isSummaryGrid={false}
                    suppressStatusBar={true}
                    suppressFloatingFilter={true}
                    rowData={cryptos}
                    columnDefs={cryptoColumnDefs}
                    loading={isCryptoLoading}
                    getRowHeight={getRowHeight}
                    gridOptions={cryptoGridOptions}
                    onGridSizeChanged={handleGridSizeChanged}
                    onFirstDataRendered={handleFirstDataRendered}
                />
            </div>

            <Dialog.Root open={open} onOpenChange={handleOpenChange}>
                <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay" />
                    <Dialog.Content className={styles['dialog']}>
                        <Dialog.Title />
                        <Dialog.Description />
                        <div className={styles['dialog-content']}>
                        {
                            instrument && (
                                <MarketDataTile
                                    instrument={instrument}
                                    showFinancialData={false}
                                    showPriceSummary={false}
                                    className={styles['market-data-graph']}
                                />
                           )
                        }
                        </div>
                        <div className={styles['dialog-close']}>
                            <Dialog.DialogClose asChild>
                                <Cross1Icon  />
                            </Dialog.DialogClose>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
      </div>
  );
}