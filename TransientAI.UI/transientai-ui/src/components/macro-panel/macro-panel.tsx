import React, {useState, useRef, useEffect} from 'react';
import { useMacroPanelDataStore } from "@/services/macro-panel-data/macro-panel-data-store";
import {DataGrid} from "@/components/data-grid";
import { CellDoubleClickedEvent, DomLayoutType } from 'ag-grid-community';
import {CustomGroupCellRenderer} from "@/components/macro-panel/customGroupCellRenderer";
import {Instrument, marketDataService} from "@/services/market-data";
import * as Dialog from '@radix-ui/react-dialog';
import {Cross1Icon} from "@radix-ui/react-icons";
import {MarketDataTile} from "@/components/market-data/market-data-tile";
import {
    equityFuturesColumnDefs, fxColumnDefs, treasuryColumnDefs, cryptoColumnDefs,
    handleDataRendered, groupRowRendererParams, getRowHeight, getEquityFuturesRowHeight,
    fxGridOptions, treasuryGridOptions, equityFuturesGridOptions, cryptoGridOptions
} from './macro-panel-config';
import { useMediaQuery } from 'react-responsive'
import styles from './macro-panel.module.scss';

export function MacroPanel() {
    const { treasuryYields, fxRates, cryptos, equityFutures, isTreasuryLoading, isFxLoading, isCryptoLoading, isEquityFuturesLoading } = useMacroPanelDataStore();
    const [open, setOpen] = useState(false);
    const [instrument, setInstrument] = useState<Instrument|null>(null);
    const isMobile = useMediaQuery({
        query: '(max-width: 768px)'
    });
    const [domLayout, setDomLayout] = useState<DomLayoutType>(isMobile ? 'autoHeight' : 'normal');

    useEffect(() => {
        setDomLayout(isMobile ? 'autoHeight' : 'normal');
    }, [isMobile]);

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

    return (
      <div>
        <div className="sub-header">Morning Report: Generated {new Date(new Date().setHours(6, 0, 0)).toLocaleString()}</div>
        <div className={`${styles['macro-panel']}`}>
            <div className={styles['left_panel']}>
                <div className={styles['equity-futures-container']}>
                    <DataGrid
                        height={300}
                        domLayout={domLayout}
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
                        getRowHeight={getEquityFuturesRowHeight}
                        onFirstDataRendered={handleDataRendered}
                    />
                </div>
                <div className={styles['fx-container']}>
                    <div className="sub-header">FX Moves</div>
                    <div className="sub-header">Change from the close</div>
                    <DataGrid
                        height={200}
                        domLayout={domLayout}
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
                        onFirstDataRendered={handleDataRendered}
                        onCellDoubleClicked={handleCellDoubleClicked}
                    />
                </div>
            </div>
            <div className={styles['yields-container']}>
                <div className="sub-header">Yield Curve Changes</div>
                <div className="sub-header">Mid Yields</div>
                <DataGrid
                    height={500}
                    domLayout={domLayout}
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
                    onFirstDataRendered={handleDataRendered}
                />
            </div>
            <div className={styles['crypto-container']}>
                <div className="sub-header">Crypto</div>
                <div className="sub-header">Change from the close</div>
                <DataGrid
                    height={400}
                    domLayout={domLayout}
                    isSummaryGrid={false}
                    suppressStatusBar={true}
                    suppressFloatingFilter={true}
                    rowData={cryptos}
                    columnDefs={cryptoColumnDefs}
                    loading={isCryptoLoading}
                    getRowHeight={getRowHeight}
                    gridOptions={cryptoGridOptions}
                    onFirstDataRendered={handleDataRendered}
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