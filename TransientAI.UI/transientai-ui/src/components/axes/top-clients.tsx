'use client'

import {useState} from 'react';
import {useProductBrowserStore} from "@/services/product-browser-data/product-browser-store";
import {Spinner} from "@radix-ui/themes";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import styles from './todays-axes.module.scss';
import {RecommendedBond, RecommendedClient} from "@/services/product-browser-data";

interface ClientProps {
    client: RecommendedClient;
    selectedClient: string|null;
    setSelectedClient: (client_name: string) => void;
    loadRecommendedBondsForClient: (client_name: string) => Promise<RecommendedBond[]>;
}

function ClientComponent(
    {
        client,
        setSelectedClient,
        loadRecommendedBondsForClient
    }: ClientProps) {

    const [isLoadingBonds, setIsLoadingBonds] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [bonds, setBonds] = useState<RecommendedBond[]|null>(null);

    function loadBonds(client: RecommendedClient) {
        const newOpen = !open;
        if (bonds) {
            setOpen(newOpen);
            return;
        }

        if (newOpen) {
            setIsLoadingBonds(true);
            loadRecommendedBondsForClient(client.client_name)
                .then(result => {
                    setBonds(result);
                })
                .finally(() => {
                    setIsLoadingBonds(false);
                    setOpen(newOpen);
                });
        }
    }

    return (
        <div
            className={`news-item prevent-text-selection ${styles['client-item']} }`}
            key={client.client_name}
            onDoubleClick={() => {
                setSelectedClient(client.client_name);
                loadBonds(client);
            }}
        >
            <div className={`${styles['news-header']}`}>
                <div className={`${styles['header']}`}>
                    <div className={`news-title ${styles['title']}`}>
                        {client.client_name}
                    </div>
                    <div className={`${styles['expander']}`}>
                        {
                            isLoadingBonds
                            ? (<Spinner size={"1"} />)
                            : (<ChevronDownIcon
                                    className={`${styles['expander-button' + (open ? '-open' : '')]}`}
                                    onClick={() => loadBonds(client)} />)
                        }
                    </div>
                </div>
                <div className={`${styles['icons']}`}>
                    <i className="fa-solid fa-comments"></i>
                    <i className="fa-solid fa-warehouse"></i>
                    <i className="fa-solid">B/S</i>
                    <i className="fa-solid fa-gavel"></i>
                    <i className="fa-regular fa-address-book"></i>
                </div>
                <div
                    className={`${styles['expanded-section']}`}
                    style={{
                        display: open ? "block" : "none"
                    }}>
                    <hr/>
                    <div className={`${styles['bonds-container']} scrollable-div`}>
                    {
                        !bonds || bonds.length === 0
                            ? (<span>No bonds</span>)
                            : (bonds.map(bond => {
                                return (
                                    <div
                                        key={bond.isin}
                                        className={`${styles['bond-item']}`}>
                                        <span>{bond.product_description}</span>
                                    </div>
                                );
                            }))
                    }
                    </div>
                </div>
            </div>
        </div>
    )
}

export function TopClients() {
    const { isRecommendedClientsLoading, selectedBond, selectedClient, loadRecommendedBondsForClient, setSelectedClient, recommendedClients } = useProductBrowserStore();

    let content;
    if (isRecommendedClientsLoading) {
        content = (<Spinner />);
    } else {
        content = (
            <div className={`news scrollable-div ${styles['recommended-clients']}`}>
                {
                    recommendedClients?.map(client =>
                        <ClientComponent
                            key={client.client_name}
                            client={client}
                            selectedClient={selectedClient}
                            setSelectedClient={setSelectedClient}
                            loadRecommendedBondsForClient={loadRecommendedBondsForClient}
                        />)
                }
            </div>
        )
    }

    return (
        <div className={`${styles['recommendation-container']}`}>
            <div className='sub-header'>Top Recommendations</div>
            <div>
                {selectedBond?.product_description}
                {selectedBond?.a_size_m}
            </div>
            <div>
                {
                    content
                }
            </div>
        </div>
    );
}
