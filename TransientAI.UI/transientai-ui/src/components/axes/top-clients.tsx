'use client'

import {useState} from 'react';
import {useProductBrowserStore} from "@/services/product-browser-data/product-browser-store";
import {Spinner} from "@radix-ui/themes";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import styles from './todays-axes.module.scss';
import {productBrowserDataService, RecommendedClient} from "@/services/product-browser-data";
import {useChatbotDataStore} from "@/services/chatbot-data/chatbot-data-store";

interface ClientProps {
    client: RecommendedClient;
}

function ClientComponent({ client }: ClientProps) {
    const { loadSimilarBondsInHoldings, loadTradesForBonds, selectedBond } = useProductBrowserStore();
    const [isLoadingDescription, setIsLoadingDescription] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [description, setDescription] = useState<string>('');

    function loadDescription(client: RecommendedClient) {
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

    function loadHoldings() {
        loadSimilarBondsInHoldings(selectedBond, client.client_name);
    }

    function loadTrades() {
        loadTradesForBonds(selectedBond);
    }

    function findBondsOfInterest() {
        useChatbotDataStore.getState().setQuery(`What other axes should I recommend to ${client.client_name}?`);
    }

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
                    <div><i className="fa-solid fa-comments" onClick={() => {}}></i></div>
                    <div><i className="fa-solid fa-warehouse" onClick={loadHoldings}></i></div>
                    <div><i className="fa-solid" onClick={loadTrades}><span style={{color:'green'}}>B</span>/<span style={{color:'red'}}>S</span></i></div>
                    <div><i className="fa-solid fa-gavel" onClick={findBondsOfInterest}></i></div>
                    <div><i className="fa-regular fa-address-book" onClick={() => {}}></i></div>
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
                        Total {traces.reduce((accumulator, current) => accumulator + (current.size_m || 0), 0)} trd
                        today
                    </div>
                    <div className={`${styles['trace']}`}>
                        {
                            traces
                                .slice(0, 3)
                                .map((element, index) => (
                                    <li key={index}>{element.side === 'buy' ? 'DB' : 'DS'} {element.size_m} {element.spread_change}</li>
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
                </div>
            )
        }
    }

    return (
        <div className={`${styles['recommendation-container']}`}>
            <div className='sub-header'>Top Recommendations</div>
            <div className={`${styles['recommendation-header']}`}>
                <span className={`${styles['description']}`}>{selectedBond?.product_description}</span>
                <span className={`${styles['size']}`}>
                         { selectedBond
                             ?
                             (<li>
                                    {
                                        selectedBond.b_axe === 'Y'
                                            ? ('Axed: +' + (selectedBond?.b_spread ?? '-') + ' Bid ' + (selectedBond?.bid_price?? '-'))
                                            : ('Axed: ' + (selectedBond?.a_size_m ?? '-') + ' @ +' + (selectedBond?.a_spread ?? '-'))
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
