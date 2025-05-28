'use client';

import React, {useEffect, useState, memo, useRef} from 'react';
import styles from './market-data.module.scss';
import {marketDataStore} from "@/services/market-data/market-data-store";
import {MarketDataTile} from "@/components/market-data/market-data-tile";
import {ImageType, marketDataService, PeriodType, TickerSuggestion} from "@/services/market-data";
import { Spinner } from '@radix-ui/themes';

function MarketData() {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedTicker, setSelectedTicker] = useState<string>('');
    const [tickerSuggestions, setTickerSuggestions] = useState<TickerSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const [isSearching, setIsSearching] = useState(false);

    const instruments = marketDataStore.use.instruments();
    const isLoading = marketDataStore.use.isLoading();
    const error = marketDataStore.use.error();
    const findInstrument = marketDataStore.use.findInstrument();
    const removeInstrument = marketDataStore.use.removeInstrument();
    const getInstrumentLogoUrl = marketDataStore.use.getInstrumentLogoUrl();
    const clearAllInstruments = marketDataStore.use.clearAllInstruments();

    useEffect(() => {
        if (!isLoading) {
            setSearchQuery('');
            setSelectedTicker('');
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

    useEffect(() => {
        if (searchQuery.trim().length === 0) {
            setTickerSuggestions([]);
            setShowSuggestions(false);
            setIsSearching(false);
            return;
        }

        setShowSuggestions(true);
        setIsSearching(true);

        let active = true;

        const handler = setTimeout(async () => {
            try {
                const tickers = await marketDataService.getTickerSuggestion(searchQuery);
                if (active) {
                    setTickerSuggestions(tickers);
                    setIsSearching(false);
                }
            } catch (error) {
                if (active) {
                    setIsSearching(false);
                    setTickerSuggestions([]);
                }
            }
        }, 300);

        return () => {
            active = false;
            clearTimeout(handler);
        };
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setShowSuggestions(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.addEventListener('mousedown', handleClickOutside);
        }
    }, []);

    function handleSuggestionClick(ticker: string) {
        setSearchQuery('');
        setSelectedTicker(ticker);
        setShowSuggestions(false);
        setTickerSuggestions([]);
        findInstrument(ticker, PeriodType.ONE_YEAR, false);
    }

    return (
        <div className={styles['market-data-container']}>
            <div className={styles['filter-panel']}>
                Search:
                <div className={styles['filter']}>
                    <div className={styles['search-box']}>
                        <input
                            type='text'
                            disabled={isLoading}
                            placeholder='Search Ticker/Company name or ask the AI Chatbot'
                            className='!p-2'
                            autoFocus={true}
                            autoComplete='on'
                            value={searchQuery || selectedTicker}
                            onChange={event => 
                            {
                                setSearchQuery(event.target.value);
                                setSelectedTicker(event.target.value);
                            }
                            }
                            onKeyDown={event => search(event)}
                        />
                        {
                            isLoading
                                ? (<Spinner size='3' className='ml-2'></Spinner>)
                                : searchQuery ? <i className='fa-solid fa-remove' onClick={() => {
                                    setSearchQuery('');
                                }}></i> : <i className='fa-solid fa-magnifying-glass'></i>
                        }

                        {showSuggestions && (
                            <div
                                ref={suggestionsRef}
                                className="absolute top-12 left-0 right-0 horizontal-scrollable-div scrollable-div bg-[#1E2128] border border-teal-900 rounded-b-md shadow-lg z-50 max-h-80"
                                style={{ maxHeight: 200, overflowY: 'auto' }}
                            >
                                {isSearching ? (
                                    <div className="px-4 py-2 text-gray-400 text-xs">
                                        Searching...
                                    </div>
                                ) : (
                                    <ul>
                                        {tickerSuggestions.length > 0 ? (
                                            tickerSuggestions.map((ticker, idx) => (
                                                <li
                                                    key={ticker.symbol}
                                                    className="px-4 py-2 cursor-pointer hover:bg-gray-800 border-b border-gray-800 last:border-b-0"
                                                    onClick={() => handleSuggestionClick(ticker.symbol!)}
                                                >
                                                    <span className="text-sm truncate">{ticker.symbol}</span>
                                                    <span className="text-xs text-gray-400 ml-2">{ticker.name}</span>
                                                </li>
                                            ))
                                        ) : (
                                            <div className="px-4 py-2 text-gray-400 text-xs">
                                                No results found
                                            </div>
                                        )}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                    <button
                        type={'button'}
                        className={`${styles['clear-button']} button`}
                        disabled={instruments.length === 0}
                        content={'Clear All'}
                        onClick={() => clearAllInstruments()}
                    >Clear All
                    </button>
                </div>
                <div className={`${styles['error']}`}>{error}</div>
            </div>
            <div className={`horizontal-scrollable-div scrollable-div ${styles['market-data-tiles-container']}`}>
                {
                    instruments.map(instrument => (
                        <MarketDataTile
                            key={instrument.ticker}
                            instrument={instrument}
                            removeInstrument={removeInstrument}
                            logoUrl={getInstrumentLogoUrl(instrument, ImageType.SVG, 100)}
                            showFinancialData={true}
                            showPriceSummary={true}
                            ignoreNegative={true}
                        />
                    ))
                }
            </div>
        </div>
    );
}

export default memo(MarketData);