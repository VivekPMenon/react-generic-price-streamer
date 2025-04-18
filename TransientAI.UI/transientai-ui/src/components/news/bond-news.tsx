'use client'

import {useProductBrowserStore} from "@/services/product-browser-data/product-browser-store";
import {NewsComponent} from "@/components/news/news-component";

export function BondNews() {
    const { isNewsForBondLoading, bondNews } = useProductBrowserStore();

    return (
        <NewsComponent
            heading={'News'}
            isLoading={isNewsForBondLoading}
            news={bondNews}
         />
    );
}