'use client'

import {useCallback, useState} from 'react';
import {useProductBrowserStore} from "@/services/product-browser-data/product-browser-store";
import {Spinner} from "@radix-ui/themes";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import {productBrowserDataService, RecommendedClient} from "@/services/product-browser-data";
import {useChatbotDataStore} from "@/services/chatbot-data/chatbot-data-store";
import { Tooltip } from 'react-tooltip'

import styles from './todays-axes.module.scss';
import {formatDecimal, formatShortenedRoman} from "@/lib/utility-functions";

interface ClientProps {
    client: RecommendedClient;
}

function ClientComponent({ client }: ClientProps) {
    const { loadSimilarBondsInHoldings, loadClientTrades, selectedBond } = useProductBrowserStore();
    const [isLoadingDescription, setIsLoadingDescription] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [description, setDescription] = useState<string>('');

    function loadDescription(client: RecommendedClient) {
        if (isLoadingDescription) {
            return;
        }

        const newOpen = !open;
        if (description) {
            setOpen(newOpen);
            return;
        }

        if (newOpen && selectedBond) {
            setIsLoadingDescription(true);
            productBrowserDataService.getRecommendationExplanation(selectedBond, client.client_name)
                .then(result => {
                    setDescription(result);
                })
                .finally(() => {
                    setIsLoadingDescription(false);
                    setOpen(newOpen);
                });
        }
    }

    const loadHoldings = useCallback(() => loadSimilarBondsInHoldings(selectedBond, client.client_name),
        [client.client_name, loadSimilarBondsInHoldings, selectedBond]);

    const loadTrades = useCallback(() => loadClientTrades(selectedBond, client.client_name),
        [client.client_name, loadClientTrades, selectedBond]);

    const findBondsOfInterest = useCallback(() => useChatbotDataStore.getState().createThread(`What other axes should I recommend to ${client.client_name}?`),
        [client.client_name]);

    return (
        <div
            className={`news-item prevent-text-selection ${styles['client-item']}`}
            key={client.client_name}
            onDoubleClick={() => loadDescription(client)}
        >
            <div className={`${styles['news-header']}`}>
                <div className={`${styles['header']}`}>
                    <div className={`news-title ${styles['title']}`}>
                        {client.client_name}
                    </div>
                    <div className={`${styles['expander']}`}>
                        {
                            isLoadingDescription
                                ? (<Spinner size={"1"} />)
                                : (<ChevronDownIcon
                                    className={`${styles['expander-button' + (open ? '-open' : '')]}`}
                                    onClick={() => loadDescription(client)} />)
                        }
                    </div>
                </div>
                <div className={`${styles['icons']}`}>
                    <div
                        data-tooltip-id="clients-tooltip"
                        data-tooltip-content="Voice/Chat"
                        data-tooltip-place="top"><i className="fa-solid fa-comments" onClick={() => {}}/></div>
                    <div
                        data-tooltip-id="clients-tooltip"
                        data-tooltip-content="Check client holdings"
                        data-tooltip-place="top"><i className="fa-solid fa-warehouse" onClick={loadHoldings} /></div>
                    <div
                        data-tooltip-id="clients-tooltip"
                        data-tooltip-content="Check client trades"
                        data-tooltip-place="top"><i className="fa-solid" onClick={loadTrades}><span style={{color:'green'}}>B</span>/<span style={{color:'red'}}>S</span></i></div>
                    <div
                        data-tooltip-id="clients-tooltip"
                        data-tooltip-content="Find other bonds of interest"
                        data-tooltip-place="top"><i className="fa-solid fa-gavel" onClick={findBondsOfInterest} /></div>
                    <div
                        data-tooltip-id="clients-tooltip"
                        data-tooltip-content="Client info"
                        data-tooltip-place="top"><i className="fa-regular fa-address-book" onClick={() => {}} /></div>
                </div>
                <div
                    className={`${styles['expanded-section']}`}
                    style={{
                        display: open ? "block" : "none"
                    }}>
                    <hr/>
                    <div className={`${styles['bonds-container']} scrollable-div`}>
                        <div className={`${styles['bond-item']}`}>
                            <span>{description}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function TopClients() {
    const { isRecommendedClientsLoading, selectedBond, recommendedClients, traces } = useProductBrowserStore();

    let content;
    if (isRecommendedClientsLoading) {
        content = (<div><Spinner /></div>);
    } else {
        if (!selectedBond) {
            content = (<div />)
         } else {
            content = (
                <div>
                    <div className={`${styles['trace-header']}`}>
                        TRACE
                        Total {formatShortenedRoman(traces.reduce((accumulator, current) => accumulator + (current.size_m || 0), 0), 1, '-', true, 1)} trd
                        today
                    </div>
                    <div className={`${styles['trace']}`}>
                        {
                            traces
                                .slice(0, 3)
                                .map((element, index) => (
                                    <li key={index}>{element.side === 'buy' ? 'DB' : 'DS'} {formatShortenedRoman(element.size_m, 1, '-', true, 1)} {formatDecimal(element.spread_change, '-', 2)}</li>
                                ))
                        }
                    </div>
                    <div className={`news scrollable-div ${styles['recommended-clients']}`}>
                        {
                            recommendedClients?.map(client =>
                                <ClientComponent
                                    key={client.client_name}
                                    client={client}
                                />)
                        }
                    </div>
                    <Tooltip id='clients-tooltip' variant='light'/>
                </div>
            )
        }
    }

    return (
        <div className={`${styles['recommendation-container']}`}>
            <div className='sub-header'>Top Recommendations</div>
            <div className={`${styles['recommendation-header']}`}>
                <span className={`${styles['issuer']}`}>{selectedBond?.bond_issuer}</span>
                <span className={`${styles['description']}`}>{selectedBond?.product_description}</span>
                <span className={`${styles['size']}`}>
                         { selectedBond
                             ?
                             (<li>
                                    {
                                        selectedBond.b_axe === 'Y'
                                            ? ('Axed: +' + (selectedBond?.b_spread ?? '-') + ' Bid ' + (formatShortenedRoman(selectedBond?.b_size_m, 1,  '-', true, 1)))
                                            : ('Axed: ' + (formatShortenedRoman(selectedBond?.a_size_m, 1, '-', true, 1)) + ' @ +' + (selectedBond?.a_spread ?? '-'))
                                    }
                             </li>)
                             : null
                        }
                </span>
            </div>
            {
                content
            }
        </div>
    );
}
