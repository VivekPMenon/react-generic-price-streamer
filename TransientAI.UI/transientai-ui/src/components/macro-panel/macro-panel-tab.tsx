import React, {memo} from 'react';
import {IInstrument, MarketDataType} from "@/services/macro-panel-data/model";
import MacroInstrument from "@/components/macro-panel/macro-instrument";
import {MarketData} from "@/services/market-data";
import styles from './macro-panel-tabs.module.scss';

export interface MacroPanelTabProps {
    instruments: IInstrument[];
    showCharts: boolean;
    showPopupAction: (symbol: string, type?: MarketDataType, marketData?: MarketData[]) => void;
    changeSuffix?: string
    inverseChange?: boolean;
    setReportGenerationDate?: (value: Date|null) => void;
}

function MacroPanelTab({instruments, showCharts, showPopupAction, changeSuffix, inverseChange, setReportGenerationDate} : MacroPanelTabProps) {
    return (
        <div className={`${styles['macro-tab']}`}>
            {
                instruments?.length && instruments.map((instrument) => (
                    <MacroInstrument
                        key={instrument.name}
                        showCharts={showCharts}
                        showPopupAction={showPopupAction}
                        changeSuffix={changeSuffix}
                        inverseChange={inverseChange}
                        setReportGenerationDate={setReportGenerationDate}
                        {...instrument}
                    />
                ))
            }
        </div>
    );
}

export default memo(MacroPanelTab);