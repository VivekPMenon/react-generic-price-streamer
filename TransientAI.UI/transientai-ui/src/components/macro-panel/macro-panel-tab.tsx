import React from 'react';
import {IInstrument} from "@/services/macro-panel-data/model";
import {MacroInstrument} from "@/components/macro-panel/macro-instrument";
import styles from './macro-panel-tabs.module.scss';
import {Instrument} from "@/services/market-data";

export interface MacroPanelTabProps {
    instruments: IInstrument[];
    showCharts: boolean;
    showPopupAction: (instrument: Instrument) => void;
    changeSuffix?: string
    inverseChange?: boolean;
}

export function MacroPanelTab({instruments, showCharts, showPopupAction, changeSuffix, inverseChange} : MacroPanelTabProps) {
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
                        {...instrument}
                    />
                ))
            }
        </div>
    );
}