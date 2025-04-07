import React, { useMemo, useState, memo } from 'react';
import { Spinner, Tabs } from '@radix-ui/themes';
import { useMacroPanelDataStore } from "@/services/macro-panel-data/macro-panel-data-store";
import styles from './macro-panel-tabs.module.scss';
import MacroPanelTab from "@/components/macro-panel/macro-panel-tab";
import * as Dialog from "@radix-ui/react-dialog";
import { MarketDataTile } from "@/components/market-data/market-data-tile";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Instrument, marketDataService, PeriodType } from "@/services/market-data";
import { useDeviceType } from "@/lib/hooks";
import { MarketDataType } from "@/services/macro-panel-data/model";
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import i18n from '../../i18n';

function MacroPanelTabs() {
    const { t } = useTranslation(); // Get the translation function
    const { reportGenerationDate, treasuryYields, fxRates, cryptos, equityFutures, isTreasuryLoading, isFxLoading, isCryptoLoading, isEquityFuturesLoading } = useMacroPanelDataStore();
    const [open, setOpen] = useState(false);
    const [instrument, setInstrument] = useState<Instrument | null>(null);
    const deviceType = useDeviceType();

    function showPopup(symbol: string, type?: MarketDataType, instrument_?: Instrument) {
        if (symbol) {
            setOpen(true);
            marketDataService
                .getMarketData(symbol, PeriodType.ONE_YEAR, type)
                .then(data => {
                    if (data) {
                        if (instrument_ && instrument_.marketData?.length) {
                            if (data.marketData) {
                                data.marketData.push(...instrument_.marketData);
                                data.marketData.sort((a, b) => (a.timestamp?.getTime() ?? 0) - (b.timestamp?.getTime() ?? 0));
                            } else {
                                data.marketData = [];
                            }
                        }
                        setInstrument(data);
                    }
                })
                .catch(() => {
                    setInstrument(instrument_ ?? null);
                    setOpen(false);
                });
        }
    }

    function handleOpenChange(open: boolean) {
        setOpen(open);
        if (!open) {
            setInstrument(null);
        }
    }

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
                    <hr className={styles['divider']} />
                    <div className={`${styles['section-header']} sub-header`}>
                        {i18n.t('Global_Equity_Index_Futures')}
                    </div>
                    {isEquityFuturesLoading
                        ? <Spinner />
                        : (
                            <Tabs.Root defaultValue={groupedEquityFutures?.length ? groupedEquityFutures[0][0] : undefined}>
                                <Tabs.List className={`${styles['tab-list']} ${isMobile ? 'horizontal-scrollable-div' : ''}`}>
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
                                        />
                                    </Tabs.Content>
                                ))}
                            </Tabs.Root>
                        )}
                </div>

                <div className={styles['yields-container']}>
                    <hr className={styles['divider']} />
                    <div className={`${styles['section-header']} sub-header`}>
                        {i18n.t('Rates_Yield')}
                    </div>
                    {isTreasuryLoading
                        ? <Spinner />
                        : (
                            <Tabs.Root defaultValue={groupedYields?.find(groups => groups[0] === 'Notes/Bonds')?.[0] ?? (groupedYields?.length ? groupedYields[0][0] : undefined)}>
                                <Tabs.List className={`${styles['tab-list']} ${isMobile ? 'horizontal-scrollable-div' : ''}`}>
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
                    <hr className={styles['divider']} />
                    <div className={`${styles['section-header']} sub-header`}>
                        {i18n.t('FX')}
                    </div>
                    {isFxLoading
                        ? <Spinner />
                        : (
                            <Tabs.Root defaultValue={groupedFx?.length ? groupedFx[0][0] : undefined}>
                                <Tabs.List className={`${styles['tab-list']} ${isMobile ? 'horizontal-scrollable-div' : ''}`}>
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
                    <hr className={styles['divider']} />
                    <div className={`${styles['section-header']} sub-header`}>
                        {i18n.t('Crypto')}
                    </div>
                    {isCryptoLoading
                        ? <Spinner />
                        : (
                            <Tabs.Root defaultValue={groupedCrypto?.length ? groupedCrypto[0][0] : undefined}>
                                <Tabs.List className={`${styles['tab-list']} ${isMobile ? 'horizontal-scrollable-div' : ''}`}>
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
                    <hr className={styles['div  ider']} />
                </div>
            </div>
            <Dialog.Root open={open} onOpenChange={handleOpenChange}>
                <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay" />
                    <Dialog.Content className={styles['dialog']}>
                        <Dialog.Title />
                        <Dialog.Description />
                        <div className={styles['dialog-content']}>
                            {
                                instrument
                                    ? <MarketDataTile
                                        instrument={instrument}
                                        showFinancialData={false}
                                        showPriceSummary={false}
                                        className={styles['market-data-graph-popup']}
                                        ignoreNegative={false}
                                        isNegative={instrument.change < 0.0}
                                    />
                                    : <div className={styles['dialog-loading']}>{i18n.t('Loading')}</div> // Example of adding a translation for "Loading"
                            }
                        </div>
                        <div className={styles['dialog-close']}>
                            <Dialog.DialogClose asChild>
                                <Cross1Icon />
                            </Dialog.DialogClose>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
}

export default memo(MacroPanelTabs);
