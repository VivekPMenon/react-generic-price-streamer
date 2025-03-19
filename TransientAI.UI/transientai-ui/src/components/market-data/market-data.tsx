'use client';

import React, {useEffect, useState} from 'react';
import styles from './market-data.module.scss';
import {useMarketDataStore} from "@/services/market-data/market-data-store";
import {MarketDataTile} from "@/components/market-data/market-data-tile";
import {ImageType, PeriodType} from "@/services/market-data";
import { Spinner } from '@radix-ui/themes';

export function MarketData() {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const {instruments, isLoading, error, maxInstruments, findInstrument, removeInstrument, getInstrumentLogoUrl, clearAllInstruments} = useMarketDataStore();

    useEffect(() => {
        if (!isLoading) {
            setSearchQuery('');
        }
    }, [isLoading]);

    function search(event: any) {
        const inputValue = event.target.value;
        if (event.key !== "Enter") {
            return;
        }

        if (!inputValue?.trim()) {
            return;
        }

        findInstrument(inputValue, PeriodType.ONE_YEAR, false);
    }

    return (
        <div className={styles['market-data-container']}>
            <div className={styles['filter-panel']}>
                Search:
                <div className={styles['filter']}>
                    <div className={styles['search-box']}>
                        <input
                           type='text'
                           disabled={isLoading || maxInstruments}
                           placeholder='Search Ticker/Company name or ask the AI Chatbot'
                           autoFocus={true}
                           autoComplete='on'
                           value={searchQuery}
                           onChange={event => setSearchQuery(event.target.value)}
                           onKeyDown={event => search(event)}
                        />
                        {
                            isLoading
                                ? (<Spinner size='3' className='ml-2'></Spinner>)
                                : searchQuery ? <i className='fa-solid fa-remove' onClick={() => {
                                    setSearchQuery('');
                                  }}></i> : <i className='fa-solid fa-magnifying-glass'></i>
                        }
                    </div>
                    <div className={`${styles['error']}`}>{error}</div>
                    <button
                        type={'button'}
                        className={`${styles['clear-button']} button`}
                        disabled={instruments.length === 0}
                        content={'Clear All'}
                        onClick={() => clearAllInstruments()}
                    >Clear All</button>
                </div>
            </div>
            <div className={`${styles['market-data-tiles-container']} horizontal-scrollable-div scrollable-div`}>
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