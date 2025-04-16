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
        selectedClient,
        setSelectedClient,
        loadRecommendedBondsForClient
    }: ClientProps) {

    const [isLoadingBonds, setIsLoadingBonds] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [bonds, setBonds] = useState<RecommendedBond[]|null>(null);

    function loadBonds(client: RecommendedClient) {
        const newOpen = !open;
        setOpen(newOpen);
        if (bonds) {
            return;
        }

        if (newOpen) {
            setIsLoadingBonds(true);
            setBonds([]);
            loadRecommendedBondsForClient(client.client_name)
                .then(bonds => {
                    setBonds(bonds);
                })
                .finally(() => {
                    setIsLoadingBonds(false);
                });
        }
    }

    return (
        <div
            className={`news-item prevent-text-selection ${selectedClient === client.client_name ? styles['selected-client'] : ''}`}
            key={client.client_name}
            onDoubleClick={() => setSelectedClient(client.client_name)}
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
                <div
                    className={`${styles[(!bonds || bonds.length === 0 ? 'no-' : '') + 'bonds']}`}
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
                                    <div key={bond.isin}>{bond.product_description}</div>
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
    const { isRecommendedClientsLoading, selectedClient, loadRecommendedBondsForClient, setSelectedClient, recommendedClients } = useProductBrowserStore();

    let content;
    if (isRecommendedClientsLoading) {
        content = (<Spinner />);
    } else {
        content = (
            <div className={`news scrollable-div`} style={{gap: '3px'}}>
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
        <div>
            <div className='sub-header'>Top Recommendations</div>
            <div>
                {
                    content
                }
            </div>
        </div>
    );
}
