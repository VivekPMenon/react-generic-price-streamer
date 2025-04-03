import React, {useMemo, useState} from 'react';
import {Spinner, Tabs} from '@radix-ui/themes';
import { useMacroPanelDataStore } from "@/services/macro-panel-data/macro-panel-data-store";
import styles from './macro-panel-tabs.module.scss';
import {MacroPanelTab} from "@/components/macro-panel/macro-panel-tab";
import * as Dialog from "@radix-ui/react-dialog";
import {MarketDataTile} from "@/components/market-data/market-data-tile";
import {Cross1Icon} from "@radix-ui/react-icons";
import {Instrument} from "@/services/market-data";
import {useDeviceType} from "@/lib/hooks";

export function MacroPanelTabs() {
    const { reportGenerationDate, treasuryYields, fxRates, cryptos, equityFutures, isTreasuryLoading, isFxLoading, isCryptoLoading, isEquityFuturesLoading } = useMacroPanelDataStore();
    const [open, setOpen] = useState(false);
    const [instrument, setInstrument] = useState<Instrument|null>(null);
    const deviceType = useDeviceType();

    function showPopup(instrument_: Instrument) {
        if (instrument_) {
            setOpen(true);
            setInstrument(instrument_);
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
            <div className={`${styles['header']} sub-header`}>Macro Report: Generated {reportGenerationDate?.toLocaleString() ?? ''}</div>
            <div className={`${styles['macro-panel']} scrollable-div`}>
                <div className={styles['equity-futures-container']}>
                    <hr className={styles['divider']} />
                    <div className={`${styles['section-header']} sub-header`}>Global Equity Index Futures and Indices</div>
                    {
                        isEquityFuturesLoading
                            ? <Spinner />
                            : (<Tabs.Root defaultValue={groupedEquityFutures?.length ? groupedEquityFutures[0][0] : undefined}>
                                    <Tabs.List className={`${styles['tab-list']} ${isMobile ? 'horizontal-scrollable-div' : ''}`}>
                                        {groupedEquityFutures.map(ef => (
                                                <Tabs.Trigger
                                                    key={ef[0]}
                                                    value={ef[0] || 'Untitled'}
                                                >
                                                    <span className={styles['instrument-group-tab']}>{ef[0]}</span>
                                                </Tabs.Trigger>
                                            )
                                        )}
                                    </Tabs.List>
                                    {groupedEquityFutures.map(ef => (
                                        <Tabs.Content
                                            key={ef[0]}
                                            value={ef[0]}
                                        >
                                            <MacroPanelTab
                                                instruments={ef[1]}
                                                showCharts={true}
                                                showPopupAction={showPopup}
                                                inverseChange={false}
                                            />
                                        </Tabs.Content>
                                    ))}
                                </Tabs.Root>
                            )
                    }
                </div>
                <div className={styles['yields-container']}>
                    <hr className={styles['divider']} />
                    <div className={`${styles['section-header']} sub-header`}>Rates (Yield)</div>
                    {
                        isTreasuryLoading
                        ? <Spinner />
                        : (<Tabs.Root defaultValue={groupedYields?.find(groups => groups[0] === 'Notes/Bonds')?.[0] ?? undefined}>
                                <Tabs.List className={`${styles['tab-list']} ${isMobile ? 'horizontal-scrollable-div' : ''}`}>
                                {
                                    groupedYields.map(y => (
                                            <Tabs.Trigger
                                                key={y[0]}
                                                value={y[0] || 'Untitled'}
                                            >
                                                <span className={styles['instrument-group-tab']}>{y[0]}</span>
                                            </Tabs.Trigger>
                                        ))
                                }
                            </Tabs.List>
                            {groupedYields.map(y => (
                                <Tabs.Content
                                    key={y[0]}
                                    value={y[0]}
                                >
                                    <MacroPanelTab
                                        instruments={y[1]}
                                        showCharts={true}
                                        showPopupAction={showPopup}
                                        changeSuffix={' bps'}
                                        inverseChange={true}
                                    />
                                </Tabs.Content>
                            ))}
                        </Tabs.Root>)
                    }
                </div>
                <div className={styles['fx-container']}>
                    <hr className={styles['divider']} />
                    <div className={`${styles['section-header']} sub-header`}>FX</div>
                    {
                        isFxLoading
                        ? <Spinner />
                            : (<Tabs.Root defaultValue={groupedFx?.length ? groupedFx[0][0] : undefined}>
                                <Tabs.List className={`${styles['tab-list']} ${isMobile ? 'horizontal-scrollable-div' : ''}`}>
                                    {
                                        groupedFx.map(fx => (
                                            <Tabs.Trigger
                                                key={fx[0]}
                                                value={fx[0] || 'Untitled'}
                                            >
                                                <span className={styles['instrument-group-tab']}>{fx[0]}</span>
                                            </Tabs.Trigger>
                                        ))
                                    }
                                </Tabs.List>
                                {groupedFx.map(fx => (
                                    <Tabs.Content
                                        key={fx[0]}
                                        value={fx[0]}
                                    >
                                        <MacroPanelTab
                                            instruments={fx[1]}
                                            showCharts={true}
                                            showPopupAction={showPopup}
                                            inverseChange={false}
                                        />
                                    </Tabs.Content>
                                ))}
                            </Tabs.Root>)
                    }
                </div>
                <div className={styles['crypto-container']}>
                    <hr className={styles['divider']} />
                    <div className={`${styles['section-header']} sub-header`}>Crypto</div>
                    {
                        isCryptoLoading
                            ? <Spinner />
                            : (<Tabs.Root defaultValue={groupedCrypto?.length ? groupedCrypto[0][0] : undefined}>
                                <Tabs.List className={`${styles['tab-list']} ${isMobile ? 'horizontal-scrollable-div' : ''}`}>
                                    {
                                        groupedCrypto.map(c => (
                                            <Tabs.Trigger
                                                key={c[0]}
                                                value={c[0] || 'Untitled'}
                                            >
                                                <span className={styles['instrument-group-tab']}>{c[0]}</span>
                                            </Tabs.Trigger>
                                        ))
                                    }
                                </Tabs.List>
                                {groupedCrypto.map(c => (
                                    <Tabs.Content
                                        key={c[0]}
                                        value={c[0]}
                                    >
                                        <MacroPanelTab
                                            instruments={c[1]}
                                            showCharts={true}
                                            showPopupAction={showPopup}
                                        />
                                    </Tabs.Content>
                                ))}
                            </Tabs.Root>)
                    }
                    <hr className={styles['divider']} />
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
                                instrument && (
                                    <MarketDataTile
                                        instrument={instrument}
                                        showFinancialData={false}
                                        showPriceSummary={false}
                                        className={styles['market-data-graph-popup']}
                                        ignoreNegative={false}
                                        isNegative={instrument.change < 0.0}
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
    );
}