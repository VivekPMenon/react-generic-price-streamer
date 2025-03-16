'use client';

import React, { useState } from 'react';
import styles from './market-data.module.scss';
import {useMarketDataStore} from "@/services/market-data/market-data-store";
import {MarketDataTile} from "@/components/market-data/market-data-tile";
import {ImageType} from "@/services/market-data";

export function MarketData() {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const {instruments, isLoading, error, findInstrument, removeInstrument, getInstrumentLogoUrl} = useMarketDataStore();

    function search(event: any) {
        const inputValue = event.target.value;
        if (event.key !== "Enter") {
            return;
        }

        if (!inputValue?.trim()) {
            return;
        }

        findInstrument(inputValue);
    }

    return (
        <div className={styles['market-data-container']}>
            <div className={styles['filter-panel']}>
                Search:
                <div className={styles['filter']}>
                    <div className={styles['search-box']}>
                        <input
                           type='text'
                           className='mb-2'
                           disabled={isLoading}
                           placeholder='Search Ticker/Company name or ask the AI Chatbot'
                           autoFocus={true}
                           autoComplete='on'
                           value={searchQuery}
                           onChange={event => setSearchQuery(event.target.value)}
                           onKeyDown={event => search(event)}
                        />
                        {
                            searchQuery ? <i className='fa-solid fa-remove' onClick={() => {
                                setSearchQuery('');
                            }}></i> : <i className='fa-solid fa-magnifying-glass'></i>
                        }
                    </div>
                    <div className={`${styles['error']}`}>{error}</div>
                </div>
            </div>
            <div className={`${styles['market-data-tiles-container']} horizontal-scrollable-div`}>
                {
                    instruments.map(instrument => (
                        <MarketDataTile
                            key={instrument.ticker}
                            instrument={instrument}
                            removeInstrument={removeInstrument}
                            logoUrl={getInstrumentLogoUrl(instrument, ImageType.PNG, 100)}
                        />
                    ))
                }
            </div>
        </div>
   );
}