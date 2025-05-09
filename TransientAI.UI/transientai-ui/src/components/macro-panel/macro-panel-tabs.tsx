import React, {useMemo, useState, memo, useCallback} from 'react';
import { Spinner, Tabs } from '@radix-ui/themes';
import { macroPanelDataStore } from "@/services/macro-panel-data/macro-panel-data-store";
import styles from './macro-panel-tabs.module.scss';
import MacroPanelTab from "@/components/macro-panel/macro-panel-tab";
import * as Dialog from "@radix-ui/react-dialog";
import {MarketDataTile} from "@/components/market-data/market-data-tile";
import {Cross1Icon} from "@radix-ui/react-icons";
import {Instrument, MarketData, marketDataService, PeriodType} from "@/services/market-data";
import {useDeviceType} from "@/lib/hooks";
import {MarketDataType} from "@/services/macro-panel-data/model";
import i18n from '../../i18n';

function MacroPanelTabs() {
    const [open, setOpen] = useState(false);
    const [isLoadingMarketData, setIsLoadingMarketData] = useState(false);
    const [instrument, setInstrument] = useState<Instrument | null>(null);
    const deviceType = useDeviceType();

    const reportGenerationDate = macroPanelDataStore.use.reportGenerationDate();
    const setReportGenerationDate = macroPanelDataStore.use.setReportGenerationDate();
    const treasuryYields = macroPanelDataStore.use.treasuryYields();
    const fxRates = macroPanelDataStore.use.fxRates();
    const cryptos = macroPanelDataStore.use.cryptos();
    const equityFutures = macroPanelDataStore.use.equityFutures();
    const isTreasuryLoading = macroPanelDataStore.use.isTreasuryLoading();
    const isFxLoading = macroPanelDataStore.use.isFxLoading();
    const isCryptoLoading = macroPanelDataStore.use.isCryptoLoading();
    const isEquityFuturesLoading = macroPanelDataStore.use.isEquityFuturesLoading();

    const showPopup = useCallback((symbol: string, type?: MarketDataType, marketData?: MarketData[]) => {
        if (symbol) {
            setIsLoadingMarketData(true);
            setOpen(true);

            marketDataService
                .getMarketData(symbol, PeriodType.ONE_YEAR, type)
                .then(data => {
                    if (data) {
                        if (!data.marketData) {
                            data.marketData = [];
                        }
                    }
                    setInstrument(data);
                    // if (data) {
                    //     if (marketData?.length) {
                    //         if (data.marketData) {
                    //             data.marketData.push(...marketData);
                    //         } else {
                    //             data.marketData = [];
                    //         }
                    //     }
                    //     data.type = type;
                    //     setInstrument(data);
                    // } else {
                    //     setInstrument(data);
                    // }
                })
                .catch(() => {
                    setInstrument(null);
                    setOpen(false);
                })
                .finally(() => {
                    setIsLoadingMarketData(false);
                });
        }
    }, []);

    const handleOpenChange = useCallback((open: boolean) => {
        setOpen(open);
        if (!open) {
            setInstrument(null);
        }
    }, []);

    const isMobile = deviceType !== 'desktop';
    const groupedEquityFutures = useMemo(() => [...Map.groupBy(equityFutures, item => item.group_name).entries()], [equityFutures]);
    const groupedYields = useMemo(() => [...Map.groupBy(treasuryYields, item => item.group_name).entries()], [treasuryYields]);
    const groupedFx = useMemo(() => [...Map.groupBy(fxRates, item => item.group_name).entries()], [fxRates]);
    const groupedCrypto = useMemo(() => [...Map.groupBy(cryptos, item => item.group_name).entries()], [cryptos]);

    return (
        <div>
            <div className={`${styles['header']} sub-header`}>
                {`${i18n.t('Macro_Report_Generated')}: ${reportGenerationDate?.toLocaleString() ?? ''}`}
            </div>
            <div className={`${styles['macro-panel']} scrollable-div`}>
                <div className={styles['equity-futures-container']}>
                    <hr className={styles['divider']}/>
                    <div className={`${styles['section-header']} sub-header`}>
                        {i18n.t('Global_Equity_Index_Futures')}
                    </div>
                    {isEquityFuturesLoading
                        ? <Spinner/>
                        : (
                            <Tabs.Root
                                defaultValue={groupedEquityFutures?.length ? groupedEquityFutures[0][0] : undefined}>
                                <Tabs.List
                                    className={`${styles['tab-list']} ${isMobile ? 'horizontal-scrollable-div' : ''}`}>
                                    {groupedEquityFutures.map(ef => (
                                        <Tabs.Trigger key={ef[0]} value={ef[0] || 'Untitled'}>
                                            <span className={styles['instrument-group-tab']}>{ef[0]}</span>
                                        </Tabs.Trigger>
                                    ))}
                                </Tabs.List>
                                {groupedEquityFutures.map(ef => (
                                    <Tabs.Content key={ef[0]} value={ef[0]}>
                                        <MacroPanelTab
                                            instruments={ef[1]}
                                            showCharts={true}
                                            showPopupAction={showPopup}
                                            inverseChange={false}
                                            setReportGenerationDate={setReportGenerationDate}
                                        />
                                    </Tabs.Content>
                                ))}
                            </Tabs.Root>
                        )}
                </div>

                <div className={styles['yields-container']}>
                    <hr className={styles['divider']}/>
                    <div className={`${styles['section-header']} sub-header`}>
                        {i18n.t('Rates_Yield')}
                    </div>
                    {isTreasuryLoading
                        ? <Spinner/>
                        : (
                            <Tabs.Root
                                defaultValue={groupedYields?.find(groups => groups[0] === 'Notes/Bonds')?.[0] ?? (groupedYields?.length ? groupedYields[0][0] : undefined)}>
                                <Tabs.List
                                    className={`${styles['tab-list']} ${isMobile ? 'horizontal-scrollable-div' : ''}`}>
                                    {groupedYields.map(y => (
                                        <Tabs.Trigger key={y[0]} value={y[0] || 'Untitled'}>
                                            <span className={styles['instrument-group-tab']}>{y[0]}</span>
                                        </Tabs.Trigger>
                                    ))}
                                </Tabs.List>
                                {groupedYields.map(y => (
                                    <Tabs.Content key={y[0]} value={y[0]}>
                                        <MacroPanelTab
                                            instruments={y[1]}
                                            showCharts={true}
                                            showPopupAction={showPopup}
                                            changeSuffix={' bps'}
                                            inverseChange={true}
                                        />
                                    </Tabs.Content>
                                ))}
                            </Tabs.Root>
                        )}
                </div>

                <div className={styles['fx-container']}>
                    <hr className={styles['divider']}/>
                    <div className={`${styles['section-header']} sub-header`}>
                        {i18n.t('FX')}
                    </div>
                    {isFxLoading
                        ? <Spinner/>
                        : (
                            <Tabs.Root defaultValue={groupedFx?.length ? groupedFx[0][0] : undefined}>
                                <Tabs.List
                                    className={`${styles['tab-list']} ${isMobile ? 'horizontal-scrollable-div' : ''}`}>
                                    {groupedFx.map(fx => (
                                        <Tabs.Trigger key={fx[0]} value={fx[0] || 'Untitled'}>
                                            <span className={styles['instrument-group-tab']}>{fx[0]}</span>
                                        </Tabs.Trigger>
                                    ))}
                                </Tabs.List>
                                {groupedFx.map(fx => (
                                    <Tabs.Content key={fx[0]} value={fx[0]}>
                                        <MacroPanelTab
                                            instruments={fx[1]}
                                            showCharts={true}
                                            showPopupAction={showPopup}
                                            inverseChange={false}
                                        />
                                    </Tabs.Content>
                                ))}
                            </Tabs.Root>
                        )}
                </div>

                <div className={styles['crypto-container']}>
                    <hr className={styles['divider']}/>
                    <div className={`${styles['section-header']} sub-header`}>
                        {i18n.t('Crypto')}
                    </div>
                    {isCryptoLoading
                        ? <Spinner/>
                        : (
                            <Tabs.Root defaultValue={groupedCrypto?.length ? groupedCrypto[0][0] : undefined}>
                                <Tabs.List
                                    className={`${styles['tab-list']} ${isMobile ? 'horizontal-scrollable-div' : ''}`}>
                                    {groupedCrypto.map(c => (
                                        <Tabs.Trigger key={c[0]} value={c[0] || 'Untitled'}>
                                            <span className={styles['instrument-group-tab']}>{c[0]}</span>
                                        </Tabs.Trigger>
                                    ))}
                                </Tabs.List>
                                {groupedCrypto.map(c => (
                                    <Tabs.Content key={c[0]} value={c[0]}>
                                        <MacroPanelTab
                                            instruments={c[1]}
                                            showCharts={true}
                                            showPopupAction={showPopup}
                                        />
                                    </Tabs.Content>
                                ))}
                            </Tabs.Root>
                        )}
                    <hr className={styles['div  ider']}/>
                </div>
            </div>
            <Dialog.Root open={open} onOpenChange={handleOpenChange}>
                <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay"/>
                    <Dialog.Content className={styles['dialog']}>
                        <Dialog.Title/>
                        <Dialog.Description/>
                        <div className={styles['dialog-content']}>
                            {
                                isLoadingMarketData
                                    ? <div className={styles['dialog-message']}>{i18n.t('Loading')}</div>
                                    : instrument
                                        ? <MarketDataTile
                                            instrument={instrument!}
                                            showFinancialData={false}
                                            showPriceSummary={false}
                                            className={styles['market-data-graph-popup']}
                                            ignoreNegative={false}
                                            isNegative={instrument!.change < 0.0}
                                        />
                                        : <div className={styles['dialog-message']}>{i18n.t('NoDataFound')}</div>
                            }
                        </div>
                        <div className={styles['dialog-close']}>
                            <Dialog.DialogClose>
                                <Cross1Icon/>
                            </Dialog.DialogClose>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
}

export default memo(MacroPanelTabs);
