'use client'

import {productBrowserStore} from "@/services/product-browser-data/product-browser-store";
import {NewsComponent} from "@/components/news/news-component";

export function BondNews() {
    const isNewsForBondLoading = productBrowserStore.use.isNewsForBondLoading();
    const bondNews = productBrowserStore.use.bondNews();

    return (
        <NewsComponent
            heading={'News'}
            isLoading={isNewsForBondLoading}
            news={bondNews}
         />
    );
}